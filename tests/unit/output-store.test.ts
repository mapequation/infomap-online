import { describe, expect, it } from "vitest";
import { createStore } from "../../src/store";
import { parseModules } from "../../src/store/OutputStore/OutputStore";

describe("OutputStore", () => {
  it("derives downloadable files from populated outputs", () => {
    const store = createStore();
    store.setNetwork({ name: "karate", value: "1 2" });

    store.output.setContent({
      clu: "*Vertices 2\n1 1\n2 1\n",
      tree: "# tree",
      flow: "*Vertices 2\n1 \"1\" 0.5\n2 \"2\" 0.5\n*Links\n1 2 1\n",
    });

    expect(store.output.completed).toBe(true);
    expect(store.output.files.map((file) => file.filename)).toEqual([
      "karate.clu",
      "karate.tree",
      "karate_flow.net",
    ]);
  });

  it("parses modules from clu output", () => {
    const modules = parseModules("# comment\n1 3\n2 3\n3 7\n");

    expect(modules.get(1)).toBe(3);
    expect(modules.get(3)).toBe(7);
  });
});
