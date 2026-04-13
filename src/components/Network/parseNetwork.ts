export interface ParsedNode {
  id: number;
  name: string;
  flow: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ParsedLink {
  source: ParsedNode;
  target: ParsedNode;
  flow: number;
}

export interface ParsedNetwork {
  nodes: ParsedNode[];
  links: ParsedLink[];
  maxNodeFlow: number;
  maxLinkFlow: number;
}

export default function parseNetwork(network: string): ParsedNetwork {
  const lines = network.split("\n").filter(Boolean);

  const nodes = new Map<number, ParsedNode>();
  const links: ParsedLink[] = [];

  let context: string | null = null;
  let maxNodeFlow = 0;
  let maxLinkFlow = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    if (trimmedLine.startsWith("*")) {
      context = trimmedLine;
      continue;
    }

    if (
      context?.startsWith("*Vertices") ||
      context?.startsWith("*Nodes")
    ) {
      const match = trimmedLine.match(/^(\d+)\s+"(.+)"\s+(.+)/);
      if (!match) {
        continue;
      }

      const id = Number(match[1]);
      const name = match[2];
      const flow = Number(match[3]);
      maxNodeFlow = Math.max(maxNodeFlow, flow);
      nodes.set(id, { id, name, flow });
      continue;
    }

    if (
      context?.startsWith("*Edges") ||
      context?.startsWith("*Links") ||
      context?.startsWith("*Arcs")
    ) {
      const [sourceId, targetId, flow] = trimmedLine.split(/\s+/).map(Number);
      const source = nodes.get(sourceId);
      const target = nodes.get(targetId);
      if (!source || !target) {
        continue;
      }

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
