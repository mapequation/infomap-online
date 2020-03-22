import { infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import { action, decorate, observable } from "mobx";
import getArgSpec from "./argSpec";
import createParams from "./createParams";
import paramToString from "./paramToString";
import updateParam from "./updateParam";


const argSpec = getArgSpec(infomapParameters);


class ParameterStore {
  params = createParams(infomapParameters);

  refs = {};

  setRef = (name, ref) => this.refs[name] = ref;

  getRef = (name) => this.refs[name];

  args = "";
  argsError = "";
  hasArgsError = false;

  getParam = (name) => {
    return this.params.find(param => param.long === name);
  };

  getParamsForGroup = (group) =>
    Object.values(this.params).filter(param => param.group === group);

  toggle = (param) => {
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

  rebuildArgs = () => {
    this.args = this.params
      .filter(param => param.active)
      .map(paramToString)
      .join(" ");
  };

  setArgs = (args) => {
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


export default decorate(ParameterStore, {
  params: observable,
  refs: observable,
  setRef: action,
  toggle: action,
  setIncremental: action,
  setInput: action,
  setOption: action,
  args: observable,
  argsError: observable,
  hasArgsError: observable,
  setArgs: action,
});
