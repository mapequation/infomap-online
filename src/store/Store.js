import { action, decorate, observable } from "mobx";
import * as exampleNetworks from "./exampleNetworks";
import * as outputFormats from "./outputFormats";
import ParameterStore from "./parameters/ParameterStore";


class Store {
  network = exampleNetworks.twoTriangles;

  params = new ParameterStore();

  setNetwork = (data) => this.network = data;

  getExampleNetwork = (name) => exampleNetworks[name];

  runExample = (name) => this.setNetwork(exampleNetworks[name]);

  getOutputFormat = (name) => outputFormats[name];
}


export default decorate(Store, {
  network: observable,
  runExample: action,
  setNetwork: action,
});
