import { action, computed, makeObservable, observable } from "mobx";
import { createRef } from "react";
import * as exampleNetworks from "../examples/networks";
import * as outputFormats from "../examples/output";
import OutputStore from "./OutputStore";
import ParameterStore from "./ParameterStore";

const camelToSnake = (str) =>
  str
    .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
    .replace(/([A-Z])/g, ([letter]) => `_${letter.toLowerCase()}`);

export default class Store {
  network = { name: "two_triangles", value: exampleNetworks.twoTriangles };
  clusterData = { name: "", value: "" };
  metaData = { name: "", value: "" };
  activeInput = "network";

  output = new OutputStore(this);
  params = new ParameterStore(this);

  DEFAULT_NET_NAME = "network";
  DEFAULT_CLU_NAME = "clusters.clu";
  DEFAULT_TREE_NAME = "clusters.tree";
  DEFAULT_META_NAME = "metadata.clu";

  mainView = createRef();

  constructor() {
    makeObservable(this, {
      network: observable,
      clusterData: observable,
      metaData: observable,
      activeInput: observable,
      setActiveInput: action,
      setNetwork: action,
      setClusterData: action,
      setMetaData: action,
      runExample: action,
      infomapNetwork: computed,
      infomapFiles: computed,
    });
  }

  setActiveInput = (name) => (this.activeInput = name);

  setNetwork = ({ name, value }) => {
    this.network = { name: name || this.DEFAULT_NET_NAME, value };
    this.output.modules.clear();
  };

  setClusterData = ({ name, value }) =>
    (this.clusterData = { name: name || this.DEFAULT_CLU_NAME, value });

  setMetaData = ({ name, value }) =>
    (this.metaData = { name: name || this.DEFAULT_META_NAME, value });

  get infomapNetwork() {
    return {
      filename: this.network.name,
      content: this.network.value,
    };
  }

  get infomapFiles() {
    const { clusterData, metaData } = this;
    const files = {};
    if (clusterData.name && clusterData.value)
      files[clusterData.name] = clusterData.value;
    if (metaData.name && metaData.value) files[metaData.name] = metaData.value;
    return files;
  }

  getExampleNetwork = (name) => exampleNetworks[name];

  runExample = (name) => {
    this.setNetwork({ name: camelToSnake(name), value: exampleNetworks[name] });
    this.setActiveInput("network");
    this.mainView.current.scrollIntoView();
    window.location.hash = "#";
  };

  getOutputFormat = (name) => outputFormats[name];
}
