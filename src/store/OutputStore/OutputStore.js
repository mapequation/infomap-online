import { saveAs } from "file-saver";
import JSZip from "jszip";
import { action, computed, makeObservable, observable } from "mobx";
import { FORMATS } from "./formats";

export default class OutputStore {
  constructor(parent) {
    this._parent = parent;

    makeObservable(this, {
      clu: observable,
      tree: observable,
      ftree: observable,
      newick: observable,
      json: observable,
      csv: observable,
      net: observable,
      states_as_physical: observable,
      clu_states: observable,
      tree_states: observable,
      ftree_states: observable,
      newick_states: observable,
      json_states: observable,
      csv_states: observable,
      states: observable,
      flow: observable,
      flow_as_physical: observable,
      activeKey: observable,
      downloaded: observable,
      completed: computed,
      activeContent: computed,
      name: computed,
      files: computed,
      physicalFiles: computed,
      stateFiles: computed,
      activeFile: computed,
      setContent: action,
      resetContent: action,
      setActiveKey: action,
      setDownloaded: action,
      downloadFile: action,
      downloadActiveContent: action,
      downloadAll: action,
    });
  }

  clu = "";
  tree = "";
  ftree = "";
  net = "";
  newick = "";
  json = "";
  csv = "";
  states_as_physical = "";
  clu_states = "";
  tree_states = "";
  ftree_states = "";
  newick_states = "";
  json_states = "";
  csv_states = "";
  states = "";
  flow = "";
  flow_as_physical = "";

  activeKey = "tree";

  downloaded = false;

  get completed() {
    const {
      clu,
      tree,
      ftree,
      newick,
      json,
      csv,
      clu_states,
      tree_states,
      ftree_states,
      newick_states,
      json_states,
      csv_states,
      net,
      states,
      states_as_physical,
      flow,
      flow_as_physical,
    } = this;
    return !!(
      clu ||
      tree ||
      ftree ||
      newick ||
      json ||
      csv ||
      net ||
      states ||
      clu_states ||
      tree_states ||
      ftree_states ||
      newick_states ||
      json_states ||
      csv_states ||
      states_as_physical ||
      flow ||
      flow_as_physical
    );
  }

  get activeContent() {
    return this[this.activeKey];
  }

  get name() {
    return this._parent.network.name;
  }

  get files() {
    return FORMATS.filter(({ key }) => this[key]).map((format) => ({
      ...format,
      filename: `${this.name}${format.suffix}.${format.extension}`,
    }));
  }

  get physicalFiles() {
    return this.files.filter((file) => !file.isStates);
  }

  get stateFiles() {
    return this.files.filter((file) => file.isStates);
  }

  get activeFile() {
    return this.files.find(({ key }) => key === this.activeKey);
  }

  setContent = (content) => {
    const {
      clu,
      tree,
      ftree,
      newick,
      json,
      csv,
      clu_states,
      tree_states,
      ftree_states,
      newick_states,
      json_states,
      csv_states,
      net,
      states,
      states_as_physical,
      flow,
      flow_as_physical,
    } = content;
    if (clu) {
      this.clu = clu;
    }
    if (tree) {
      this.tree = tree;
    }
    if (ftree) {
      this.ftree = ftree;
    }
    if (newick) {
      this.newick = newick;
    }
    if (json) {
      this.json = JSON.stringify(json, null, 2);
    }
    if (csv) {
      this.csv = csv;
    }
    if (clu_states) {
      this.clu_states = clu_states;
    }
    if (tree_states) {
      this.tree_states = tree_states;
    }
    if (ftree_states) {
      this.ftree_states = ftree_states;
    }
    if (newick_states) {
      this.newick_states = newick_states;
    }
    if (json_states) {
      this.json_states = JSON.stringify(json_states, null, 2);
    }
    if (csv_states) {
      this.csv_states = csv_states;
    }
    if (net) {
      this.net = net;
    }
    if (states) {
      this.states = states;
    }
    if (states_as_physical) {
      this.states_as_physical = states_as_physical;
    }
    if (flow) {
      this.flow = flow;
    }
    if (flow_as_physical) {
      this.flow_as_physical = flow_as_physical;
    }

    this.setActiveKey(
      clu
        ? "clu"
        : tree
        ? "tree"
        : ftree
        ? "ftree"
        : newick
        ? "newick"
        : json
        ? "json"
        : csv
        ? "csv"
        : net
        ? "net"
        : states
        ? "states"
        : flow
        ? "flow"
        : "clu"
    );
  };

  resetContent = () => {
    this.clu = "";
    this.tree = "";
    this.ftree = "";
    this.newick = "";
    this.json = "";
    this.csv = "";
    this.clu_states = "";
    this.tree_states = "";
    this.ftree_states = "";
    this.newick_states = "";
    this.json_states = "";
    this.csv_states = "";
    this.net = "";
    this.states = "";
    this.states_as_physical = "";
    this.flow = "";
    this.flow_as_physical = "";

    this.downloaded = false;
  };

  setActiveKey = (key) => (this.activeKey = key);

  setDownloaded = (value) => (this.downloaded = value);

  downloadFile = (formatKey) => {
    const file = this.files.find(({ key }) => key === formatKey);
    const content = this[formatKey];
    const mimeType =
      formatKey === "json"
        ? "application/json;charset=utf-8"
        : "text/plain;charset=utf-8";
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, file.filename);
    this.setDownloaded();
  };

  downloadActiveContent = () => {
    this.downloadFile(this.activeKey);
  };

  downloadAll = () => {
    const zip = new JSZip();
    for (let file of this.files) {
      const content = this[file.key];
      zip.file(file.filename, content);
    }
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => saveAs(blob, `${this.name}.zip`));
  };
}
