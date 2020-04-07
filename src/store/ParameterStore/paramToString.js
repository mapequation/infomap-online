export default function paramToString(param) {
  if (param.longType) {
    switch (param.longType) {
      case "list":
        return `${param.short || param.long} ${param.value.join(",")}`;
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
    return `-${param.stringValue(param.value)}`;
  }

  return param.short || param.long;
}
