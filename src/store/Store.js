import { decorate, observable, action } from "mobx";
import * as networks from "./networks";

// export default class Store {
//   @observable network = networks.initial;

//   exampleNetwork = (name) => {
//     return networks[name];
//   }

//   @action
//   runExample = (name) => {
//     console.log(`Run ${name}...`);
//     this.network = networks[name];
//   }
// }

class Store {
  network = networks.initial;
  setNetwork = (data) => {
    this.network = data;
  }

  exampleNetwork = (name) => {
    return networks[name];
  }

  runExample = (name) => {
    console.log(`Run ${name}...`);
    this.setNetwork(networks[name]);
  }
}

export default decorate(Store, {
  network: observable,
  runExample: action,
  setNetwork: action,
});
