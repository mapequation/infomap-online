import type { RuntimeParam } from "../types";

export default function paramToString(param: RuntimeParam) {
  if (param.longType) {
    switch (param.longType) {
      case "list":
        return `${param.short || param.long} ${(param.value as string[]).join(",")}`;
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

  if (param.incremental && param.stringValue) {
    return `-${param.stringValue(param.value as number)}`;
  }

  return param.short || param.long;
}
