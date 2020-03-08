export default function updateParam(argv) {
  const args = argv.filter(a => a !== "");

  return (param) => {
    if (param.longType) {
      // TODO
    } else if (param.incremental) {
      const re = new RegExp(`^${param.short}+$`);
      const index = args.findIndex(a => re.test(a));
      param.active = index > -1;
      param.value = index > -1 ? args[index].slice(1).length : 0;
    } else {
      const index = args.findIndex(a => a === param.short || a === param.long);
      param.active = index > -1;
    }
  };
}