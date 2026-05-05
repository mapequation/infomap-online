import { parameters as infomapParameters } from "@mapequation/infomap";
import arg from "arg";
import type { InfomapParameter } from "./types";

const getOptions = (description: string) => {
  const match = description.match(/Options: (.*)\.$/);
  if (!match?.[1]) return [];

  return match[1].split(",").map((option) => option.trim());
};

export function createParams(): InfomapParameter[] {
  return (infomapParameters as unknown as InfomapParameter[]).map((source) => {
    const param = { ...source };

    if (param.short) {
      param.shortString = `${param.short}${
        param.shortType ? `<${param.shortType}>` : ""
      }`;
    }

    param.longString = `${param.long}${
      param.longType ? ` <${param.longType}>` : ""
    }`;

    if (param.longType) {
      param.active = false;

      switch (param.longType) {
        case "list":
          param.dropdown = true;
          param.clearable = true;
          param.default = [];
          param.value = [];
          param.options = getOptions(param.description);
          break;
        case "option":
          param.dropdown = true;
          param.clearable = param.default === "";
          param.value = param.default || "";
          param.options = getOptions(param.description);
          break;
        case "string":
        case "probability":
        case "number":
        case "integer":
          param.value = "";
          param.input = true;
          break;
        case "path":
          param.value = "";
          param.file = true;
          if (param.long === "--cluster-data") {
            param.accept = [".clu", ".tree"];
            param.tabName = "cluster data";
          } else if (param.long === "--meta-data") {
            param.accept = [".clu"];
            param.tabName = "meta data";
          }
          break;
      }
    } else if (param.incremental) {
      param.value = 0;
      param.active = false;
      const short = param.short?.slice(1) || "";
      param.maxValue = short === "h" ? 2 : 3;
      param.stringValue = (value) => (value > 0 ? short.repeat(value) : short);
    } else {
      param.value = param.default || false;
      param.active = !!param.value;
    }

    return param;
  });
}

export function getArgSpec(params: InfomapParameter[]) {
  const spec: Record<string, unknown> = {};

  params.forEach((param) => {
    const { short, long, longType, incremental } = param;

    if (short) {
      spec[short] = long;
    }

    switch (longType || "") {
      case "number":
      case "integer":
      case "probability":
        spec[long] = Number;
        break;
      case "string":
      case "path":
      case "option":
      case "list":
        spec[long] = String;
        break;
      default:
        spec[long] = incremental ? arg.COUNT : Boolean;
    }
  });

  return spec;
}

export function paramToString(param: InfomapParameter) {
  if (param.longType) {
    switch (param.longType) {
      case "list":
        return `${param.short || param.long} ${(param.value as string[]).join(
          ",",
        )}`;
      case "option":
      case "string":
      case "probability":
      case "number":
      case "integer":
      case "path":
        return `${param.short || param.long} ${param.value}`;
      default:
        return "";
    }
  }

  if (param.incremental) {
    return `-${param.stringValue?.(param.value as number)}`;
  }

  return param.short || param.long;
}

export function applyArgsToParams(params: InfomapParameter[], argv: string[]) {
  const args = argv.filter((a) => a !== "");

  return params.map((source) => {
    const param = { ...source };
    param.active = false;

    if (param.longType) {
      if (param.longType === "option") {
        param.value = param.default || "";
      } else if (param.longType === "list") {
        param.value = [];
      } else if (param.longType !== "path") {
        param.value = "";
      }

      const index = args.findIndex(
        (a) => a === param.short || a === param.long,
      );
      if (index < 0 || index === args.length - 1) return param;
      const value = args[index + 1];
      if (value.startsWith("-") && value !== "-1") return param;

      switch (param.longType) {
        case "list": {
          const values = value
            .split(",")
            .filter((item) => param.options?.includes(item));
          param.active = values.length > 0;
          param.value = values;
          break;
        }
        case "option":
          if (!param.options?.includes(value)) {
            param.active = false;
            param.value = param.default || "";
            break;
          }
          param.active = true;
          param.value = value;
          break;
        case "string":
        case "probability":
        case "number":
        case "integer":
        case "path":
          param.active = true;
          param.value = value;
          break;
      }
    } else if (param.incremental) {
      const index = args.indexOf(param.long);
      if (index > -1) {
        param.active = true;
        param.value = 1;
      } else {
        const re = new RegExp(`^${param.short}+$`);
        const shortIndex = args.findIndex((a) => re.test(a));
        param.active = shortIndex > -1;
        param.value = shortIndex > -1 ? args[shortIndex].slice(1).length : 0;
      }
    } else {
      const index = args.findIndex(
        (a) => a === param.short || a === param.long,
      );
      param.active = index > -1;
    }

    return param;
  });
}

export function buildArgs(params: InfomapParameter[]) {
  return params
    .filter((param) => param.active)
    .map(paramToString)
    .join(" ");
}

export function buildNoInfomapArgs(args: string) {
  let noInfomapArgs = args
    .replace("--clu", "")
    .replace("--tree", "")
    .replace("--ftree", "")
    .replace(/(-o)|(--output)\s(\S+,?)+/, "");

  noInfomapArgs += " --silent --no-infomap -o flow";
  return noInfomapArgs.trim();
}
