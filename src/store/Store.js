import { action, decorate, observable } from "mobx";
import { infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import * as networks from "./networks";
import * as outputFormats from "./outputFormats";
import getArgSpec from "./argSpec";

const argSpec = getArgSpec(infomapParameters);

class Store {
  network = networks.initial;
  params = infomapParameters;

  args = "";
  argsError = "";
  hasArgsError = false;

  getParamsForGroup = (group) =>
    Object.values(this.params).filter(param => param.group === group);

  toggle = param => {
    if (!param) return;
    param.active = param.active === undefined ? true : !param.active;
    this.rebuildArgs();
  };

  rebuildArgs = () => {
    this.args = this.params
      .filter(param => param.active)
      .map(param => param.short || param.long)
      .join(" ");
  };

  setArgs = (args) => {
    const argv = args.split(/\s/);

    this.argsError = "";
    this.hasArgsError = false;

    try {
      arg(argSpec, { argv, permissive: false });

      this.params.forEach(param => {
        const index = argv
          .filter(a => a !== "")
          .findIndex(a => a === param.short || a === param.long);
        param.active = index > -1;
      });
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
  args: observable,
  argsError: observable,
  hasArgsError: observable,
  setArgs: action,
  network: observable,
  runExample: action,
  setNetwork: action,
});
