import localforage from "localforage";
import type { RefObject } from "react";
import type { RuntimeResult, TextInputFile } from "../../store/types";

localforage.config({ name: "infomap" });

export const DEFAULT_INFOMAP_ARGS = "--clu --ftree";

export function getInitialArgs() {
  if (typeof window === "undefined") {
    return DEFAULT_INFOMAP_ARGS;
  }

  return (
    new URLSearchParams(window.location.search).get("args") ||
    DEFAULT_INFOMAP_ARGS
  );
}

export async function readTextFile(file: Blob) {
  return await new Promise<string>((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader is not available in this environment."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () =>
      reject(reader.error || new Error("Could not read the selected file."));
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.readAsText(file, "utf-8");
  });
}

export async function persistRunResult(
  network: TextInputFile,
  content: RuntimeResult
) {
  await localforage.setItem("network", {
    timestamp: Date.now(),
    name: network.name,
    input: network.value,
    ...content,
  });
}

export function vibrateOnCompletion() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

export function scrollToRef(ref: RefObject<HTMLElement>) {
  ref.current?.scrollIntoView();
}
