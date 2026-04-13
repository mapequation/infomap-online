import { describe, expect, it } from "vitest";
import { createStore } from "../../src/store";
import type { RuntimeParam } from "../../src/store/types";

describe("ParameterStore", () => {
  it("rebuilds args and strips output flags for no-infomap args", () => {
    const store = createStore();

    store.params.setArgs("--clu --ftree --two-level -o clu,tree");

    expect(store.params.args).toBe("--clu --ftree --two-level -o clu,tree");
    expect(store.params.noInfomapArgs).toBe("--two-level --silent --no-infomap -o flow");
  });

  it("stores cluster data with an inferred tree filename when tree input is loaded", () => {
    const store = createStore();
    const param = {
      long: "--cluster-data",
      active: false,
      value: "",
    } as RuntimeParam;

    store.params.setFileParam(param, {
      name: "",
      value: "1:1 0.2\n2:1 0.4\n",
    });

    expect(store.clusterData.name).toBe(store.DEFAULT_TREE_NAME);
    expect(store.clusterData.value).toContain("1:1 0.2");
    expect(param.value).toBe(store.DEFAULT_TREE_NAME);
  });
});
