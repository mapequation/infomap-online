import localforage from "localforage";
import { action, computed, decorate, observable } from "mobx";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const FORMATS = [
  {
    key: "clu",
    name: "Clu",
    isStates: false,
    suffix: "",
    extension: "clu",
  },
  {
    key: "tree",
    name: "Tree",
    isStates: false,
    suffix: "",
    extension: "tree",
  },
  {
    key: "ftree",
    name: "Ftree",
    isStates: false,
    suffix: "",
    extension: "ftree",
  },
  {
    key: "net",
    name: "Network",
    isStates: false,
    suffix: "",
    extension: "net",
  },
  {
    key: "states_as_physical",
    name: "States as physical",
    isStates: false,
    suffix: "_states_as_physical",
    extension: "net",
  },
  {
    key: "clu_states",
    name: "Clu",
    isStates: true,
    suffix: "_states",
    extension: "clu",
  },
  {
    key: "tree_states",
    name: "Tree",
    isStates: true,
    suffix: "_states",
    extension: "tree",
  },
  {
    key: "ftree_states",
    name: "Ftree",
    isStates: true,
    suffix: "_states",
    extension: "ftree",
  },
  {
    key: "states",
    name: "States",
    isStates: true,
    suffix: "_states",
    extension: "net",
  },
];

class OutputStore {
  constructor(store) {
    this._parent = store;
  }

  clu = "";
  tree = "";
  ftree = "";
  net = "";
  states_as_physical = "";
  clu_states = "";
  tree_states = "";
  ftree_states = "";
  states = "";

  activeKey = "tree";

  downloaded = false;

  get completed() {
    const {
      clu,
      tree,
      ftree,
      clu_states,
      tree_states,
      ftree_states,
      net,
      states,
      states_as_physical,
    } = this;
    return (
      clu ||
      tree ||
      ftree ||
      net ||
      states ||
      clu_states ||
      tree_states ||
      ftree_states ||
      states_as_physical
    );
  }

  get activeContent() {
    return this[this.activeKey];
  }

  get name() {
    return this._parent.network.name;
  }

  get files() {
    return FORMATS.filter(({ key }) => this[key]).map(format => ({
      ...format,
      filename: `${this.name}${format.suffix}.${format.extension}`,
    }));
  }

  get physicalFiles() {
    return this.files.filter(file => !file.isStates);
  }

  get stateFiles() {
    return this.files.filter(file => file.isStates);
  }

  get activeFile() {
    return this.files.find(({ key }) => key === this.activeKey);
  }

  setContent = content => {
    const {
      clu,
      tree,
      ftree,
      clu_states,
      tree_states,
      ftree_states,
      net,
      states,
      states_as_physical,
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
    if (clu_states) {
      this.clu_states = clu_states;
    }
    if (tree_states) {
      this.tree_states = tree_states;
    }
    if (ftree_states) {
      this.ftree_states = ftree_states;
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

    this.setActiveKey(
      clu ? "clu" : tree ? "tree" : ftree ? "ftree" : net ? "net" : states ? "states" : "clu"
    );
    localforage.setItem("ftree", ftree);
  };

  resetContent = () => {
    this.clu = "";
    this.tree = "";
    this.ftree = "";
    this.clu_states = "";
    this.tree_states = "";
    this.ftree_states = "";
    this.net = "";
    this.states = "";
    this.states_as_physical = "";

    this.downloaded = false;
  };

  setActiveKey = key => (this.activeKey = key);

  setDownloaded = value => (this.downloaded = value);

  downloadFile = formatKey => {
    const file = this.files.find(({ key }) => key === formatKey);
    const content = this[formatKey];
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
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
    zip.generateAsync({ type: "blob" }).then(blob => saveAs(blob, `${this.name}.zip`));
  };
}

export default decorate(OutputStore, {
  clu: observable,
  tree: observable,
  ftree: observable,
  net: observable,
  states_as_physical: observable,
  clu_states: observable,
  tree_states: observable,
  ftree_states: observable,
  states: observable,
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
