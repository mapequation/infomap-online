import { action, decorate, observable } from "mobx";
import * as exampleNetworks from "./exampleNetworks";
import * as outputFormats from "./outputFormats";
import ParameterStore from "./parameters/ParameterStore";


class Store {
  network = { name: "two_triangles", value: exampleNetworks.twoTriangles };
  clusterData = { name: "", value: "" };
  metaData = { name: "", value: "" };

  params = new ParameterStore();

  setNetwork = ({ name, value }) => this.network = { name: name || "network", value };

  setClusterData = ({ name, value }) => this.clusterData = { name: name || "cluster_data", value };

  setMetaData = ({ name, value }) => this.metaData = { name: name || "meta_data", value };

  getExampleNetwork = (name) => exampleNetworks[name];

  runExample = (name) => this.setNetwork(exampleNetworks[name]);

  getOutputFormat = (name) => outputFormats[name];
}


export default decorate(Store, {
  network: observable,
  clusterData: observable,
  metaData: observable,
  setNetwork: action,
  setClusterData: action,
  setMetaData: action,
  runExample: action,
});
