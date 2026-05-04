export type InputName = "network" | "cluster data" | "meta data";

export type InputFile = {
  name: string;
  value: string;
};

export type OutputKey =
  | "clu"
  | "tree"
  | "ftree"
  | "net"
  | "newick"
  | "json"
  | "csv"
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

export type OutputContent = Partial<Record<OutputKey, unknown>>;

export type OutputFormat = {
  key: OutputKey;
  name: string;
  isStates: boolean;
  suffix: string;
  extension: string;
};

export type OutputFile = OutputFormat & {
  filename: string;
};

export type InfomapParameter = {
  short?: string;
  long: string;
  shortType?: string;
  longType?: string;
  incremental?: boolean;
  group: string;
  description: string;
  default?: string | boolean | string[];
  advanced?: boolean;
  active: boolean;
  value: string | boolean | string[] | number;
  shortString?: string;
  longString: string;
  dropdown?: boolean;
  clearable?: boolean;
  input?: boolean;
  file?: boolean;
  accept?: string[];
  tabName?: InputName;
  options?: string[];
  maxValue?: number;
  stringValue?: (value: number) => string;
};
