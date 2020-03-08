import { action, decorate, observable } from "mobx";
import { infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import * as networks from "./networks";
import * as outputFormats from "./outputFormats";
import getArgSpec from "./argSpec";
import createParams from "./createParams";
import paramToString from "./paramToString";
import updateParam from "./updateParam";

const argSpec = getArgSpec(infomapParameters);

class Store {
  network = networks.initial;
  params = createParams(infomapParameters);

  args = "";
  argsError = "";
  hasArgsError = false;

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
      this.params.forEach(updateParam(argv))
    } catch (e) {
      this.argsError = e.message;
      this.hasArgsError = true;
    }

    this.args = args;
  };

  setNetwork = (data) => this.network = data;

  exampleNetwork = (name) => networks[name];

  outputFormat = (name) => outputFormats[name];

  runExample = (name) => this.setNetwork(networks[name]);
}

export default decorate(Store, {
  params: observable,
  toggle: action,
  setIncremental: action,
  args: observable,
  argsError: observable,
  hasArgsError: observable,
  setArgs: action,
  network: observable,
  runExample: action,
  setNetwork: action,
});
