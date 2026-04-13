import type { ParamDefinition, RuntimeParam } from "../types";

const getOptions = (description: string) => {
  const match = description.match(/Options: (.*)\.$/);
  if (!(match && match[1])) {
    return [];
  }

  return match[1].split(",").map((option) => option.trim());
};

export default function createParams(params: ParamDefinition[]): RuntimeParam[] {
  return params.map((param) => {
    const nextParam: RuntimeParam = {
      ...param,
      active: false,
      longString: `${param.long}${param.longType ? ` <${param.longType}>` : ""}`,
      options: [],
      value: param.default || false,
    };

    if (param.short) {
      nextParam.shortString = `${param.short}${
        param.shortType ? `<${param.shortType}>` : ""
      }`;
    }

    if (param.longType) {
      switch (param.longType) {
        case "list":
          nextParam.dropdown = true;
          nextParam.clearable = true;
          nextParam.value = [];
          nextParam.options = getOptions(param.description);
          break;
        case "option":
          nextParam.dropdown = true;
          nextParam.clearable = param.default === "";
          nextParam.value = param.default;
          nextParam.options = getOptions(param.description);
          break;
        case "string":
        case "probability":
        case "number":
        case "integer":
          nextParam.value = "";
          nextParam.input = true;
          break;
        case "path":
          nextParam.value = "";
          nextParam.file = true;
          if (param.long === "--cluster-data") {
            nextParam.accept = [".clu", ".tree"];
            nextParam.tabName = "cluster data";
          } else if (param.long === "--meta-data") {
            nextParam.accept = [".clu"];
            nextParam.tabName = "meta data";
          }
          break;
        default:
          break;
      }
    } else if (param.incremental && param.short) {
      const short = param.short.slice(1);
      nextParam.value = 0;
      nextParam.maxValue = short === "h" ? 2 : 3;
      nextParam.stringValue = (value: number) =>
        value > 0 ? short.repeat(value) : short;
    } else {
      nextParam.value = param.default || false;
      nextParam.active = !!nextParam.value;
    }

    return nextParam;
  });
}
