import arg from "arg";

export default function getArgSpec(params) {
  const spec = {};

  params.forEach(param => {
    const { short, long, shortType, incremental } = param;

    if (short) {
      spec[short] = long;
    }

    switch (shortType || "") {
      case "f": // float
      case "n": // integer
      case "P": // probability
        spec[long] = Number;
        break;
      case "s": // string
      case "p": // path
      case "o": // option
      case "l": // list
        spec[long] = String;
        break;
      case "": // no argument flag
      default:
        spec[long] = incremental ? arg.COUNT : Boolean;
    }
  });

  return spec;
}
