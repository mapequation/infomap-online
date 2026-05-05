export const NETWORK_PREVIEW_NODE_LIMIT = 2_000;
export const NETWORK_PREVIEW_LINK_LIMIT = 5_000;

export type PreviewNode = {
  id: string;
  label: string;
  degree: number;
};

export type PreviewLink = {
  source: string;
  target: string;
  weight: number;
};

export type ParsedNetwork =
  | {
      status: "ok";
      nodes: PreviewNode[];
      links: PreviewLink[];
      nodeLimit: number;
      linkLimit: number;
    }
  | {
      status: "empty" | "unsupported" | "too-large" | "error";
      message: string;
      nodes: PreviewNode[];
      links: PreviewLink[];
      nodeLimit: number;
      linkLimit: number;
    };

type ParserMode = "link-list" | "vertices" | "edges" | "unsupported";

const unsupportedDirectives = new Set([
  "*states",
  "*multilayer",
  "*intra",
  "*inter",
]);

function tokenize(line: string) {
  const tokens: string[] = [];
  const regex = /"([^"]*)"|(\S+)/g;
  let match = regex.exec(line);

  while (match) {
    tokens.push(match[1] ?? match[2]);
    match = regex.exec(line);
  }

  return tokens;
}

function stripInlineComment(line: string) {
  const index = line.indexOf("#");
  return index < 0 ? line : line.slice(0, index);
}

function createLimitResult(
  nodes: Map<string, PreviewNode>,
  links: PreviewLink[],
  nodeLimit: number,
  linkLimit: number,
): ParsedNetwork {
  return {
    status: "too-large",
    message: `Network preview supports up to ${nodeLimit.toLocaleString()} nodes and ${linkLimit.toLocaleString()} links.`,
    nodes: [...nodes.values()],
    links,
    nodeLimit,
    linkLimit,
  };
}

export function parseNetworkPreview(
  input: string,
  {
    nodeLimit = NETWORK_PREVIEW_NODE_LIMIT,
    linkLimit = NETWORK_PREVIEW_LINK_LIMIT,
  }: { nodeLimit?: number; linkLimit?: number } = {},
): ParsedNetwork {
  const nodes = new Map<string, PreviewNode>();
  const links: PreviewLink[] = [];
  let mode: ParserMode = "link-list";

  const ensureNode = (id: string, label = id) => {
    const existing = nodes.get(id);
    if (existing) {
      if (existing.label === existing.id && label !== id) {
        existing.label = label;
      }
      return existing;
    }

    const node = { id, label, degree: 0 };
    nodes.set(id, node);
    return node;
  };

  const addLink = (source: string, target: string, weightValue?: string) => {
    if (!source || !target) return;
    const weight = Math.max(0.1, Number(weightValue) || 1);
    const sourceNode = ensureNode(source);
    const targetNode = ensureNode(target);
    sourceNode.degree += 1;
    targetNode.degree += 1;
    links.push({ source, target, weight });
  };

  try {
    for (const rawLine of input.split(/\r?\n/)) {
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("%")) {
        continue;
      }

      if (trimmed.startsWith("*")) {
        const directive = trimmed.split(/\s+/, 1)[0].toLowerCase();
        if (unsupportedDirectives.has(directive)) {
          mode = "unsupported";
          break;
        }
        if (directive === "*vertices") {
          mode = "vertices";
          continue;
        }
        if (
          directive === "*edges" ||
          directive === "*arcs" ||
          directive === "*links" ||
          directive === "*bipartite"
        ) {
          mode = "edges";
          continue;
        }
        mode = "unsupported";
        break;
      }

      const tokens = tokenize(stripInlineComment(trimmed));
      if (tokens.length === 0) continue;

      if (mode === "vertices") {
        ensureNode(tokens[0], tokens[1] ?? tokens[0]);
        if (nodes.size > nodeLimit) {
          return createLimitResult(nodes, links, nodeLimit, linkLimit);
        }
        continue;
      }

      if (mode === "link-list" || mode === "edges") {
        if (tokens.length < 2) continue;
        addLink(tokens[0], tokens[1], tokens[2]);
        if (nodes.size > nodeLimit || links.length > linkLimit) {
          return createLimitResult(nodes, links, nodeLimit, linkLimit);
        }
      }
    }

    if (mode === "unsupported") {
      return {
        status: "unsupported",
        message:
          "This preview supports ordinary link lists, Pajek edges, and bipartite edges. Multilayer and state previews are not included yet.",
        nodes: [...nodes.values()],
        links,
        nodeLimit,
        linkLimit,
      };
    }

    if (nodes.size === 0 || links.length === 0) {
      return {
        status: "empty",
        message: "Add a link list or Pajek network to preview it here.",
        nodes: [...nodes.values()],
        links,
        nodeLimit,
        linkLimit,
      };
    }

    return {
      status: "ok",
      nodes: [...nodes.values()],
      links,
      nodeLimit,
      linkLimit,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not parse this network for preview.",
      nodes: [...nodes.values()],
      links,
      nodeLimit,
      linkLimit,
    };
  }
}

export function hasMatchingModules(
  nodes: PreviewNode[],
  modules: Map<number, unknown>,
) {
  return nodes.some((node) => modules.has(Number(node.id)));
}
