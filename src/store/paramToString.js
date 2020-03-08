export default function paramToString(param) {
  if (param.incremental) {
    return `-${param.stringValue(param.value)}`;
  }

  return param.short || param.long;
}