import { Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomTransform } from "d3-zoom";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuChevronDown, LuMaximize } from "react-icons/lu";
import {
  hasMatchingModules,
  parseNetworkPreview,
  type ParsedNetwork,
  type PreviewNode,
} from "./networkPreviewParser";

type SimNode = PreviewNode &
  SimulationNodeDatum & {
    radius: number;
  };

type SimLink = SimulationLinkDatum<SimNode> & {
  source: SimNode;
  target: SimNode;
  weight: number;
};

type Graph = {
  nodes: SimNode[];
  links: SimLink[];
};

type HoverState = {
  node: SimNode;
  x: number;
  y: number;
} | null;

type ModuleId = number | string;
type ModuleMap = Map<number, ModuleId>;

const debounceMs = 300;
const palette = [
  "#EBC384",
  "#DFDDA2",
  "#B4CCDF",
  "#E68C6C",
  "#ADB580",
  "#82A3C9",
  "#C2554A",
  "#ECA770",
];

const neutralNode = "#D7D9DD";
const unknownNode = "#CBD0D6";
const linkColor = "#55565A";

function createGraph(parsed: Extract<ParsedNetwork, { status: "ok" }>): Graph {
  const nodeCount = parsed.nodes.length;
  const radiusScale = (degree: number) =>
    Math.max(4, Math.min(12, 4 + Math.sqrt(degree) * 1.8));

  const nodes: SimNode[] = parsed.nodes.map((node, index) => {
    const angle = (index / Math.max(1, nodeCount)) * Math.PI * 2;
    const ring = 140 + (index % 7) * 7;

    return {
      ...node,
      radius: radiusScale(node.degree),
      x: Math.cos(angle) * ring,
      y: Math.sin(angle) * ring,
    };
  });
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const links = parsed.links
    .map((link) => {
      const source = nodesById.get(link.source);
      const target = nodesById.get(link.target);
      if (!source || !target) return null;
      return { ...link, source, target };
    })
    .filter((link): link is SimLink => Boolean(link));

  return { nodes, links };
}

function moduleColor(moduleId: ModuleId) {
  if (typeof moduleId === "number") {
    return palette[Math.abs(moduleId) % palette.length];
  }

  let hash = 0;
  for (const char of moduleId) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

function shadeColor(hex: string, amount: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  const channel = (source: number) =>
    Math.max(0, Math.min(255, Math.round(source + amount)))
      .toString(16)
      .padStart(2, "0");

  return `#${channel(red)}${channel(green)}${channel(blue)}`;
}

function scaledStroke(
  width: number,
  zoomLevel: number,
  min = 0.7,
  max = width,
) {
  return Math.max(min, Math.min(max, width / Math.sqrt(zoomLevel)));
}

function formatCodeLength(codeLength: number | null | undefined) {
  if (codeLength === null || codeLength === undefined) return null;
  return `${codeLength.toFixed(5)} bits`;
}

function parsedSignature(parsed: ParsedNetwork) {
  if (parsed.status !== "ok") {
    return `${parsed.status}:${parsed.message}:${parsed.nodes.length}:${parsed.links.length}`;
  }

  return [
    parsed.status,
    parsed.nodes.map((node) => `${node.id}:${node.label}`).join("|"),
    parsed.links
      .map((link) => `${link.source}:${link.target}:${link.weight}`)
      .join("|"),
  ].join("::");
}

export default function NetworkPreview({
  codeLength,
  levelModules,
  lockedLevelLabel,
  moduleSource = "latest Infomap result",
  network,
  modules,
  numLevels,
  selectedLevel,
}: {
  codeLength?: number | null;
  levelModules?: Map<number, ModuleMap>;
  lockedLevelLabel?: string;
  moduleSource?: string;
  network: string;
  modules: ModuleMap;
  numLevels?: number | null;
  selectedLevel?: number | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<Graph | null>(null);
  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const transformRef = useRef<ZoomTransform>(zoomIdentity);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const frameRef = useRef(0);
  const draggingRef = useRef<SimNode | null>(null);
  const hoverRef = useRef<HoverState>(null);
  const [parsed, setParsed] = useState(() => parseNetworkPreview(network));
  const [hover, setHover] = useState<HoverState>(null);
  const [level, setLevel] = useState(1);
  const [controlsOpen, setControlsOpen] = useState(false);
  const parsedKey = useMemo(() => parsedSignature(parsed), [parsed]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextParsed = parseNetworkPreview(network);
      const nextKey = parsedSignature(nextParsed);
      setParsed((currentParsed) =>
        parsedSignature(currentParsed) === nextKey ? currentParsed : nextParsed,
      );
    }, debounceMs);

    return () => window.clearTimeout(timeout);
  }, [network]);

  const levelLocked = selectedLevel !== null && selectedLevel !== undefined;
  const moduleLevelCount = Math.max(1, (numLevels ?? 1) - 1);
  const hasLevelControl = levelLocked || moduleLevelCount > 1;
  const codeLengthText = formatCodeLength(codeLength);
  const activeLevel =
    levelLocked && selectedLevel === -1
      ? moduleLevelCount
      : levelLocked
        ? selectedLevel
        : level;
  const displayLevel = levelLocked ? selectedLevel : activeLevel;
  const sliderLevel = displayLevel && displayLevel > 0 ? displayLevel : 1;
  const activeModules = levelModules?.get(activeLevel ?? 1) ?? modules;
  const coloredByModules =
    parsed.status === "ok" && hasMatchingModules(parsed.nodes, activeModules);
  const modulesRef = useRef(activeModules);
  const coloredByModulesRef = useRef(coloredByModules);

  const moduleLabel = useMemo(() => {
    if (parsed.status !== "ok" || !coloredByModules) return "";
    const uniqueModules = new Set<ModuleId>();
    for (const node of parsed.nodes) {
      const moduleId = activeModules.get(Number(node.id));
      if (moduleId !== undefined) uniqueModules.add(moduleId);
    }
    return `${uniqueModules.size} modules`;
  }, [activeModules, coloredByModules, parsed]);

  useEffect(() => {
    if (level <= moduleLevelCount) return;
    setLevel(moduleLevelCount);
  }, [level, moduleLevelCount]);

  useEffect(() => {
    if (!levelLocked || selectedLevel < 1) return;
    setLevel(selectedLevel);
  }, [levelLocked, selectedLevel]);

  const requestDraw = () => {
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      draw();
    });
  };

  const screenToWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const transform = transformRef.current;
    return {
      x: (clientX - rect.left - transform.x) / transform.k,
      y: (clientY - rect.top - transform.y) / transform.k,
    };
  };

  const findNearestNode = (clientX: number, clientY: number) => {
    const graph = graphRef.current;
    if (!graph) return null;

    const point = screenToWorld(clientX, clientY);
    let nearest: SimNode | null = null;
    let nearestDistance = Infinity;
    const hitRadius = 18 / transformRef.current.k;

    for (const node of graph.nodes) {
      const dx = (node.x ?? 0) - point.x;
      const dy = (node.y ?? 0) - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= node.radius + hitRadius && distance < nearestDistance) {
        nearest = node;
        nearestDistance = distance;
      }
    }

    return nearest;
  };

  const zoomStartsOnNode = (event: Event) => {
    if (event instanceof MouseEvent) {
      return Boolean(findNearestNode(event.clientX, event.clientY));
    }

    if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      return Boolean(findNearestNode(touch.clientX, touch.clientY));
    }

    return false;
  };

  const fitToGraph = () => {
    const graph = graphRef.current;
    const canvas = canvasRef.current;
    const { width, height } = dimensionsRef.current;
    if (!graph || !canvas || width <= 0 || height <= 0) return;

    const xValues = graph.nodes.map((node) => node.x ?? 0);
    const yValues = graph.nodes.map((node) => node.y ?? 0);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const graphWidth = Math.max(1, maxX - minX);
    const graphHeight = Math.max(1, maxY - minY);
    const padding = 48;
    const scale = Math.max(
      0.15,
      Math.min(
        3,
        Math.min(
          (width - padding * 2) / graphWidth,
          (height - padding * 2) / graphHeight,
        ),
      ),
    );
    const nextTransform = zoomIdentity
      .translate(
        width / 2 - ((minX + maxX) / 2) * scale,
        height / 2 - ((minY + maxY) / 2) * scale,
      )
      .scale(scale);

    transformRef.current = nextTransform;
    select(canvas).call(
      zoom<HTMLCanvasElement, unknown>().transform,
      nextTransform,
    );
    requestDraw();
  };

  function draw() {
    const canvas = canvasRef.current;
    const graph = graphRef.current;
    if (!canvas || !graph) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { width, height, dpr } = dimensionsRef.current;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(transformRef.current.x, transformRef.current.y);
    context.scale(transformRef.current.k, transformRef.current.k);

    const hovered = hoverRef.current?.node ?? null;
    const currentModules = modulesRef.current;
    const currentColoredByModules = coloredByModulesRef.current;
    const connected = new Set<string>();
    if (hovered) {
      for (const link of graph.links) {
        if (link.source.id === hovered.id || link.target.id === hovered.id) {
          connected.add(`${link.source.id}->${link.target.id}`);
        }
      }
    }

    for (const link of graph.links) {
      const isConnected = connected.has(`${link.source.id}->${link.target.id}`);
      const sourceModule = currentModules.get(Number(link.source.id));
      const targetModule = currentModules.get(Number(link.target.id));
      const intraModule =
        currentColoredByModules &&
        sourceModule !== undefined &&
        sourceModule === targetModule;
      context.beginPath();
      context.moveTo(link.source.x ?? 0, link.source.y ?? 0);
      context.lineTo(link.target.x ?? 0, link.target.y ?? 0);
      context.strokeStyle = intraModule
        ? shadeColor(moduleColor(sourceModule), -42)
        : linkColor;
      context.globalAlpha = hovered
        ? isConnected
          ? intraModule
            ? 0.62
            : 0.55
          : 0.08
        : intraModule
          ? 0.42
          : 0.26;
      context.lineWidth =
        scaledStroke(
          Math.max(1.45, Math.min(4.2, Math.sqrt(link.weight) * 1.45)),
          transformRef.current.k,
          0.55,
        ) / transformRef.current.k;
      context.stroke();
    }

    context.globalAlpha = 1;
    const nodeStroke = scaledStroke(3.2, transformRef.current.k, 0.9);
    for (const node of graph.nodes) {
      const moduleId = currentModules.get(Number(node.id));
      const fill =
        currentColoredByModules && moduleId !== undefined
          ? moduleColor(moduleId)
          : currentColoredByModules
            ? unknownNode
            : neutralNode;
      const isHovered = hovered?.id === node.id;

      context.beginPath();
      context.arc(node.x ?? 0, node.y ?? 0, node.radius, 0, Math.PI * 2);
      context.fillStyle = fill;
      context.fill();
      context.lineWidth = nodeStroke / transformRef.current.k;
      context.strokeStyle = isHovered ? "#2D3748" : "#FFFFFF";
      context.stroke();
    }

    context.restore();
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        dpr,
      };
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      requestDraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.08, 8])
      .filter((event) => {
        if (event.type === "dblclick") return false;
        if (event.type === "mousedown" || event.type === "touchstart") {
          return !zoomStartsOnNode(event);
        }
        return true;
      })
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        requestDraw();
      });

    select(canvas).call(zoomBehavior).on("dblclick.zoom", null);

    return () => {
      select(canvas).on(".zoom", null);
    };
  }, []);

  useEffect(() => {
    simulationRef.current?.stop();
    simulationRef.current = null;
    graphRef.current = null;
    hoverRef.current = null;
    setHover(null);

    if (parsed.status !== "ok") {
      requestDraw();
      return;
    }

    const graph = createGraph(parsed);
    graphRef.current = graph;
    const simulation = forceSimulation<SimNode, SimLink>(graph.nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(graph.links)
          .id((node) => node.id)
          .distance((link) => 44 + Math.min(36, link.weight * 4))
          .strength(0.18),
      )
      .force("charge", forceManyBody().strength(-90))
      .force(
        "collide",
        forceCollide<SimNode>().radius((node) => node.radius + 4),
      )
      .force("center", forceCenter(0, 0))
      .alpha(0.95)
      .alphaDecay(0.035)
      .on("tick", requestDraw);

    simulationRef.current = simulation;
    const fitFrame = window.requestAnimationFrame(fitToGraph);

    return () => {
      window.cancelAnimationFrame(fitFrame);
      simulation.stop();
    };
  }, [parsedKey]);

  useEffect(() => {
    modulesRef.current = activeModules;
    coloredByModulesRef.current = coloredByModules;
    requestDraw();
  }, [activeModules, coloredByModules]);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragged = draggingRef.current;
    if (dragged) {
      event.preventDefault();
      event.stopPropagation();
      const point = screenToWorld(event.clientX, event.clientY);
      dragged.fx = point.x;
      dragged.fy = point.y;
      dragged.vx = 0;
      dragged.vy = 0;
      simulationRef.current?.alpha(0.45).alphaTarget(0.18).restart();
      requestDraw();
      return;
    }

    const node = findNearestNode(event.clientX, event.clientY);
    const nextHover = node
      ? { node, x: event.clientX, y: event.clientY }
      : null;
    hoverRef.current = nextHover;
    setHover(nextHover);
    requestDraw();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const node = findNearestNode(event.clientX, event.clientY);
    if (!node) return;
    event.preventDefault();
    event.stopPropagation();
    const point = screenToWorld(event.clientX, event.clientY);
    node.fx = point.x;
    node.fy = point.y;
    node.vx = 0;
    node.vy = 0;
    draggingRef.current = node;
    event.currentTarget.setPointerCapture(event.pointerId);
    simulationRef.current?.alpha(0.45).alphaTarget(0.18).restart();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragged = draggingRef.current;
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged.fx = null;
    dragged.fy = null;
    draggingRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    simulationRef.current?.alpha(0.35).alphaTarget(0).restart();
  };

  const statusText =
    parsed.status === "ok"
      ? coloredByModules
        ? `Colored by ${moduleSource} · ${moduleLabel}`
        : "Previewing network structure"
      : parsed.message;

  const nodeCount = parsed.nodes.length;
  const linkCount = parsed.links.length;
  const moduleId =
    hover && coloredByModules
      ? activeModules.get(Number(hover.node.id))
      : undefined;

  return (
    <Box
      ref={containerRef}
      aria-label="Interactive network preview"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      flex="1"
      minH={0}
      overflow="hidden"
      position="relative"
    >
      <canvas
        ref={canvasRef}
        aria-label="Network preview canvas"
        onDoubleClick={() => fitToGraph()}
        onPointerDown={onPointerDown}
        onPointerLeave={() => {
          hoverRef.current = null;
          setHover(null);
          requestDraw();
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          cursor: draggingRef.current ? "grabbing" : hover ? "grab" : "move",
          display: "block",
          height: "100%",
          touchAction: "none",
          width: "100%",
        }}
      />

      <HStack
        align="center"
        bg="whiteAlpha.900"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="sm"
        gap={2}
        left={3}
        maxW="calc(100% - 6rem)"
        px={3}
        py={2}
        position="absolute"
        top={3}
      >
        <Box minW={0}>
          <Text color="gray.700" fontSize="xs" fontWeight={700} mb={0}>
            {nodeCount.toLocaleString()} nodes · {linkCount.toLocaleString()}{" "}
            links
            {codeLengthText ? ` · L ${codeLengthText}` : ""}
          </Text>
          <Text color="gray.500" fontSize="xs" lineHeight={1.35} mb={0}>
            {statusText}
          </Text>
          <Button
            aria-expanded={controlsOpen}
            mt={1}
            px={0}
            h="auto"
            minW={0}
            onClick={() => setControlsOpen((value) => !value)}
            size="xs"
            variant="plain"
          >
            Preview controls
            <Box
              as={LuChevronDown}
              transform={controlsOpen ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 160ms ease"
            />
          </Button>
          <Box
            maxH={controlsOpen ? "5rem" : "0"}
            opacity={controlsOpen ? 1 : 0}
            overflow="hidden"
            transition="max-height 180ms ease, opacity 160ms ease"
          >
            <Box pt={2} w="12rem">
              {hasLevelControl ? (
                <>
                  <HStack justify="space-between" mb={1}>
                    <Text color="gray.600" fontSize="xs" mb={0}>
                      Level
                    </Text>
                    <Text color="gray.600" fontSize="xs" mb={0}>
                      {lockedLevelLabel ?? displayLevel}
                    </Text>
                  </HStack>
                  <input
                    aria-label="Network preview level"
                    disabled={levelLocked}
                    max={moduleLevelCount}
                    min={1}
                    onChange={(event) => setLevel(Number(event.target.value))}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    value={sliderLevel}
                  />
                  {levelLocked && (
                    <Text color="gray.500" fontSize="xs" mt={1} mb={0}>
                      Locked by --clu-level.
                    </Text>
                  )}
                </>
              ) : (
                <Text color="gray.500" fontSize="xs" mb={0}>
                  Level controls appear for hierarchical results.
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </HStack>

      <Button
        aria-label="Fit network preview"
        onClick={() => fitToGraph()}
        position="absolute"
        right={3}
        size="xs"
        top={3}
        variant="surface"
      >
        <LuMaximize />
        Fit
      </Button>

      {parsed.status !== "ok" && (
        <Box
          bg="whiteAlpha.900"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          color="gray.600"
          left="50%"
          maxW="24rem"
          p={4}
          position="absolute"
          textAlign="center"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <Text fontSize="sm" fontWeight={700} mb={1}>
            Network preview unavailable
          </Text>
          <Text fontSize="sm" mb={0}>
            {parsed.message}
          </Text>
        </Box>
      )}

      {hover && (
        <Box
          bg="gray.900"
          borderRadius="sm"
          color="white"
          left={Math.min(hover.x + 12, dimensionsRef.current.width - 160)}
          maxW="12rem"
          pointerEvents="none"
          position="fixed"
          px={2.5}
          py={2}
          top={hover.y + 12}
          zIndex={10}
        >
          <Text fontSize="xs" fontWeight={700} mb={1}>
            {hover.node.label}
          </Text>
          <Text color="whiteAlpha.800" fontSize="xs" mb={0}>
            Degree {hover.node.degree}
            {moduleId !== undefined ? ` · Module ${moduleId}` : ""}
          </Text>
        </Box>
      )}
    </Box>
  );
}
