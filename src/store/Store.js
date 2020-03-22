import { action, decorate, observable } from "mobx";
import * as exampleNetworks from "./exampleNetworks";
import * as outputFormats from "./outputFormats";
import ParameterStore from "./parameters/ParameterStore";

const camelToSnake = str => str
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `_${letter.toLowerCase()}`);

class Store {
  network = { name: "two_triangles", value: exampleNetworks.twoTriangles };
  clusterData = { name: "", value: "" };
  metaData = { name: "", value: "" };

  DEFAULT_NET_NAME = "network";
  DEFAULT_CLU_NAME = "clusters.clu";
  DEFAULT_META_NAME = "metadata.clu";

  DEFAULT_NAME = {
    "--cluster-data": this.DEFAULT_CLU_NAME,
    "--meta-data": this.DEFAULT_META_NAME,
  };

  params = new ParameterStore();

  setNetwork = ({ name, value }) => this.network = { name: name || this.DEFAULT_NET_NAME, value };

  setClusterData = ({ name, value }) => this.clusterData = { name: name || this.DEFAULT_CLU_NAME, value };

  setMetaData = ({ name, value }) => this.metaData = { name: name || this.DEFAULT_META_NAME, value };

  setFileParam = ({ long }, { name, value }) => {
    if (long === "--cluster-data") {
      this.setClusterData({ name, value });
    } else if (long === "--meta-data") {
      this.setMetaData({ name, value });
    }
  };

  resetFileParam = ({ long }) => {
    if (long === "--cluster-data") {
      this.setClusterData({ value: "" });
    } else if (long === "--meta-data") {
      this.setMetaData({ value: "" });
    }
  };

  getNetworkForInfomap = () => ({
    filename: this.network.name,
    content: this.network.value,
  });

  getFilesForInfomap = () => {
    const { clusterData, metaData } = this;
    const files = {};
    if (clusterData.name && clusterData.value) files[clusterData.name] = clusterData.value;
    if (metaData.name && metaData.value) files[metaData.name] = metaData.value;
    return files;
  };

  getExampleNetwork = (name) => exampleNetworks[name];

  runExample = (name) => this.setNetwork({ name: camelToSnake(name), value: exampleNetworks[name] });

  getOutputFormat = (name) => outputFormats[name];
}


export default decorate(Store, {
  network: observable,
  clusterData: observable,
  metaData: observable,
  setNetwork: action,
  setClusterData: action,
  setMetaData: action,
  setFileParam: action,
  resetFileParam: action,
  runExample: action,
});
