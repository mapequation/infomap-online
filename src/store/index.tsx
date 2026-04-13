import { createContext, useContext, type ReactNode } from "react";
import Store from "./Store";

export const createStore = () => new Store();

const store = createStore();

const StoreContext = createContext(store);

export function StoreProvider({
  children,
  value = store,
}: {
  children: ReactNode;
  value?: Store;
}) {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const useStore = () => useContext(StoreContext);

export { store };
export default useStore;
