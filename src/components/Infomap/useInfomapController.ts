import { useEffect, useMemo, useState } from "react";
import { loadInfomapRuntime } from "../../lib/infomap-client";
import type Store from "../../store/Store";
import type { InputName, TextInputFile } from "../../store/types";
import {
  getInitialArgs,
  persistRunResult,
  readTextFile,
  vibrateOnCompletion,
} from "./browser";

type ToastFn = (options: {
  title: string;
  description: string;
  status: "error";
}) => void;

export default function useInfomapController(store: Store, toast: ToastFn) {
  const [infomapOutput, setInfomapOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const [infomap, setInfomap] = useState<{
    run: (input: {
      network: string;
      filename: string;
      args: string;
      files: Record<string, string>;
    }) => void;
  } | null>(null);

  useEffect(() => {
    void store.params.hydrate(getInitialArgs());
  }, [store]);

  useEffect(() => {
    let isMounted = true;

    void loadInfomapRuntime().then((Infomap) => {
      if (!isMounted) {
        return;
      }

      const instance = new Infomap()
        .on("data", (data) => {
          setInfomapOutput((output) => [...output, data]);
        })
        .on("progress", (nextProgress) => {
          setProgress(nextProgress);
        })
        .on("error", (nextError) => {
          const infomapError = nextError.replace(/^Error:\s+/i, "");
          setError(infomapError);
          setInfomapOutput((output) => [...output, nextError]);
          setIsRunning(false);
          setIsCompleted(false);
          toast({
            title: "Error",
            description: infomapError,
            status: "error",
          });
        })
        .on("finished", async (content) => {
          store.output.setContent(content);
          await persistRunResult(store.network, content);
          setIsRunning(false);
          setIsCompleted(true);
          setProgress(0);
          vibrateOnCompletion();
        });

      setInfomap(instance);
    });

    return () => {
      isMounted = false;
    };
  }, [store, toast]);

  const resetRuntimeState = () => {
    store.output.setDownloaded(false);
    setIsLoading(false);
    setIsCompleted(false);
    setError("");
  };

  const onInputChange =
    (activeInput: InputName) =>
    ({ name, value }: TextInputFile) => {
      if (activeInput === "network") {
        store.setNetwork({ name, value });
      } else if (activeInput === "cluster data") {
        const param = store.params.getParam("--cluster-data");
        if (!value) {
          store.params.resetFileParam(param);
          return;
        }
        store.params.setFileParam(param, { name, value });
      } else if (activeInput === "meta data") {
        const param = store.params.getParam("--meta-data");
        if (!value) {
          store.params.resetFileParam(param);
          return;
        }
        store.params.setFileParam(param, { name, value });
      }

      resetRuntimeState();
    };

  const onLoad = (activeInput: InputName) => async (files: File[]) => {
    if (files.length < 1) {
      return;
    }

    setIsLoading(true);

    try {
      const file = files[0];
      const value = await readTextFile(file);
      onInputChange(activeInput)({ name: file.name, value });
    } catch (nextError) {
      const description =
        nextError instanceof Error ? nextError.message : String(nextError);
      toast({ title: "Error", description, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const run = () => {
    if (!infomap) {
      return;
    }

    store.output.resetContent();
    setError("");
    setIsRunning(true);
    setIsCompleted(false);
    setInfomapOutput([]);

    try {
      infomap.run({
        network: store.infomapNetwork.content,
        filename: store.infomapNetwork.filename,
        args: store.params.args,
        files: store.infomapFiles,
      });
    } catch (nextError) {
      const description =
        nextError instanceof Error ? nextError.message : String(nextError);
      setIsRunning(false);
      setError(description);
      toast({ title: "Error", description, status: "error" });
      return;
    }

    setError("");
  };

  const activeInput = store.activeInput;
  const inputOptions = {
    network: store.network,
    "cluster data": store.clusterData,
    "meta data": store.metaData,
  } as const;

  const inputAccept = {
    network: undefined,
    "cluster data": store.params.getParam("--cluster-data")?.accept,
    "meta data": store.params.getParam("--meta-data")?.accept,
  } as const;

  const consoleContent = infomapOutput.join("\n");
  const inputValue = inputOptions[activeInput].value;
  const hasInfomapError = error.length > 0;

  const activeStep = useMemo(() => {
    if (!store.network.value) {
      return 0;
    }

    if (!(isCompleted || isRunning)) {
      return 1;
    }

    if (!store.output.downloaded) {
      return 2;
    }

    return 3;
  }, [isCompleted, isRunning, store.network.value, store.output.downloaded]);

  return {
    activeInput,
    activeStep,
    consoleContent,
    hasInfomapError,
    inputAccept,
    inputValue,
    isCompleted,
    isLoading,
    isRunning,
    isReady: Boolean(infomap) && store.params.ready,
    onCopyClusters: () => store.output.setDownloaded(true),
    onInputChange,
    onLoad,
    progress,
    run,
  };
}
