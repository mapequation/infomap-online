import { expect, test } from "@playwright/test";
import {
  applyOutputContent,
  emptyOutput,
  outputFiles,
  parseCluModules,
  parseTreeLevelModules,
  physicalFiles,
  stateFiles,
} from "../src/state/output";
import {
  hasMatchingModules,
  parseNetworkPreview,
} from "../src/features/infomap-runner/networkPreviewParser";

test("parses args and builds no-infomap args", async () => {
  globalThis.self = globalThis as Window & typeof globalThis;
  const {
    applyArgsToParams,
    buildArgs,
    buildNoInfomapArgs,
    createParams,
  } = require("../src/state/parameters");
  const params = applyArgsToParams(createParams(), ["--clu", "--ftree"]);

  expect(buildArgs(params).split(" ").sort()).toEqual(["--clu", "--ftree"]);
  expect(buildNoInfomapArgs(buildArgs(params))).toBe(
    "--silent --no-infomap -o flow",
  );
});

test("derives output files from content", () => {
  const output = applyOutputContent(emptyOutput(), {
    clu: "1 1\n2 1\n",
    ftree: "1:1 1 0.5 node\n",
    json: { modules: [] },
  });

  expect(output.modules.get(1)).toBe(1);
  expect(outputFiles(output, "network").map((file) => file.filename)).toEqual([
    "network.clu",
    "network.ftree",
    "network.json",
  ]);
  expect(physicalFiles(output, "network")).toHaveLength(3);
  expect(stateFiles(output, "network")).toHaveLength(0);
});

test("derives output metadata for network preview", () => {
  const output = applyOutputContent(emptyOutput(), {
    json: {
      codelength: 2.01141,
      numLevels: 3,
      nodes: [],
    },
  });

  expect(output.codeLength).toBe(2.01141);
  expect(output.numLevels).toBe(3);
});

test("derives hierarchy depth from tree output when json is unavailable", () => {
  const output = applyOutputContent(emptyOutput(), {
    tree: `
      # path flow name node_id
      1:1 0.2 "a" 1
      1:2:1 0.1 "b" 2
    `,
  });

  expect(output.numLevels).toBe(3);
  expect(output.levelModules.get(1)?.get(2)).toBe("1");
  expect(output.levelModules.get(2)?.get(2)).toBe("1:2");
});

test("parses tree output into per-level module maps", () => {
  const levels = parseTreeLevelModules(`
    1:1 0.2 "a" 1
    1:2:1 0.1 "b" 2
    2:1 0.3 "c" 3
  `);

  expect(levels.get(1)?.get(1)).toBe("1");
  expect(levels.get(1)?.get(2)).toBe("1");
  expect(levels.get(2)?.get(2)).toBe("1:2");
  expect(levels.get(1)?.get(3)).toBe("2");
});

test("parses loaded clu modules for preview coloring", () => {
  const modules = parseCluModules(`
    # id module flow
    1 2 0.1
    2 2 0.2
  `);

  expect(modules.get(1)).toBe(2);
  expect(modules.get(2)).toBe(2);
});

test("parses plain weighted link-list networks for preview", () => {
  const result = parseNetworkPreview(`
    # source target weight
    a b 2
    b c

    c a 0.5
  `);

  expect(result.status).toBe("ok");
  expect(result.nodes.map((node) => node.id).sort()).toEqual(["a", "b", "c"]);
  expect(result.links).toEqual([
    { source: "a", target: "b", weight: 2 },
    { source: "b", target: "c", weight: 1 },
    { source: "c", target: "a", weight: 0.5 },
  ]);
});

test("parses Pajek vertices and edges for preview", () => {
  const result = parseNetworkPreview(`
    *Vertices 3
    1 "Alice"
    2 "Bob"
    3 "Carol"
    *Edges
    1 2 4
    2 3
  `);

  expect(result.status).toBe("ok");
  expect(result.nodes).toEqual([
    { id: "1", label: "Alice", degree: 1 },
    { id: "2", label: "Bob", degree: 2 },
    { id: "3", label: "Carol", degree: 1 },
  ]);
  expect(result.links).toHaveLength(2);
});

test("parses bipartite network directives for preview", () => {
  const result = parseNetworkPreview(`
    *Vertices 3
    1 "User 1"
    2 "User 2"
    3 "Item"
    *Bipartite 3
    1 3 1
    2 3 0.5
  `);

  expect(result.status).toBe("ok");
  expect(result.nodes).toHaveLength(3);
  expect(result.links).toHaveLength(2);
});

test("returns preview limits before starting large layouts", () => {
  const result = parseNetworkPreview(
    `
    1 2
    2 3
    3 4
  `,
    { nodeLimit: 3, linkLimit: 10 },
  );

  expect(result.status).toBe("too-large");
});

test("detects unsupported semantic network directives", () => {
  const result = parseNetworkPreview(`
    *Vertices 2
    1 "i"
    2 "j"
    *States
    1 1 "state"
  `);

  expect(result.status).toBe("unsupported");
});

test("matches numeric Infomap module ids to preview nodes", () => {
  const result = parseNetworkPreview("1 2\n2 3");
  if (result.status !== "ok") throw new Error("Expected parsed network");

  expect(
    hasMatchingModules(
      result.nodes,
      new Map([
        [1, 1],
        [2, 1],
      ]),
    ),
  ).toBe(true);
  expect(hasMatchingModules(result.nodes, new Map([[99, 1]]))).toBe(false);
});
