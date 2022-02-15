import { createContext, useContext } from "react";
import Store from "./Store";

const store = new Store();

const StoreContext = createContext(store);

const useStore = () => useContext(StoreContext);

export { store };
export default useStore;
