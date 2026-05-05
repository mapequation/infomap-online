#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { polygonHull } from "d3-polygon";
import { curveCatmullRomClosed, line as d3Line } from "d3-shape";

const palette = [
  "#EBC384",
  "#DFDDA2",
  "#B4CCDF",
  "#E68C6C",
  "#82A3C9",
  "#5B8E8A",
];

const viewBox = {
  width: 800,
  height: 640,
};

const layoutBounds = {
  xMin: 70,
  xMax: 730,
  yMin: 125,
  yMax: 590,
};

const googleTeleportRate = 0.15;
const pageRankIterations = 100;
const minNodeRadius = 11;
const maxNodeRadius = 25;
const nodeLinkGap = 5;
const highlightColor = "#4b5563";

function scale(value, domain, range) {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;

  if (domainMax === domainMin) return (rangeMin + rangeMax) / 2;
  return (
    rangeMin +
    ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin)
  );
}

function parseArgs(argv) {
  const args = { trace: argv[2] };
  for (let i = 3; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--network") args.network = argv[++i];
    else if (arg === "--layout") args.layout = argv[++i];
    else if (arg === "--out") args.out = argv[++i];
  }
  if (!args.trace || !args.network || !args.layout || !args.out) {
    throw new Error(
      "Usage: node scripts/infomap-trace-renderer.mjs trace.jsonl --network network.net --layout layout.json --out public/trace-demo",
    );
  }
  return args;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseNetwork(raw) {
  const edges = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("*") || trimmed.startsWith("#"))
      continue;
    const [source, target, weight = "1"] = trimmed.split(/\s+/);
    edges.push({ source, target, weight: Number(weight) });
  }
  return edges;
}

function clippedLine(x1, y1, x2, y2, sourceClipRadius, targetClipRadius) {
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
}

function computeFlowMetrics(edges, layout) {
  const nodeIds = Object.keys(layout.nodes);
  const adjacency = new Map(nodeIds.map((nodeId) => [nodeId, []]));

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge);
    adjacency.get(edge.target)?.push({
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
    });
  }

  let visitRatesById = new Map(
    nodeIds.map((nodeId) => [nodeId, 1 / nodeIds.length]),
  );

  for (let i = 0; i < pageRankIterations; i += 1) {
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
            (nextVisitRatesById.get(targetId) ?? 0) + linkRate / nodeIds.length,
          );
        }
        continue;
      }

      const totalWeight = links.reduce((total, link) => total + link.weight, 0);

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
  const rateDomain = [Math.min(...visitRates), Math.max(...visitRates)];
  const areaRange = [minNodeRadius ** 2, maxNodeRadius ** 2];
  const nodes = Object.fromEntries(
    nodeIds.map((nodeId) => [
      nodeId,
      {
        flow: visitRatesById.get(nodeId) ?? 0,
        radius: Math.sqrt(
          scale(visitRatesById.get(nodeId) ?? 0, rateDomain, areaRange),
        ),
      },
    ]),
  );

  const rawLinkFlows = edges.map((edge) => {
    const sourceLinks = adjacency.get(edge.source) ?? [];
    const targetLinks = adjacency.get(edge.target) ?? [];
    const sourceWeight = sourceLinks.reduce(
      (total, link) => total + link.weight,
      0,
    );
    const targetWeight = targetLinks.reduce(
      (total, link) => total + link.weight,
      0,
    );
    return (
      ((visitRatesById.get(edge.source) ?? 0) *
        (1 - googleTeleportRate) *
        edge.weight) /
        sourceWeight +
      ((visitRatesById.get(edge.target) ?? 0) *
        (1 - googleTeleportRate) *
        edge.weight) /
        targetWeight
    );
  });
  const linkFlowDomain = [Math.min(...rawLinkFlows), Math.max(...rawLinkFlows)];

  const links = new Map(
    edges.map((edge, index) => [
      `${edge.source}-${edge.target}`,
      {
        flow: rawLinkFlows[index],
        strokeWidth: scale(rawLinkFlows[index], linkFlowDomain, [1.6, 9]),
      },
    ]),
  );

  return { nodes, links };
}

function eventTitle(eventOrName) {
  const eventName =
    typeof eventOrName === "string" ? eventOrName : eventOrName.event;
  if (eventOrName.presentation === "before_move") return "Preview node move";
  if (eventOrName.presentation === "scan_candidates")
    return "Test candidate modules";
  if (isInternalTuningInit(eventOrName)) return "Initialize tuning subproblem";

  const titles = {
    algorithm_start: "Start algorithm",
    trial_start: "Start trial",
    init_partition: "Start from singletons",
    core_loop_start: "Move nodes greedily",
    node_visit_order: "Choose visit order",
    move_node: "Accept node move",
    core_loop_end: "Finish move loop",
    consolidate_modules: "Aggregate modules",
    fine_tune_start: "Fine tune",
    fine_tune_end: "Fine tune end",
    coarse_tune_start: "Coarse tune",
    coarse_tune_end: "Coarse tune end",
    trial_finished: "Finish trial",
    algorithm_finished: "Final partition",
  };
  return titles[eventName] ?? eventName.replaceAll("_", " ");
}

function phaseLabel(phase) {
  const labels = {
    algorithm: "Algorithm",
    trial: "Trial",
    core: "Move nodes greedily",
    aggregate: "Aggregate modules",
    fine_tune: "Fine tune",
    coarse_tune: "Coarse tune",
  };
  return labels[phase] ?? phase;
}

function canvasPhaseLabel(event) {
  if (event.event === "trial_start") return "Start trial";
  if (event.event === "init_partition" && event.phase === "trial")
    return "Start from singletons";
  if (event.event === "algorithm_finished") return "Final partition";
  return phaseLabel(event.phase ?? "");
}

function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return value.toFixed(3);
}

function moduleColor(module) {
  const index = Math.max(0, Number(module) - 1);
  return palette[index % palette.length];
}

function darkenHex(hex, amount = 0.22) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  );
  return `#${channels
    .map((channel) =>
      Math.max(0, Math.round(channel * (1 - amount)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function isInternalTuningInit(event) {
  return (
    event?.event === "init_partition" &&
    (event.phase === "fine_tune" || event.phase === "coarse_tune")
  );
}

function describeEvent(event) {
  if (event.event === "move_node") {
    const subject =
      event.level > 1 ? `Module group ${event.node}` : `Node ${event.node}`;
    const verb = event.presentation === "before_move" ? "will move" : "moved";
    return `${subject} ${verb} from module ${event.from} to ${event.to}`;
  }
  if (event.presentation === "scan_candidates") {
    const subject =
      event.item_kind === "module_group"
        ? `module group ${event.item}`
        : `node ${event.item}`;
    const candidates = event.candidate_modules?.length
      ? event.candidate_modules.map((module) => `M${module}`).join(", ")
      : "no neighboring modules";
    return `Try moving ${subject} to ${candidates}; no improving move is accepted`;
  }
  if (event.event === "node_visit_order") {
    const subject =
      event.phase === "fine_tune"
        ? "nodes"
        : event.level > 1
          ? "module groups"
          : "nodes";
    return `Visit ${subject}: ${event.order?.join(", ")}`;
  }
  if (isInternalTuningInit(event)) {
    return "Internal tuning setup; the current partition remains in view";
  }
  if (event.event === "consolidate_modules") {
    return "Modules become the active network for the next pass";
  }
  if (event.event === "trial_finished") {
    return `${event.num_top_modules} top modules`;
  }
  if (event.event === "fine_tune_start") {
    return "Revisit individual nodes after aggregation";
  }
  if (event.event === "coarse_tune_start") {
    return "Move coarser groups to escape local minima";
  }
  if (event.event === "algorithm_finished") {
    return "Final four-module partition";
  }
  return phaseLabel(event.phase ?? event.event);
}

function cloneObject(value) {
  return Object.fromEntries(Object.entries(value ?? {}));
}

function cloneGroups(groups) {
  return Object.fromEntries(
    Object.entries(groups ?? {}).map(([group, nodes]) => [group, [...nodes]]),
  );
}

function snapshotVisualState(visualState) {
  return {
    modules: cloneObject(visualState.modules),
    aggregateGroups: cloneGroups(visualState.aggregateGroups),
    activeNodes: [...(visualState.activeNodes ?? [])],
    activeOrder: [...(visualState.activeOrder ?? [])],
    candidateModules: [...(visualState.candidateModules ?? [])],
    sourceModule: visualState.sourceModule,
    targetModule: visualState.targetModule,
  };
}

function fitLayout(layout) {
  const points = Object.values(layout.nodes);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(
    (layoutBounds.xMax - layoutBounds.xMin) / (maxX - minX),
    (layoutBounds.yMax - layoutBounds.yMin) / (maxY - minY),
  );
  const usedWidth = (maxX - minX) * scale;
  const usedHeight = (maxY - minY) * scale;
  const offsetX =
    layoutBounds.xMin + (layoutBounds.xMax - layoutBounds.xMin - usedWidth) / 2;
  const offsetY =
    layoutBounds.yMin +
    (layoutBounds.yMax - layoutBounds.yMin - usedHeight) / 2;

  return {
    ...layout,
    nodes: Object.fromEntries(
      Object.entries(layout.nodes).map(([id, point]) => [
        id,
        {
          x: offsetX + (point.x - minX) * scale,
          y: offsetY + (point.y - minY) * scale,
        },
      ]),
    ),
  };
}

function modulesCoverLayout(modules, layoutNodeIds) {
  const keys = Object.keys(modules ?? {});
  return (
    keys.length === layoutNodeIds.size &&
    keys.every((key) => layoutNodeIds.has(key))
  );
}

function deriveAggregateGroups(modules, layoutNodeIds) {
  const groupsByModule = new Map();
  for (const nodeId of layoutNodeIds) {
    const moduleId = modules[nodeId];
    if (moduleId === undefined) continue;
    const key = String(moduleId);
    if (!groupsByModule.has(key)) groupsByModule.set(key, []);
    groupsByModule.get(key).push(nodeId);
  }

  const groups = {};
  let groupId = 1;
  for (const nodes of groupsByModule.values()) {
    groups[String(groupId)] = nodes;
    groupId += 1;
  }
  return groups;
}

function applyModulesToVisualState(visualState, event, layoutNodeIds) {
  if (!event.modules) return;

  if (modulesCoverLayout(event.modules, layoutNodeIds)) {
    if (isInternalTuningInit(event)) return;

    visualState.modules = cloneObject(event.modules);
    visualState.aggregateGroups = deriveAggregateGroups(
      visualState.modules,
      layoutNodeIds,
    );
    return;
  }

  if (event.event === "consolidate_modules" && event.replace_existing_modules) {
    visualState.aggregateGroups = deriveAggregateGroups(
      visualState.modules,
      layoutNodeIds,
    );
    return;
  }

  for (const [itemId, moduleId] of Object.entries(event.modules)) {
    const nodes = visualState.aggregateGroups[itemId];
    if (!nodes) continue;
    for (const nodeId of nodes) {
      visualState.modules[nodeId] = moduleId;
    }
  }
  if (event.event === "consolidate_modules") {
    visualState.aggregateGroups = deriveAggregateGroups(
      visualState.modules,
      layoutNodeIds,
    );
  }
}

function expandedTraceItems(
  items,
  visualState,
  layoutNodeIds,
  level,
  preferLayoutNodes = false,
) {
  const expanded = [];
  for (const item of items ?? []) {
    const key = String(item);
    if (preferLayoutNodes && layoutNodeIds.has(key)) {
      expanded.push(key);
    } else if (level > 1 && visualState.aggregateGroups[key]) {
      expanded.push(...visualState.aggregateGroups[key]);
    } else if (layoutNodeIds.has(key)) {
      expanded.push(key);
    }
  }
  return expanded;
}

function candidateModulesForNodes(nodes, modules, edges) {
  const activeNodes = new Set(nodes);
  const currentModules = new Set(
    nodes
      .map((nodeId) => modules[nodeId])
      .filter((module) => module !== undefined)
      .map(String),
  );
  const candidates = new Set();

  for (const edge of edges) {
    const sourceIsActive = activeNodes.has(edge.source);
    const targetIsActive = activeNodes.has(edge.target);
    if (!sourceIsActive && !targetIsActive) continue;

    const neighbor = sourceIsActive ? edge.target : edge.source;
    const module = modules[neighbor];
    if (module === undefined) continue;
    const moduleId = String(module);
    if (!currentModules.has(moduleId)) candidates.add(moduleId);
  }

  return [...candidates].sort((a, b) => Number(a) - Number(b));
}

function applyMoveToVisualState(visualState, event, layoutNodeIds) {
  if (event.event !== "move_node" || event.node === undefined) return;

  const itemId = String(event.node);
  const targetNodes =
    event.level > 1 && visualState.aggregateGroups[itemId]
      ? visualState.aggregateGroups[itemId]
      : layoutNodeIds.has(itemId)
        ? [itemId]
        : [];

  for (const nodeId of targetNodes) {
    visualState.modules[nodeId] = event.to;
  }
}

function buildPresentationFrames(events, layout, edges) {
  const layoutNodeIds = new Set(Object.keys(layout.nodes));
  let currentCodelength =
    events.find((event) => typeof event.codelength === "number")?.codelength ??
    undefined;
  const visualState = {
    modules: {},
    aggregateGroups: {},
    activeNodes: [],
    activeOrder: [],
    candidateModules: [],
  };
  const frames = [];

  for (const event of events) {
    if (event.event === "algorithm_start" || event.event === "core_loop_start")
      continue;
    if (isInternalTuningInit(event)) continue;
    if (event.event === "trial_finished") continue;
    if (
      event.event === "consolidate_modules" &&
      event.phase === "coarse_tune" &&
      event.replace_existing_modules
    )
      continue;

    visualState.activeNodes = [];
    visualState.activeOrder = [];
    visualState.candidateModules = [];
    visualState.sourceModule = undefined;
    visualState.targetModule = undefined;

    if (event.event === "move_node") {
      const activeNodes = expandedTraceItems(
        [event.node],
        visualState,
        layoutNodeIds,
        event.level,
      );
      frames.push({
        event: {
          ...event,
          presentation: "before_move",
          display_codelength: currentCodelength,
        },
        visualState: {
          ...snapshotVisualState(visualState),
          activeNodes,
          sourceModule: String(event.from),
          targetModule: String(event.to),
        },
      });
    }

    applyModulesToVisualState(visualState, event, layoutNodeIds);
    applyMoveToVisualState(visualState, event, layoutNodeIds);
    if (typeof event.codelength === "number" && !isInternalTuningInit(event)) {
      currentCodelength = event.codelength;
    }

    if (event.event === "move_node") {
      visualState.activeNodes = expandedTraceItems(
        [event.node],
        visualState,
        layoutNodeIds,
        event.level,
      );
    } else if (event.event === "node_visit_order") {
      visualState.activeOrder = expandedTraceItems(
        event.order,
        visualState,
        layoutNodeIds,
        event.level,
        event.phase === "fine_tune",
      );
    }
    if (event.event === "move_node") {
      visualState.sourceModule = String(event.from);
      visualState.targetModule = String(event.to);
    }

    frames.push({
      event: { ...event, display_codelength: currentCodelength },
      visualState: snapshotVisualState(visualState),
    });

    if (
      event.event === "node_visit_order" &&
      (event.phase === "fine_tune" || event.phase === "coarse_tune")
    ) {
      for (const item of event.order ?? []) {
        const preferLayoutNodes = event.phase === "fine_tune";
        const activeNodes = expandedTraceItems(
          [item],
          visualState,
          layoutNodeIds,
          event.level,
          preferLayoutNodes,
        );
        const candidateModules = candidateModulesForNodes(
          activeNodes,
          visualState.modules,
          edges,
        );
        frames.push({
          event: {
            ...event,
            presentation: "scan_candidates",
            display_codelength: currentCodelength,
            item,
            item_kind: preferLayoutNodes ? "node" : "module_group",
            candidate_modules: candidateModules,
          },
          visualState: {
            ...snapshotVisualState(visualState),
            activeNodes,
            activeOrder: [],
            candidateModules,
          },
        });
      }
    }
  }

  return frames;
}

function hullPath(points) {
  if (points.length === 0) return "";
  const path = d3Line()
    .x((point) => point[0])
    .y((point) => point[1])
    .curve(curveCatmullRomClosed.alpha(0.5))(points);
  return path ?? "";
}

function moduleRegions(layout, modules, flowMetrics) {
  const groups = new Map();
  for (const [node, module] of Object.entries(modules)) {
    if (!layout.nodes[node]) continue;
    if (!groups.has(module)) groups.set(module, []);
    groups.get(module).push({
      ...layout.nodes[node],
      radius: flowMetrics.nodes[node]?.radius ?? minNodeRadius,
    });
  }
  return [...groups.entries()].map(([module, points]) => {
    const hullInput = points.flatMap((point) => {
      const radius = point.radius + 30;
      return Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return [
          point.x + Math.cos(angle) * radius,
          point.y + Math.sin(angle) * radius,
        ];
      });
    });
    const hull = polygonHull(hullInput) ?? hullInput;
    const topPoint = hull.reduce((top, point) => {
      if (
        !top ||
        point[1] < top[1] ||
        (point[1] === top[1] && point[0] < top[0])
      ) {
        return point;
      }
      return top;
    }, undefined);
    return {
      module,
      path: hullPath(hull),
      labelX: Math.max(12, (topPoint?.[0] ?? points[0].x) - 14),
      labelY: Math.max(124, (topPoint?.[1] ?? points[0].y) + 6),
    };
  });
}

function renderFrame({ event, visualState, layout, edges, flowMetrics }) {
  const modules = visualState.modules;
  const activeNodes = new Set(visualState.activeNodes);
  const activeOrder = new Set(visualState.activeOrder);
  const candidateModules = new Set(visualState.candidateModules ?? []);
  const sourceModule = visualState.sourceModule;
  const targetModule = visualState.targetModule;
  const regions =
    event.event === "algorithm_finished"
      ? []
      : moduleRegions(layout, modules, flowMetrics);
  const codelength = formatNumber(event.display_codelength ?? event.codelength);
  const delta = formatNumber(event.delta_codelength);

  const regionSvg = regions
    .map((region) => {
      const color = moduleColor(region.module);
      const label = `M${region.module}`;
      const labelX = region.labelX;
      const labelY = region.labelY;
      const labelWidth = 16 + String(label).length * 8;
      const isTarget = String(region.module) === targetModule;
      const isSource = String(region.module) === sourceModule;
      const isCandidate = candidateModules.has(String(region.module));
      return `<g>
  <path d="${region.path}" fill="${color}" fill-opacity="${isTarget || isCandidate ? "0.17" : "0.09"}" stroke="${isTarget || isCandidate ? highlightColor : color}" stroke-opacity="${isTarget || isCandidate ? "0.74" : "0.55"}" stroke-width="${isTarget || isCandidate ? "3" : "2"}" stroke-linejoin="round" ${isSource && !isTarget ? 'stroke-dasharray="7 5"' : isCandidate ? 'stroke-dasharray="6 5"' : ""} />
  <rect x="${labelX}" y="${labelY}" width="${labelWidth}" height="20" rx="10" fill="#fbfaf8" fill-opacity="0.9" />
  <text x="${labelX + labelWidth / 2}" y="${labelY + 14}" text-anchor="middle" font-family="Open Sans, Arial, sans-serif" font-size="11" font-weight="700" fill="${color}">${escapeXml(label)}</text>
</g>`;
    })
    .join("\n");

  const edgeSvg = edges
    .map((edge) => {
      const source = layout.nodes[edge.source];
      const target = layout.nodes[edge.target];
      const sourceRadius =
        flowMetrics.nodes[edge.source]?.radius ?? minNodeRadius;
      const targetRadius =
        flowMetrics.nodes[edge.target]?.radius ?? minNodeRadius;
      const line = clippedLine(
        source.x,
        source.y,
        target.x,
        target.y,
        sourceRadius + nodeLinkGap,
        targetRadius + nodeLinkGap,
      );
      const relevant =
        activeNodes.size > 0 &&
        (activeNodes.has(edge.source) || activeNodes.has(edge.target));
      const sourceModule = modules[edge.source];
      const targetModule = modules[edge.target];
      const isInternal =
        sourceModule !== undefined &&
        String(sourceModule) === String(targetModule);
      const edgeColor = isInternal
        ? darkenHex(moduleColor(sourceModule), 0.2)
        : "#6F6A62";
      const stroke = relevant && !isInternal ? highlightColor : edgeColor;
      const strokeOpacity = relevant
        ? isInternal
          ? "0.78"
          : "0.72"
        : isInternal
          ? "0.52"
          : "0.26";
      const strokeWidth =
        flowMetrics.links.get(`${edge.source}-${edge.target}`)?.strokeWidth ??
        2;
      return `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" stroke-linecap="round" />`;
    })
    .join("\n");

  const nodeSvg = Object.entries(layout.nodes)
    .map(([id, point]) => {
      const module = modules[id] ?? id;
      const color = moduleColor(module);
      const isActive = activeNodes.has(id);
      const inOrder = activeOrder.has(id);
      const radius = flowMetrics.nodes[id]?.radius ?? minNodeRadius;
      return `<g>
  <circle cx="${point.x}" cy="${point.y}" r="${isActive ? radius + 4 : radius}" fill="${color}" stroke="${isActive ? highlightColor : "#ffffff"}" stroke-width="${isActive ? 4 : 3}" />
  ${inOrder && !isActive ? `<circle cx="${point.x}" cy="${point.y}" r="${radius + 6}" fill="none" stroke="${highlightColor}" stroke-opacity="0.3" stroke-width="2" />` : ""}
  <text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-family="Open Sans, Arial, sans-serif" font-size="${radius >= 17 ? 14 : 12}" font-weight="700" fill="#ffffff">${id}</text>
</g>`;
    })
    .join("\n");

  const detailParts = [];
  if (codelength) detailParts.push(`L = ${codelength}`);
  if (delta) detailParts.push(`Delta L = ${delta}`);
  const detail = detailParts.join("   ");

  return `<svg viewBox="0 0 ${viewBox.width} ${viewBox.height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(eventTitle(event))}">
  <rect width="${viewBox.width}" height="${viewBox.height}" fill="#fbfaf8" />
  <text x="34" y="44" font-family="Open Sans, Arial, sans-serif" font-size="14" font-weight="700" fill="#6b7280">${escapeXml(canvasPhaseLabel(event))}</text>
  <text x="560" y="44" font-family="Monaco, Consolas, monospace" font-size="13" fill="#374151">${escapeXml(detail)}</text>
  <g>
    ${regionSvg}
    ${edgeSvg}
    ${nodeSvg}
  </g>
</svg>
`;
}

async function main() {
  const args = parseArgs(process.argv);
  const [traceRaw, networkRaw, layoutRaw] = await Promise.all([
    readFile(args.trace, "utf8"),
    readFile(args.network, "utf8"),
    readFile(args.layout, "utf8"),
  ]);
  const events = traceRaw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const edges = parseNetwork(networkRaw);
  const layout = fitLayout(JSON.parse(layoutRaw));
  const flowMetrics = computeFlowMetrics(edges, layout);
  const presentationFrames = buildPresentationFrames(events, layout, edges);
  const framesDir = path.join(args.out, "frames");
  await mkdir(framesDir, { recursive: true });

  const frames = [];
  for (let i = 0; i < presentationFrames.length; i += 1) {
    const frame = presentationFrames[i];
    const filename = `${String(i).padStart(3, "0")}.svg`;
    const framePath = path.join(framesDir, filename);
    await writeFile(
      framePath,
      renderFrame({
        event: frame.event,
        visualState: frame.visualState,
        layout,
        edges,
        flowMetrics,
      }),
    );
    frames.push({
      src: `/infomap/trace-demo/frames/${filename}`,
      title: eventTitle(frame.event),
      phase: phaseLabel(frame.event.phase ?? ""),
      description: describeEvent(frame.event),
    });
  }

  await writeFile(
    path.join(args.out, "manifest.json"),
    `${JSON.stringify({ frames }, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
