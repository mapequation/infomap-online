import { saveAs } from "file-saver";
import JSZip from "jszip";
import { OUTPUT_FORMATS } from "../data/output-formats";
import type { OutputContent, OutputFile, OutputKey } from "./types";

export type OutputState = Record<OutputKey, string> & {
  activeKey: OutputKey;
  downloaded: boolean;
  modules: Map<number, number>;
};

export const emptyOutput = (): OutputState => ({
  clu: "",
  tree: "",
  ftree: "",
  net: "",
  newick: "",
  json: "",
  csv: "",
  states_as_physical: "",
  clu_states: "",
  tree_states: "",
  ftree_states: "",
  newick_states: "",
  json_states: "",
  csv_states: "",
  states: "",
  flow: "",
  flow_as_physical: "",
  activeKey: "tree",
  downloaded: false,
  modules: new Map(),
});

export function outputCompleted(output: OutputState) {
  return OUTPUT_FORMATS.some(({ key }) => !!output[key]);
}

export function outputFiles(output: OutputState, name: string): OutputFile[] {
  return OUTPUT_FORMATS.filter(({ key }) => output[key]).map((format) => ({
    ...format,
    filename: `${name}${format.suffix}.${format.extension}`,
  }));
}

export function physicalFiles(output: OutputState, name: string) {
  return outputFiles(output, name).filter((file) => !file.isStates);
}

export function stateFiles(output: OutputState, name: string) {
  return outputFiles(output, name).filter((file) => file.isStates);
}

export function parseModules(output: OutputState) {
  const clu = output.clu_states || output.clu;
  if (!clu) return new Map<number, number>();

  const modules = new Map<number, number>();
  const lines = clu.split("\n").filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const [id, moduleId] = line.split(" ").map(Number);
    modules.set(id, moduleId);
  }
  return modules;
}

export function applyOutputContent(
  current: OutputState,
  content: OutputContent,
): OutputState {
  const next = { ...current };

  for (const { key } of OUTPUT_FORMATS) {
    const value = content[key];
    if (!value) continue;
    next[key] =
      key === "json" || key === "json_states"
        ? JSON.stringify(value, null, 2)
        : String(value);
  }

  next.modules = parseModules(next);
  next.activeKey =
    ([
      "clu",
      "tree",
      "ftree",
      "newick",
      "json",
      "csv",
      "net",
      "states",
      "flow",
    ].find((key) => content[key as OutputKey]) as OutputKey | undefined) ||
    "clu";

  return next;
}

export function downloadOutputFile(
  output: OutputState,
  name: string,
  formatKey: OutputKey,
) {
  const file = outputFiles(output, name).find(({ key }) => key === formatKey);
  const content = output[formatKey];
  if (!file) return;

  const mimeType =
    formatKey === "json" || formatKey === "json_states"
      ? "application/json;charset=utf-8"
      : "text/plain;charset=utf-8";
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, file.filename);
}

export async function downloadAllOutput(output: OutputState, name: string) {
  const zip = new JSZip();
  for (const file of outputFiles(output, name)) {
    zip.file(file.filename, output[file.key]);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${name}.zip`);
}
