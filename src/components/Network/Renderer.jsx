import * as c3 from "@mapequation/c3";
import Infomap from "@mapequation/infomap";
import * as d3 from "d3";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import useStore from "../../store";

const MAX_COLORS = 100;
const scheme = c3.colors(MAX_COLORS, { scheme: "Sinebow", lightness: 0.8 });

const im = new Infomap();

const minRadius = 2;
const maxRadius = 6;
const minLinkWidth = 0.2;
const maxLinkWidth = 1;

export default observer(function Renderer() {
  const store = useStore();

  const [network, setNetwork] = useState(null);
  const [maxNodeFlow, setMaxNodeFlow] = useState(1);
  const [maxLinkFlow, setMaxLinkFlow] = useState(1);
  const [directed, setDirected] = useState(false);

  const nodeRadius = d3
    .scaleSqrt([0, maxNodeFlow])
    .range([minRadius, maxRadius]);

  const linkWidth = d3
    .scaleLinear()
    .domain([0, maxLinkFlow])
    .range([minLinkWidth, maxLinkWidth]);

  const fill = (node) => {
    const moduleId = store.output.modules.get(node.id);

    if (!moduleId) {
      return "#e6e6e6";
    }

    return scheme[moduleId % MAX_COLORS];
  };

  useEffect(() => {
    console.log("Network run Infomap");

    im.runAsync({
      network: store.network.value,
      args: store.params.noInfomapArgs,
    })
      .then((result) => parseNetwork(result.flow_as_physical || result.flow))
      .then(({ maxNodeFlow, maxLinkFlow, ...network }) => {
        setNetwork(network);
        setMaxNodeFlow(maxNodeFlow);
        setMaxLinkFlow(maxLinkFlow);
        setDirected(/(-d\s)|(--directed\s)/.test(store.params.noInfomapArgs));
      })
      .catch((error) => console.warn(error));
  }, [store.network.value, store.params.noInfomapArgs]);

  useEffect(() => {
    if (!network) return;
    console.log("Network update simulation");

    const simulation = d3
      .forceSimulation(network.nodes)
      .force("center", d3.forceCenter(0, 0).strength(1))
      .force("collide", d3.forceCollide(maxRadius))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force(
        "link",
        d3
          .forceLink(network.links)
          .distance(10)
          .strength((d) => linkWidth(d.flow))
      );

    const g = d3.select("#zoomable");

    const node = g
      .selectAll(".node")
      .data(network.nodes)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx += event.dx;
            d.fy += event.dy;
          })
          .on("end", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0).restart();
            }
            d.fx = null;
            d.fy = null;
          })
      );

    const link = g.selectAll(".link").data(network.links);
    const circle = node.select("circle");
    const text = node.select("text");

    function drawLink(d) {
      const arrowPadding = directed ? 1.5 * linkWidth(d.flow) : 0.4;
      const r1 = nodeRadius(d.source.flow) + arrowPadding;
      const r2 = nodeRadius(d.target.flow) + arrowPadding;
      const x1 = d.source.x || 0;
      const y1 = d.source.y || 0;
      const x2 = d.target.x || 0;
      const y2 = d.target.y || 0;
      const dx = x2 - x1 || 1e-6;
      const dy = y2 - y1 || 1e-6;
      const l = Math.sqrt(dx * dx + dy * dy);
      const x = dx / l;
      const y = dy / l;

      d3.select(this)
        .attr("x1", x1 + r1 * x)
        .attr("y1", y1 + r1 * y)
        .attr("x2", x2 - r2 * x)
        .attr("y2", y2 - r2 * y);
    }

    simulation.on("tick", () => {
      link.each(drawLink);
      circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [network, directed, nodeRadius, linkWidth]);

  const linkColor = "#ccc";

  return (
    <>
      <defs>
        <marker
          id="arrow"
          markerHeight={2.5}
          markerWidth={2.5}
          orient="auto"
          refX="right"
          viewBox="-5 -5 10 10"
        >
          <path d="M 0,0 m -5,-5 L 5,0 L -5,5 Z" fill={linkColor} />
        </marker>
      </defs>

      <g
        className="links"
        stroke={linkColor}
        markerEnd={directed ? "url(#arrow)" : "none"}
      >
        {network?.links.map((link) => (
          <line
            key={`${link.source?.id ?? 0}-${link.target?.id ?? 0}`}
            className="link"
            strokeWidth={linkWidth(link.flow)}
          />
        ))}
      </g>

      <g
        className="nodes"
        fill="#444"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeLinejoin="round"
        paintOrder="stroke"
        fontFamily="Helvetica, sans-serif"
        cursor="pointer"
      >
        {network?.nodes.map((node) => {
          const r = nodeRadius(node.flow);
          const fontSize = Math.max(r, 3);
          return (
            <g key={node.id} className="node">
              <circle fill={fill(node)} strokeWidth={0} r={r} />
              <text
                fontSize={fontSize}
                textAnchor="middle"
                dy={fontSize / 3}
                strokeWidth={fontSize / 5}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </g>
    </>
  );
});

function parseNetwork(network) {
  const lines = network.split("\n").filter(Boolean);

  const nodes = new Map();
  const links = [];

  let context = null;

  let maxNodeFlow = 0;
  let maxLinkFlow = 0;

  for (let line of lines) {
    if (line.startsWith("#")) {
      continue;
    }

    if (line.startsWith("*")) {
      context = line;
      continue;
    }

    if (context === "*Vertices" || context === "*Nodes") {
      const match = line.match(/^(\d+)\s+"(.+)"\s+(.+)/);
      if (match) {
        const id = Number(match[1]);
        const name = match[2];
        const flow = Number(match[3]);
        maxNodeFlow = Math.max(maxNodeFlow, flow);
        nodes.set(id, { id, name, flow });
      }
    } else if (
      context === "*Edges" ||
      context === "*Links" ||
      context === "*Arcs"
    ) {
      const [sourceId, targetId, flow] = line.split(" ").map(Number);
      const source = nodes.get(sourceId);
      const target = nodes.get(targetId);
      if (!source || !target) continue;
      maxLinkFlow = Math.max(maxLinkFlow, flow);
      links.push({ source, target, flow });
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    links,
    maxNodeFlow,
    maxLinkFlow,
  };
}
