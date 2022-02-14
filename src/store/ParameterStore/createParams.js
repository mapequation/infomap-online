const getOptions = (description) => {
  const match = description.match(/Options: (.*)\.$/);
  if (!(match && match[1])) return [];

  return match[1].split(",").map((option) => option.trim());
};

export default function createParams(params) {
  return params.map((param) => {
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
          param.value = param.default;
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
        default:
          break;
      }
    } else if (param.incremental) {
      param.value = 0;
      param.active = false;
      const short = param.short.slice(1);
      param.maxValue = short === "h" ? 2 : 3;
      param.stringValue = (value) => (value > 0 ? short.repeat(value) : short);
    } else {
      param.value = param.default || false;
      param.active = !!param.value;
    }

    return param;
  });
}
