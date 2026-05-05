import { saveAs } from "file-saver";
import JSZip from "jszip";
import { OUTPUT_FORMATS } from "../data/output-formats";
import type { OutputContent, OutputFile, OutputKey } from "./types";

export type OutputState = Record<OutputKey, string> & {
  activeKey: OutputKey;
  codeLength: number | null;
  downloaded: boolean;
  levelModules: Map<number, Map<number, string>>;
  modules: Map<number, number>;
  numLevels: number | null;
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
  codeLength: null,
  downloaded: false,
  levelModules: new Map(),
  modules: new Map(),
  numLevels: null,
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

export function parseCluModules(clu: string) {
  if (!clu) return new Map<number, number>();

  const modules = new Map<number, number>();
  const lines = clu.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("%")) {
      continue;
    }
    const [id, moduleId] = trimmed.split(/\s+/).map(Number);
    if (Number.isFinite(id) && Number.isFinite(moduleId)) {
      modules.set(id, moduleId);
    }
  }
  return modules;
}

export function parseModules(output: OutputState) {
  return parseCluModules(output.clu_states || output.clu);
}

export function parseTreeLevelModules(tree: string) {
  const levels = new Map<number, Map<number, string>>();

  for (const line of tree.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("%") ||
      trimmed.startsWith("*")
    ) {
      continue;
    }

    const columns = trimmed.split(/\s+/);
    const path = columns[0];
    const nodeId = Number(columns.at(-1));
    if (!/^\d+(?::\d+)+$/.test(path) || !Number.isFinite(nodeId)) {
      continue;
    }

    const parts = path.split(":");
    const moduleDepth = Math.max(1, parts.length - 1);
    for (let level = 1; level <= moduleDepth; level += 1) {
      const moduleId = parts.slice(0, level).join(":");
      const levelModules = levels.get(level) ?? new Map<number, string>();
      levelModules.set(nodeId, moduleId);
      levels.set(level, levelModules);
    }
  }

  return levels;
}

function parseJsonMetadata(output: OutputState) {
  const json = output.json_states || output.json;
  if (!json) return { codeLength: null, numLevels: null };

  try {
    const content = JSON.parse(json) as {
      codelength?: unknown;
      codeLength?: unknown;
      numLevels?: unknown;
    };
    const codeLength = Number(content.codelength ?? content.codeLength);
    const numLevels = Number(content.numLevels);
    return {
      codeLength: Number.isFinite(codeLength) ? codeLength : null,
      numLevels: Number.isFinite(numLevels) ? numLevels : null,
    };
  } catch {
    return { codeLength: null, numLevels: null };
  }
}

function parseTextCodeLength(output: OutputState) {
  const content = [
    output.tree_states,
    output.ftree_states,
    output.tree,
    output.ftree,
    output.clu_states,
    output.clu,
  ].join("\n");
  const match = content.match(/#\s*codelength\s+([0-9.eE+-]+)/i);
  if (!match?.[1]) return null;

  const codeLength = Number(match[1]);
  return Number.isFinite(codeLength) ? codeLength : null;
}

function parseTreeLevels(output: OutputState) {
  const content = [
    output.tree_states,
    output.ftree_states,
    output.tree,
    output.ftree,
  ].join("\n");
  let maxDepth = 0;

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("%") ||
      trimmed.startsWith("*")
    ) {
      continue;
    }

    const [path] = trimmed.split(/\s+/);
    if (!/^\d+(?::\d+)+$/.test(path)) continue;
    maxDepth = Math.max(maxDepth, path.split(":").length);
  }

  return maxDepth > 0 ? maxDepth : null;
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
  next.levelModules = parseTreeLevelModules(
    next.tree_states || next.ftree_states || next.tree || next.ftree,
  );
  const jsonMetadata = parseJsonMetadata(next);
  next.codeLength = jsonMetadata.codeLength ?? parseTextCodeLength(next);
  next.numLevels = jsonMetadata.numLevels ?? parseTreeLevels(next);
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
