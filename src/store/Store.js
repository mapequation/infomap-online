import { decorate, observable, action } from "mobx";
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

  setArgs = (args) => {
    const argv = args.split(/\s/);

    let err = "";

    try {
      arg(argSpec, { argv, permissive: false });
    } catch (e) {
      err = e.message;
    }

    this.args = args;
    this.argsError = err;
  };

  setNetwork = (data) => this.network = data;

  exampleNetwork = (name) => networks[name];

  outputFormat = (name) => outputFormats[name];

  runExample = (name) => this.setNetwork(networks[name]);
}

export default decorate(Store, {
  args: observable,
  argsError: observable,
  setArgs: action,
  network: observable,
  runExample: action,
  setNetwork: action,
});
