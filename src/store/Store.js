import { action, decorate, observable } from "mobx";
import * as networks from "./networks";
import * as outputFormats from "./outputFormats";
import ParameterStore from "./ParameterStore";

class Store {
  network = networks.initial;
  params = new ParameterStore();

  setNetwork = (data) => this.network = data;

  getExampleNetwork = (name) => networks[name];

  getOutputFormat = (name) => outputFormats[name];

  runExample = (name) => this.setNetwork(networks[name]);
}

export default decorate(Store, {
  network: observable,
  runExample: action,
  setNetwork: action,
});
