import type { Result as InfomapResult } from "@mapequation/infomap";

export type InputName = "network" | "cluster data" | "meta data";

export interface TextInputFile {
  name: string;
  value: string;
}

export type InfomapFileMap = Record<string, string>;

export type OutputFormatKey =
  | "clu"
  | "tree"
  | "ftree"
  | "newick"
  | "json"
  | "csv"
  | "net"
  | "states_as_physical"
  | "clu_states"
  | "tree_states"
  | "ftree_states"
  | "newick_states"
  | "json_states"
  | "csv_states"
  | "states"
  | "flow"
  | "flow_as_physical";

export interface ParamDefinition {
  long: string;
  short?: string;
  shortType?: string;
  longType?: string;
  description: string;
  group: string;
  required: boolean;
  advanced: boolean;
  incremental: boolean;
  default?: boolean | string | number;
}

export interface RuntimeParam extends ParamDefinition {
  shortString?: string;
  longString: string;
  active: boolean;
  value: boolean | string | number | string[] | undefined;
  dropdown?: boolean;
  clearable?: boolean;
  input?: boolean;
  file?: boolean;
  options: string[];
  accept?: string[];
  tabName?: InputName;
  maxValue?: number;
  stringValue?: (value: number) => string;
}

export interface DownloadableOutputFile {
  key: OutputFormatKey;
  name: string;
  isStates: boolean;
  suffix: string;
  extension: string;
  filename: string;
}

export type RuntimeResult = InfomapResult;
