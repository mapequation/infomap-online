import type { RuntimeParam } from "../types";

export default function updateParam(argv: string[]) {
  const args = argv.filter((entry) => entry !== "");

  return (param: RuntimeParam) => {
    param.active = false;

    if (param.longType) {
      if (param.longType === "option") {
        param.value = param.default;
      } else if (param.longType === "list") {
        param.value = [];
      } else if (param.longType !== "path") {
        param.value = "";
      }

      const index = args.findIndex((entry) => entry === param.short || entry === param.long);
      if (index < 0 || index === args.length - 1) {
        return;
      }

      const value = args[index + 1];
      if (value.startsWith("-") && value !== "-1") {
        return;
      }

      switch (param.longType) {
        case "list": {
          const values = value
            .split(",")
            .filter((item) => param.options.includes(item));
          param.active = values.length > 0;
          param.value = values;
          break;
        }
        case "option":
          if (!param.options.includes(value)) {
            param.active = false;
            param.value = param.default;
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
        default:
          break;
      }

      return;
    }

    if (param.incremental) {
      const longIndex = args.findIndex((entry) => entry === param.long);
      if (longIndex > -1) {
        param.active = true;
        param.value = 1;
        return;
      }

      const re = new RegExp(`^${param.short}+$`);
      const shortIndex = args.findIndex((entry) => re.test(entry));
      param.active = shortIndex > -1;
      param.value = shortIndex > -1 ? args[shortIndex].slice(1).length : 0;
      return;
    }

    const index = args.findIndex((entry) => entry === param.short || entry === param.long);
    param.active = index > -1;
  };
}
