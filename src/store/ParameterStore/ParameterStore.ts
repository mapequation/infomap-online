import arg from "arg";
import { action, makeObservable, observable, runInAction } from "mobx";
import { loadInfomapMetadata } from "../../lib/infomap-client";
import type Store from "../Store";
import type { RuntimeParam, TextInputFile } from "../types";
import getArgSpec from "./argSpec";
import createParams from "./createParams";
import paramToString from "./paramToString";
import updateParam from "./updateParam";

export default class ParameterStore {
  private readonly parent: Store;

  params: RuntimeParam[] = [];

  refs: Record<string, unknown> = {};

  args = "";

  argsError = "";

  hasArgsError = false;

  noInfomapArgs = "--silent --no-infomap -o flow";

  ready = false;

  constructor(parent: Store) {
    this.parent = parent;

    makeObservable(this, {
      params: observable,
      refs: observable,
      setRef: action,
      toggle: action,
      setIncremental: action,
      setInput: action,
      setOption: action,
      setFileParam: action,
      resetFileParam: action,
      args: observable,
      argsError: observable,
      hasArgsError: observable,
      setArgs: action,
      noInfomapArgs: observable,
      updateNoInfomapArgs: action,
      ready: observable,
      hydrate: action,
    });
  }

  hydrate = async (initialArgs?: string) => {
    if (this.ready) {
      if (initialArgs) {
        this.setArgs(initialArgs);
      }
      return;
    }

    const { parameters } = await loadInfomapMetadata();

    runInAction(() => {
      this.params = createParams(parameters);
      this.ready = true;
      this.setArgs(initialArgs || this.args || "");
    });
  };

  setRef = (name: string, ref: unknown) => {
    this.refs[name] = ref;
  };

  getRef = (name: string) => this.refs[name];

  getParam = (name: string) => this.params.find((param) => param.long === name);

  getParamsForGroup = (group: string) =>
    this.params.filter((param) => param.group === group);

  toggle = (param?: RuntimeParam) => {
    if (!param) {
      return;
    }

    param.active = !param.active;
    this.rebuildArgs();
  };

  setIncremental = (param: RuntimeParam | undefined, value: number) => {
    if (!param || value < 0 || value > (param.maxValue || 0)) {
      return;
    }

    param.active = value > 0;
    param.value = value;
    this.rebuildArgs();
  };

  setInput = (param: RuntimeParam | undefined, value: string) => {
    if (!param) {
      return;
    }

    param.active = value !== "";
    param.value = value;
    this.rebuildArgs();
  };

  setOption = (param: RuntimeParam | undefined, value: string | string[]) => {
    if (!param) {
      return;
    }

    if (param.longType === "list") {
      param.active = (value as string[]).length > 0;
      param.value = value as string[];
    } else if (param.longType === "option") {
      param.active = value !== param.default;
      param.value = value as string;
    }

    this.rebuildArgs();
  };

  setFileParam = (param: RuntimeParam | undefined, { name, value }: TextInputFile) => {
    if (!param) {
      return;
    }

    if (param.long === "--cluster-data") {
      const isTree = /^\d+:\d+/m;
      const defaultName =
        !name && isTree.test(value)
          ? this.parent.DEFAULT_TREE_NAME
          : this.parent.DEFAULT_CLU_NAME;
      this.parent.setClusterData({ name: name || defaultName, value });
      this.setInput(param, name || defaultName);
      return;
    }

    if (param.long === "--meta-data") {
      this.parent.setMetaData({ name, value });
      this.setInput(param, name || this.parent.DEFAULT_META_NAME);
    }
  };

  resetFileParam = (param: RuntimeParam | undefined) => {
    if (!param) {
      return;
    }

    this.setInput(param, "");

    if (param.long === "--cluster-data") {
      this.parent.setClusterData({ name: "", value: "" });
    } else if (param.long === "--meta-data") {
      this.parent.setMetaData({ name: "", value: "" });
    }
  };

  rebuildArgs = () => {
    this.args = this.params
      .filter((param) => param.active)
      .map(paramToString)
      .join(" ");

    this.updateNoInfomapArgs();
  };

  setArgs = (args: string) => {
    const argv = args.trim().split(/\s+/);
    const argSpec = getArgSpec(this.params);

    this.argsError = "";
    this.hasArgsError = false;

    try {
      if (this.params.length > 0) {
        arg(argSpec, { argv, permissive: false });
        this.params.forEach(updateParam(argv));
      }
    } catch (error) {
      this.argsError = error instanceof Error ? error.message : String(error);
      this.hasArgsError = true;
    }

    this.args = args;
    this.updateNoInfomapArgs();
  };

  updateNoInfomapArgs() {
    let nextArgs = this.args
      .replace("--clu", "")
      .replace("--tree", "")
      .replace("--ftree", "")
      .replace(/(?:-o|--output)\s+\S+/g, "")
      .replace(/\s+/g, " ");

    nextArgs += " --silent --no-infomap -o flow";
    nextArgs = nextArgs.trim().replace(/\s+/g, " ");

    if (this.noInfomapArgs !== nextArgs) {
      this.noInfomapArgs = nextArgs;
    }
  }
}
