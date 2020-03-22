import arg from "arg";


export default function getArgSpec(params) {
  const spec = {};

  params.forEach(param => {
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
