import { action, decorate, observable, computed } from "mobx";
import localforage from "localforage";

class OutputStore {

  constructor(store) {
    this._store = store;
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

  setContent = (content) => {
    const { clu, tree, ftree, clu_states, tree_states, ftree_states, net, states, states_as_physical } = content;
    if (clu) { this.clu = clu; }
    if (tree) { this.tree = tree; }
    if (ftree) { this.ftree = ftree; }
    if (clu_states) { this.clu_states = clu_states; }
    if (tree_states) { this.tree_states = tree_states; }
    if (ftree_states) { this.ftree_states = ftree_states; }
    if (net) { this.net = net; }
    if (states) { this.states = states; }
    if (states_as_physical) { this.states_as_physical = states_as_physical; }

    this._store.setActiveOutput(clu ? "clu" : tree ? "tree" : ftree ? "ftree" : net ? "net" : states ? "states" : "clu");
    localforage.setItem("ftree", ftree);
  }

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
  }

  get completed() {
    const { clu, tree, ftree, clu_states, tree_states, ftree_states, net, states, states_as_physical } = this;
    return clu || tree || ftree || net || states || clu_states || tree_states || ftree_states || states_as_physical;
  }

  get activeContent() {
    return this[this._store.activeOutput];
  }

  get physicalOptions() {
    return ["clu", "tree", "ftree", "net", "states_as_physical"]
      .filter(name => this[name]);
  }

  get statesOptions() {
    return ["clu_states", "tree_states", "ftree_states", "states"]
      .filter(name => this[name]);
  }
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
  completed: computed,
  activeContent: computed,
  physicalOptions: computed,
  statesOptions: computed,
});
