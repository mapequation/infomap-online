export default (params) =>
  params.map((param) => {
    if (param.longType) {
      param.active = false;

      switch (param.longType) {
        case "list":
          param.value = [];
          param.default = [];
          break;
        case "option":
        case "string":
        case "probability":
        case "number":
        case "integer":
          param.value = param.default || "";
          break;
        case "path":
          param.value = null;
          param.default = null;
          break;
        default:
          break;
      }
    } else if (param.incremental) {
      param.value = 0;
    } else {
      param.value = param.default || false;
      param.active = !!param.value;
    }

    return param;
  });
