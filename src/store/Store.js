import { action, decorate, observable } from "mobx";
import { infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import * as networks from "./networks";
import * as outputFormats from "./outputFormats";
import getArgSpec from "./argSpec";

const argSpec = getArgSpec(infomapParameters);

class Store {
  network = networks.initial;

  args = "--ftree --clu";
  argsError = "";
  hasArgsError = false;

  setArgs = (args) => {
    const argv = args.split(/\s/);

    this.argsError = "";
    this.hasArgsError = false;

    try {
      arg(argSpec, { argv, permissive: false });
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
  args: observable,
  argsError: observable,
  hasArgsError: observable,
  setArgs: action,
  network: observable,
  runExample: action,
  setNetwork: action,
});
