import type { Result as InfomapResult } from "@mapequation/infomap";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { action, computed, makeObservable, observable } from "mobx";
import type Store from "../Store";
import type {
  DownloadableOutputFile,
  OutputFormatKey,
  RuntimeResult,
} from "../types";
import { FORMATS } from "./formats";

const OUTPUT_KEYS = [
  "clu",
  "tree",
  "ftree",
  "newick",
  "json",
  "csv",
  "net",
  "states_as_physical",
  "clu_states",
  "tree_states",
  "ftree_states",
  "newick_states",
  "json_states",
  "csv_states",
  "states",
  "flow",
  "flow_as_physical",
] as const satisfies OutputFormatKey[];

type OutputContentKey = (typeof OUTPUT_KEYS)[number];

const ACTIVE_KEY_ORDER: OutputFormatKey[] = [
  "clu",
  "tree",
  "ftree",
  "newick",
  "json",
  "csv",
  "net",
  "states",
  "flow",
];

function serializeResultValue(key: OutputContentKey, value: RuntimeResult[OutputContentKey]) {
  if (value == null) {
    return "";
  }

  if (key === "json" || key === "json_states") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export function parseModules(cluContent: string) {
  const modules = new Map<number, number>();
  const lines = cluContent.split("\n").filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("#")) {
      continue;
    }

    const [id, moduleId] = line.split(" ").map(Number);
    if (Number.isFinite(id) && Number.isFinite(moduleId)) {
      modules.set(id, moduleId);
    }
  }

  return modules;
}

function getPreferredActiveKey(content: Partial<Record<OutputContentKey, string>>) {
  return (
    ACTIVE_KEY_ORDER.find((key) => Boolean(content[key])) ||
    "clu"
  );
}

export default class OutputStore {
  private readonly parent: Store;

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

  activeKey: OutputFormatKey = "tree";

  downloaded = false;

  modules = new Map<number, number>();

  constructor(parent: Store) {
    this.parent = parent;

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
      modules: observable,
    });
  }

  get completed() {
    return OUTPUT_KEYS.some((key) => Boolean(this[key]));
  }

  get activeContent() {
    return this[this.activeKey];
  }

  get name() {
    return this.parent.network.name;
  }

  get files(): DownloadableOutputFile[] {
    return FORMATS.filter(({ key }) => Boolean(this[key])).map((format) => ({
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

  setContent = (content: InfomapResult) => {
    const serialized: Partial<Record<OutputContentKey, string>> = {};

    OUTPUT_KEYS.forEach((key) => {
      const value = serializeResultValue(key, content[key]);
      if (value) {
        serialized[key] = value;
        this[key] = value;
      }
    });

    const cluContent = serialized.clu_states || serialized.clu || "";
    this.modules = cluContent ? parseModules(cluContent) : new Map<number, number>();
    this.setActiveKey(getPreferredActiveKey(serialized));
  };

  resetContent = () => {
    OUTPUT_KEYS.forEach((key) => {
      this[key] = "";
    });

    this.downloaded = false;
    this.modules = new Map<number, number>();
  };

  setActiveKey = (key: OutputFormatKey) => {
    this.activeKey = key;
  };

  setDownloaded = (value: boolean) => {
    this.downloaded = value;
  };

  downloadFile = (formatKey: OutputFormatKey) => {
    const file = this.files.find(({ key }) => key === formatKey);
    if (!file) {
      return;
    }

    const content = this[formatKey];
    const mimeType =
      formatKey === "json" || formatKey === "json_states"
        ? "application/json;charset=utf-8"
        : "text/plain;charset=utf-8";
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, file.filename);
    this.setDownloaded(true);
  };

  downloadActiveContent = () => {
    this.downloadFile(this.activeKey);
  };

  downloadAll = () => {
    const zip = new JSZip();

    for (const file of this.files) {
      zip.file(file.filename, this[file.key]);
    }

    void zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, `${this.name}.zip`);
      this.setDownloaded(true);
    });
  };
}
