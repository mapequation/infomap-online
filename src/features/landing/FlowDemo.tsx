import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  type FlowDemoLink,
  flowDemoLinks,
  flowDemoNodes,
  flowDemoScheme,
} from "./flow-demo-data";

type WalkState = {
  currentId: number;
  previousId: number | null;
  teleported: boolean;
};

const viewBox = {
  width: 800,
  height: 800,
  minX: 50,
  maxX: 650,
  minY: 50,
  maxY: 700,
};

const walkerInterval = 570;
const walkerDuration = 555;
const googleTeleportRate = 0.15;
const pageRankIterations = 100;
const minNodeRadius = 15;
const maxNodeRadius = 36;
const nodeLinkGap = 7;
const walkerRadius = 13;

const scale = (
  value: number,
  domain: [number, number],
  range: [number, number],
) => {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;

  return (
    rangeMin +
    ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin)
  );
};

const chooseWeighted = (links: FlowDemoLink[]) => {
  const totalWeight = links.reduce((total, link) => total + link.weight, 0);
  let threshold = Math.random() * totalWeight;

  for (const link of links) {
    threshold -= link.weight;
    if (threshold <= 0) return link;
  }

  return links[links.length - 1];
};

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

const walkerPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  length: number,
) => {
  const dx = x2 - x1 || 1e-7;
  const dy = y2 - y1 || 1e-7;
  const l = Math.sqrt(dx * dx + dy * dy);
  const dir = { x: dx / l, y: dy / l };
  const xa = x2 + dir.y * r;
  const ya = y2 - dir.x * r;
  const xb = x2 - dir.y * r;
  const yb = y2 + dir.x * r;
  const xDeg = (Math.atan2(dir.y, dir.x) * 180) / Math.PI;
  const tailLength = r + Math.sin(length) * (l - r);

  return `M ${xa} ${ya}
          A ${r} ${r} 0 0 1 ${xb} ${yb}
          A ${tailLength} ${r} ${xDeg} 0 1 ${xa} ${ya}`;
};

const clippedLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sourceClipRadius: number,
  targetClipRadius: number,
) => {
  const dx = x2 - x1 || 1e-7;
  const dy = y2 - y1 || 1e-7;
  const length = Math.sqrt(dx * dx + dy * dy);
  const dir = { x: dx / length, y: dy / length };

  return {
    x1: x1 + dir.x * sourceClipRadius,
    y1: y1 + dir.y * sourceClipRadius,
    x2: x2 - dir.x * targetClipRadius,
    y2: y2 - dir.y * targetClipRadius,
  };
};

export default function FlowDemo() {
  const graph = useMemo(() => {
    const xValues = flowDemoNodes.map((node) => node.x);
    const yValues = flowDemoNodes.map((node) => node.y);
    const xDomain: [number, number] = [
      Math.min(...xValues),
      Math.max(...xValues),
    ];
    const yDomain: [number, number] = [
      Math.min(...yValues),
      Math.max(...yValues),
    ];
    const adjacency = new Map<number, FlowDemoLink[]>();

    for (const link of flowDemoLinks) {
      adjacency.set(link.source, [...(adjacency.get(link.source) ?? []), link]);
      adjacency.set(link.target, [
        ...(adjacency.get(link.target) ?? []),
        { source: link.target, target: link.source, weight: link.weight },
      ]);
    }

    const nodeIds = flowDemoNodes.map((node) => node.id);
    let visitRatesById = new Map(
      nodeIds.map((nodeId) => [nodeId, 1 / nodeIds.length]),
    );

    for (let i = 0; i < pageRankIterations; i++) {
      const nextVisitRatesById = new Map(
        nodeIds.map((nodeId) => [nodeId, googleTeleportRate / nodeIds.length]),
      );

      for (const nodeId of nodeIds) {
        const links = adjacency.get(nodeId) ?? [];
        const linkRate =
          (visitRatesById.get(nodeId) ?? 0) * (1 - googleTeleportRate);

        if (links.length === 0) {
          for (const targetId of nodeIds) {
            nextVisitRatesById.set(
              targetId,
              (nextVisitRatesById.get(targetId) ?? 0) +
                linkRate / nodeIds.length,
            );
          }
          continue;
        }

        const totalWeight = links.reduce(
          (total, link) => total + link.weight,
          0,
        );

        for (const link of links) {
          nextVisitRatesById.set(
            link.target,
            (nextVisitRatesById.get(link.target) ?? 0) +
              linkRate * (link.weight / totalWeight),
          );
        }
      }

      visitRatesById = nextVisitRatesById;
    }

    const visitRates = nodeIds.map((nodeId) => visitRatesById.get(nodeId) ?? 0);
    const rateDomain: [number, number] = [
      Math.min(...visitRates),
      Math.max(...visitRates),
    ];
    const areaRange: [number, number] = [
      minNodeRadius ** 2,
      maxNodeRadius ** 2,
    ];

    const nodes = flowDemoNodes.map((node) => ({
      ...node,
      px: scale(node.x, xDomain, [viewBox.minX, viewBox.maxX]),
      py: scale(node.y, yDomain, [viewBox.minY, viewBox.maxY]),
      radius: Math.sqrt(
        scale(visitRatesById.get(node.id) ?? 0, rateDomain, areaRange),
      ),
    }));
    const nodesById = new Map(nodes.map((node) => [node.id, node]));
    const links = flowDemoLinks.map((link) => ({
      ...link,
      sourceNode: nodesById.get(link.source),
      targetNode: nodesById.get(link.target),
    }));

    return { nodes, nodesById, links, adjacency };
  }, []);
  const [walk, setWalk] = useState<WalkState>({
    currentId: graph.nodes[0].id,
    previousId: null,
    teleported: false,
  });
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress(0);
      setWalk(({ currentId }) => {
        const links = graph.adjacency.get(currentId) ?? [];
        const shouldTeleport =
          links.length === 0 || Math.random() < googleTeleportRate;

        if (shouldTeleport) {
          const targets = graph.nodes.filter((node) => node.id !== currentId);
          const target = targets[Math.floor(Math.random() * targets.length)];

          return {
            currentId: target.id,
            previousId: currentId,
            teleported: true,
          };
        }

        const nextLink = chooseWeighted(links);

        return {
          currentId: nextLink.target,
          previousId: currentId,
          teleported: false,
        };
      });
    }, walkerInterval);

    return () => window.clearInterval(intervalId);
  }, [graph]);

  useEffect(() => {
    if (walk.previousId === null) return;

    let animationFrame = 0;
    let startTime: number | null = null;
    const animate = (time: number) => {
      startTime ??= time;

      const nextProgress = Math.min(1, (time - startTime) / walkerDuration);
      setProgress(easeOutCubic(nextProgress));

      if (nextProgress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    setProgress(0);
    animationFrame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [walk.currentId, walk.previousId]);

  const currentNode = graph.nodesById.get(walk.currentId) ?? graph.nodes[0];
  const previousNode =
    walk.previousId === null ? null : graph.nodesById.get(walk.previousId);
  const walkerX = previousNode
    ? previousNode.px + (currentNode.px - previousNode.px) * progress
    : currentNode.px;
  const walkerY = previousNode
    ? previousNode.py + (currentNode.py - previousNode.py) * progress
    : currentNode.py;
  const visitingNodeId =
    progress > 0.9 ? currentNode.id : (previousNode?.id ?? currentNode.id);

  return (
    <Box
      aria-label="Random walker moving through a four-module network"
      as="figure"
      maxW="350px"
      role="img"
    >
      <svg
        aria-label="Random walker moving through a four-module network"
        role="img"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <g opacity="0.72">
          {graph.links.map(
            ({ source, target, weight, sourceNode, targetNode }) => {
              if (!sourceNode || !targetNode) return null;
              const line = clippedLine(
                sourceNode.px,
                sourceNode.py,
                targetNode.px,
                targetNode.py,
                sourceNode.radius + nodeLinkGap,
                targetNode.radius + nodeLinkGap,
              );

              return (
                <line
                  key={`${source}-${target}`}
                  {...line}
                  stroke="#6F6A62"
                  strokeLinecap="round"
                  strokeWidth={1 + weight * 1.5}
                />
              );
            },
          )}
        </g>

        {graph.nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.px}
            cy={node.py}
            r={node.radius}
            fill={flowDemoScheme[node.module]}
            stroke="transparent"
            strokeWidth={nodeLinkGap * 2}
            style={{
              filter:
                node.id === visitingNodeId
                  ? "brightness(0.86) saturate(0.88)"
                  : "brightness(1)",
              transition: `filter ${walkerDuration * 0.45}ms ease`,
            }}
          />
        ))}

        {previousNode ? (
          <path
            d={walkerPath(
              previousNode.px,
              previousNode.py,
              walkerX,
              walkerY,
              walkerRadius,
              Math.PI * progress,
            )}
            fill="#393939"
            opacity={walk.teleported ? 0.28 : 0.86}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        ) : (
          <circle
            cx={currentNode.px}
            cy={currentNode.py}
            r={walkerRadius}
            fill="#393939"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        )}
      </svg>
    </Box>
  );
}
