export default function updateParam(argv) {
  const args = argv.filter(a => a !== "");

  return (param) => {
    param.active = false;

    if (param.longType) {
      if (param.longType === "option") {
        param.value = param.default;
      } else if (param.longType === "list") {
        param.value = [];
      }

      const index = args.findIndex(a => a === param.short || a === param.long);
      if (index < 0 || index === args.length - 1) return;
      const value = args[index + 1];
      if (value.startsWith("-")) return;

      switch (param.longType) {
        case "list":
          const values = value.split(",").filter(value => param.options.includes(value));
          param.active = values.length > 0;
          param.value = values;
          break;
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
          param.active = true;
          param.value = value;
          break;
        case "path":
          // TODO
          break;
        default:
          break;
      }
    } else if (param.incremental) {
      const index = args.findIndex(a => a === param.long);
      if (index > -1) {
        param.active = true;
        param.value = 1;
      } else {
        const re = new RegExp(`^${param.short}+$`);
        const index = args.findIndex(a => re.test(a));
        param.active = index > -1;
        param.value = index > -1 ? args[index].slice(1).length : 0;
      }
    } else {
      const index = args.findIndex(a => a === param.short || a === param.long);
      param.active = index > -1;
    }
  };
}