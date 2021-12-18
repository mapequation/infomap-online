import { parameters as infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import { action, makeObservable, observable } from "mobx";
import getArgSpec from "./argSpec";
import createParams from "./createParams";
import paramToString from "./paramToString";
import updateParam from "./updateParam";

const argSpec = getArgSpec(infomapParameters);

export default class ParameterStore {
  constructor(parent) {
    this._parent = parent;

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
    });
  }

  params = createParams(infomapParameters);

  refs = {};

  setRef = (name, ref) => (this.refs[name] = ref);

  getRef = name => this.refs[name];

  args = "";
  argsError = "";
  hasArgsError = false;

  getParam = name => {
    return this.params.find(param => param.long === name);
  };

  getParamsForGroup = group => Object.values(this.params).filter(param => param.group === group);

  toggle = param => {
    if (!param) return;
    param.active = !param.active;
    this.rebuildArgs();
  };

  setIncremental = (param, value) => {
    if (!param) return;
    if (value < 0 || value > param.maxValue) return;
    param.active = value > 0;
    param.value = value;
    this.rebuildArgs();
  };

  setInput = (param, value) => {
    if (!param) return;
    param.active = value !== "";
    param.value = value;
    this.rebuildArgs();
  };

  setOption = (param, value) => {
    if (!param) return;
    if (param.longType === "list") {
      param.active = value.length > 0;
      param.value = value;
    } else if (param.longType === "option") {
      param.active = value !== param.default;
      param.value = value;
    }
    this.rebuildArgs();
  };

  setFileParam = (param, { name, value }) => {
    if (param.long === "--cluster-data") {
      const isTree = /^\d+:\d+/m;
      const defaultName =
        !name && isTree.test(value)
          ? this._parent.DEFAULT_TREE_NAME
          : this._parent.DEFAULT_CLU_NAME;
      this._parent.setClusterData({ name: name || defaultName, value });
      this.setInput(param, name || defaultName);
    } else if (param.long === "--meta-data") {
      this._parent.setMetaData({ name, value });
      this.setInput(param, name || this._parent.DEFAULT_META_NAME);
    }
  };

  resetFileParam = param => {
    this.setInput(param, "");
    if (param.long === "--cluster-data") {
      this._parent.setClusterData({ name: "", value: "" });
    } else if (param.long === "--meta-data") {
      this._parent.setMetaData({ name: "", value: "" });
    }
  };

  rebuildArgs = () => {
    this.args = this.params
      .filter(param => param.active)
      .map(paramToString)
      .join(" ");
  };

  setArgs = args => {
    const argv = args.trim().split(/\s+/);

    this.argsError = "";
    this.hasArgsError = false;

    try {
      arg(argSpec, { argv, permissive: false });
      this.params.forEach(updateParam(argv));
    } catch (e) {
      this.argsError = e.message;
      this.hasArgsError = true;
    }

    this.args = args;
  };
}
