import { expect, test } from "@playwright/test";
import {
  applyOutputContent,
  emptyOutput,
  outputFiles,
  physicalFiles,
  stateFiles,
} from "../src/state/output";

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
