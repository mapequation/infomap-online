import type { Changelog } from "@mapequation/infomap";
import type { ParamDefinition } from "../store/types";

type InfomapModule = typeof import("@mapequation/infomap");

let infomapModulePromise: Promise<InfomapModule> | null = null;

function getInfomapModule() {
  infomapModulePromise ||= import("@mapequation/infomap");
  return infomapModulePromise;
}

export async function loadInfomapMetadata() {
  const infomapModule = await getInfomapModule();

  return {
    changelog: infomapModule.changelog as Changelog[],
    parameters: infomapModule.parameters as unknown as ParamDefinition[],
    version: infomapModule.default.__version__,
  };
}

export async function loadInfomapRuntime() {
  const infomapModule = await getInfomapModule();
  return infomapModule.default;
}
