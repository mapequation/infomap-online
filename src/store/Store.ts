import { action, computed, makeObservable, observable } from "mobx";
import { createRef } from "react";
import * as exampleNetworks from "../examples/networks";
import * as outputFormats from "../examples/output";
import OutputStore from "./OutputStore";
import ParameterStore from "./ParameterStore";
import type { InfomapFileMap, InputName, TextInputFile } from "./types";

const camelToSnake = (value: string) =>
  value
    .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
    .replace(/([A-Z])/g, ([letter]) => `_${letter.toLowerCase()}`);

type ExampleNetworkKey = keyof typeof exampleNetworks;
type OutputFormatKey = keyof typeof outputFormats;

const clearLocationHash = () => {
  if (typeof window !== "undefined") {
    window.location.hash = "#";
  }
};

export default class Store {
  network: TextInputFile = {
    name: "two_triangles",
    value: exampleNetworks.twoTriangles,
  };

  clusterData: TextInputFile = { name: "", value: "" };

  metaData: TextInputFile = { name: "", value: "" };

  activeInput: InputName = "network";

  output = new OutputStore(this);

  params = new ParameterStore(this);

  readonly DEFAULT_NET_NAME = "network";
  readonly DEFAULT_CLU_NAME = "clusters.clu";
  readonly DEFAULT_TREE_NAME = "clusters.tree";
  readonly DEFAULT_META_NAME = "metadata.clu";

  mainView = createRef<HTMLDivElement>();

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

  setActiveInput = (name: InputName) => {
    this.activeInput = name;
  };

  setNetwork = ({ name, value }: TextInputFile) => {
    this.network = { name: name || this.DEFAULT_NET_NAME, value };
    this.output.modules.clear();
  };

  setClusterData = ({ name, value }: TextInputFile) => {
    this.clusterData = { name: name || this.DEFAULT_CLU_NAME, value };
  };

  setMetaData = ({ name, value }: TextInputFile) => {
    this.metaData = { name: name || this.DEFAULT_META_NAME, value };
  };

  get infomapNetwork() {
    return {
      filename: this.network.name,
      content: this.network.value,
    };
  }

  get infomapFiles(): InfomapFileMap {
    const files: InfomapFileMap = {};

    if (this.clusterData.name && this.clusterData.value) {
      files[this.clusterData.name] = this.clusterData.value;
    }

    if (this.metaData.name && this.metaData.value) {
      files[this.metaData.name] = this.metaData.value;
    }

    return files;
  }

  getExampleNetwork = (name: ExampleNetworkKey) => exampleNetworks[name];

  runExample = (name: ExampleNetworkKey) => {
    this.setNetwork({
      name: camelToSnake(name),
      value: exampleNetworks[name],
    });
    this.setActiveInput("network");
    this.mainView.current?.scrollIntoView();
    clearLocationHash();
  };

  getOutputFormat = (name: OutputFormatKey) => outputFormats[name];
}
