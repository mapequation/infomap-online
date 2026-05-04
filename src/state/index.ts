import arg from "arg";
import { create } from "zustand";
import * as exampleNetworks from "../data/networks";
import * as outputExamples from "../data/output";
import {
  applyOutputContent,
  downloadAllOutput,
  downloadOutputFile,
  emptyOutput,
  type OutputState,
  outputFiles,
  type physicalFiles,
  type stateFiles,
} from "./output";
import {
  applyArgsToParams,
  buildArgs,
  buildNoInfomapArgs,
  createParams,
  getArgSpec,
} from "./parameters";
import type {
  InfomapParameter,
  InputFile,
  InputName,
  OutputContent,
  OutputKey,
} from "./types";

const DEFAULT_NET_NAME = "network";
const DEFAULT_CLU_NAME = "clusters.clu";
const DEFAULT_TREE_NAME = "clusters.tree";
const DEFAULT_META_NAME = "metadata.clu";

const initialParams = createParams();
const argSpec = getArgSpec(initialParams);

type ParamActions = {
  setRef: (name: string, ref: unknown) => void;
  getRef: (name: string) => unknown;
  getParam: (name: string) => InfomapParameter;
  getParamsForGroup: (group: string) => InfomapParameter[];
  toggle: (param?: InfomapParameter) => void;
  setIncremental: (param: InfomapParameter | undefined, value: number) => void;
  setInput: (param: InfomapParameter | undefined, value: string) => void;
  setOption: (
    param: InfomapParameter | undefined,
    value: string | string[],
  ) => void;
  setFileParam: (param: InfomapParameter | undefined, file: InputFile) => void;
  resetFileParam: (param: InfomapParameter | undefined) => void;
  setArgs: (args: string) => void;
};

type OutputActions = {
  completed: boolean;
  activeContent: string;
  name: string;
  files: ReturnType<typeof outputFiles>;
  physicalFiles: ReturnType<typeof physicalFiles>;
  stateFiles: ReturnType<typeof stateFiles>;
  activeFile: ReturnType<typeof outputFiles>[number] | undefined;
  setContent: (content: OutputContent) => void;
  resetContent: () => void;
  setActiveKey: (key: OutputKey) => void;
  setDownloaded: (value: boolean) => void;
  downloadFile: (formatKey: OutputKey) => void;
  downloadActiveContent: () => void;
  downloadAll: () => void;
};

type InfomapState = {
  network: InputFile;
  clusterData: InputFile;
  metaData: InputFile;
  activeInput: InputName;
  params: {
    params: InfomapParameter[];
    refs: Record<string, unknown>;
    args: string;
    argsError: string;
    hasArgsError: boolean;
    noInfomapArgs: string;
  } & ParamActions;
  output: OutputState & OutputActions;
  infomapNetwork: { filename: string; content: string };
  infomapFiles: Record<string, string>;
  setActiveInput: (name: InputName) => void;
  setNetwork: (network: InputFile) => void;
  setClusterData: (file: InputFile) => void;
  setMetaData: (file: InputFile) => void;
  getExampleNetwork: (name: keyof typeof exampleNetworks) => string;
  getOutputFormat: (name: keyof typeof outputExamples) => string;
};

function withDerived(state: InfomapState): InfomapState {
  const files = outputFiles(state.output, state.network.name);
  const physical = files.filter((file) => !file.isStates);
  const states = files.filter((file) => file.isStates);

  state.infomapNetwork = {
    filename: state.network.name,
    content: state.network.value,
  };
  state.infomapFiles = {};
  if (state.clusterData.name && state.clusterData.value) {
    state.infomapFiles[state.clusterData.name] = state.clusterData.value;
  }
  if (state.metaData.name && state.metaData.value) {
    state.infomapFiles[state.metaData.name] = state.metaData.value;
  }
  state.output.completed = files.length > 0;
  state.output.activeContent = state.output[state.output.activeKey];
  state.output.name = state.network.name;
  state.output.files = files;
  state.output.physicalFiles = physical;
  state.output.stateFiles = states;
  state.output.activeFile = files.find(
    ({ key }) => key === state.output.activeKey,
  );
  return state;
}

export const useInfomapStore = create<InfomapState>((set, get) => {
  const rebuildArgs = (params: InfomapParameter[]) => {
    const args = buildArgs(params);
    return { args, noInfomapArgs: buildNoInfomapArgs(args) };
  };

  const setParams = (params: InfomapParameter[]) => {
    const args = rebuildArgs(params);
    set((state) =>
      withDerived({
        ...state,
        params: { ...state.params, params, ...args },
      }),
    );
  };

  const getParam = (name: string) => {
    const param = get().params.params.find((item) => item.long === name);
    if (!param) {
      throw new Error(`Unknown Infomap parameter: ${name}`);
    }
    return param;
  };

  const paramsActions: ParamActions = {
    setRef: () => {},
    getRef: (name) => get().params.refs[name],
    getParam,
    getParamsForGroup: (group) =>
      get().params.params.filter((param) => param.group === group),
    toggle: (param) => {
      if (!param) return;
      setParams(
        get().params.params.map((item) =>
          item.long === param.long ? { ...item, active: !item.active } : item,
        ),
      );
    },
    setIncremental: (param, value) => {
      if (!param) return;
      if (value < 0 || value > (param.maxValue || 0)) return;
      setParams(
        get().params.params.map((item) =>
          item.long === param.long
            ? { ...item, active: value > 0, value }
            : item,
        ),
      );
    },
    setInput: (param, value) => {
      if (!param) return;
      setParams(
        get().params.params.map((item) =>
          item.long === param.long
            ? { ...item, active: value !== "", value }
            : item,
        ),
      );
    },
    setOption: (param, value) => {
      if (!param) return;
      setParams(
        get().params.params.map((item) => {
          if (item.long !== param.long) return item;
          if (item.longType === "list") {
            const values = Array.isArray(value) ? value : [value];
            return { ...item, active: values.length > 0, value: values };
          }
          return {
            ...item,
            active: value !== item.default,
            value: Array.isArray(value) ? value[0] || "" : value,
          };
        }),
      );
    },
    setFileParam: (param, { name, value }) => {
      if (!param) return;
      if (param.long === "--cluster-data") {
        const isTree = /^\d+:\d+/m;
        const defaultName =
          !name && isTree.test(value) ? DEFAULT_TREE_NAME : DEFAULT_CLU_NAME;
        get().setClusterData({ name: name || defaultName, value });
        get().params.setInput(param, name || defaultName);
      } else if (param.long === "--meta-data") {
        get().setMetaData({ name, value });
        get().params.setInput(param, name || DEFAULT_META_NAME);
      }
    },
    resetFileParam: (param) => {
      if (!param) return;
      get().params.setInput(param, "");
      if (param.long === "--cluster-data") {
        get().setClusterData({ name: "", value: "" });
      } else if (param.long === "--meta-data") {
        get().setMetaData({ name: "", value: "" });
      }
    },
    setArgs: (args) => {
      if (get().params.args === args) return;
      const argv = args.trim().split(/\s+/);
      let argsError = "";
      let hasArgsError = false;
      let params = get().params.params;

      try {
        arg(argSpec as arg.Spec, { argv, permissive: false });
        params = applyArgsToParams(params, argv);
      } catch (error) {
        argsError = error instanceof Error ? error.message : String(error);
        hasArgsError = true;
      }

      set((state) =>
        withDerived({
          ...state,
          params: {
            ...state.params,
            params,
            args,
            argsError,
            hasArgsError,
            noInfomapArgs: buildNoInfomapArgs(args),
          },
        }),
      );
    },
  };

  const outputActions: OutputActions = {
    completed: false,
    activeContent: "",
    name: "",
    files: [],
    physicalFiles: [],
    stateFiles: [],
    activeFile: undefined,
    setContent: (content) =>
      set((state) =>
        withDerived({
          ...state,
          output: {
            ...state.output,
            ...applyOutputContent(state.output, content),
          },
        }),
      ),
    resetContent: () =>
      set((state) =>
        withDerived({
          ...state,
          output: { ...emptyOutput(), ...outputActions },
        }),
      ),
    setActiveKey: (key) =>
      set((state) =>
        withDerived({
          ...state,
          output: { ...state.output, activeKey: key },
        }),
      ),
    setDownloaded: (value) =>
      set((state) =>
        withDerived({
          ...state,
          output: { ...state.output, downloaded: value },
        }),
      ),
    downloadFile: (formatKey) => {
      const state = get();
      downloadOutputFile(state.output, state.network.name, formatKey);
      state.output.setDownloaded(true);
    },
    downloadActiveContent: () => {
      const output = get().output;
      output.downloadFile(output.activeKey);
    },
    downloadAll: async () => {
      const state = get();
      await downloadAllOutput(state.output, state.network.name);
      state.output.setDownloaded(true);
    },
  };

  return withDerived({
    network: { name: "two_triangles", value: exampleNetworks.twoTriangles },
    clusterData: { name: "", value: "" },
    metaData: { name: "", value: "" },
    activeInput: "network",
    params: {
      params: initialParams,
      refs: {},
      args: "",
      argsError: "",
      hasArgsError: false,
      noInfomapArgs: "--silent --no-infomap -o flow",
      ...paramsActions,
    },
    output: { ...emptyOutput(), ...outputActions },
    infomapNetwork: { filename: "", content: "" },
    infomapFiles: {},
    setActiveInput: (name) =>
      set((state) => withDerived({ ...state, activeInput: name })),
    setNetwork: ({ name, value }) =>
      set((state) =>
        withDerived({
          ...state,
          network: { name: name || DEFAULT_NET_NAME, value },
          output: { ...state.output, modules: new Map() },
        }),
      ),
    setClusterData: ({ name, value }) =>
      set((state) =>
        withDerived({
          ...state,
          clusterData: { name: name || DEFAULT_CLU_NAME, value },
        }),
      ),
    setMetaData: ({ name, value }) =>
      set((state) =>
        withDerived({
          ...state,
          metaData: { name: name || DEFAULT_META_NAME, value },
        }),
      ),
    getExampleNetwork: (name) => exampleNetworks[name],
    getOutputFormat: (name) => outputExamples[name],
  });
});

export const store = useInfomapStore.getState();

export default useInfomapStore;
