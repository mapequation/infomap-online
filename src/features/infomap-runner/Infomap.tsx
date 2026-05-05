import {
  Box,
  Button,
  ButtonGroup,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import localforage from "localforage";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuPanelLeftOpen,
  LuPanelRightOpen,
  LuPlay,
  LuX,
} from "react-icons/lu";
import useStore from "../../state";
import { parseCluModules } from "../../state/output";
import type { InputFile, InputName } from "../../state/types";
import Console from "./Console";
import ExampleNetworksList from "./ExamplesMenu";
import InputParameters from "./InputParameters";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import NetworkPreview from "./NetworkPreview";
import Parameters from "./Parameters";

localforage.config({ name: "infomap" });

const inputTabs = [
  { key: "network", label: "Network" },
  { key: "cluster data", label: "Clusters" },
  { key: "meta data", label: "Metadata" },
] satisfies { key: InputName; label: string }[];

type EvaluationMetadata = {
  codeLength: number | null;
  numLevels: number | null;
};

function parseEvaluationMetadata(content: Record<string, unknown>) {
  const json = content.json ?? content.json_states;
  if (!json) return { codeLength: null, numLevels: null };

  let parsed: unknown = json;
  if (typeof json === "string") {
    try {
      parsed = JSON.parse(json) as Record<string, unknown>;
    } catch {
      return { codeLength: null, numLevels: null };
    }
  }
  if (!parsed || typeof parsed !== "object") {
    return { codeLength: null, numLevels: null };
  }

  const source = parsed as { codelength?: unknown; numLevels?: unknown };
  const codeLength = Number(source.codelength);
  const numLevels = Number(source.numLevels);

  return {
    codeLength: Number.isFinite(codeLength) ? codeLength : null,
    numLevels: Number.isFinite(numLevels) ? numLevels : null,
  };
}

function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Flex
      align={{ base: "flex-start", sm: "center" }}
      justify="space-between"
      direction={{ base: "column", sm: "row" }}
      gap={3}
      flexShrink={0}
      mb={3}
    >
      <Box>
        <Heading as="h2" size="sm" mb={1}>
          {title}
        </Heading>
        {description && (
          <Text color="gray.500" fontSize="sm" mb={0}>
            {description}
          </Text>
        )}
      </Box>
      {action}
    </Flex>
  );
}

export default function InfomapOnline() {
  const store = useStore();
  const [infomapOutput, setInfomapOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const outputBufferRef = useRef<string[]>([]);
  const outputFrameRef = useRef<number | null>(null);

  const { activeKey, setActiveKey, physicalFiles, stateFiles } = store.output;
  const { hasArgsError } = store.params;

  const [tab, setTab] = useState<"network" | "console" | "output">("network");
  const [mobilePanel, setMobilePanel] = useState<"input" | "parameters" | null>(
    null,
  );
  const [outputChangedAt, setOutputChangedAt] = useState(0);
  const [clusterChangedAt, setClusterChangedAt] = useState(0);
  const drainOutputBuffer = () => {
    const buffered = outputBufferRef.current;
    outputBufferRef.current = [];

    if (outputFrameRef.current !== null) {
      window.cancelAnimationFrame(outputFrameRef.current);
      outputFrameRef.current = null;
    }

    return buffered;
  };
  const flushOutputBuffer = () => {
    outputFrameRef.current = null;
    const buffered = outputBufferRef.current;
    if (buffered.length === 0) return;
    outputBufferRef.current = [];
    setInfomapOutput((output) => [...output, ...buffered]);
  };
  const queueInfomapOutput = (data: unknown) => {
    outputBufferRef.current.push(String(data));
    if (outputFrameRef.current !== null) return;
    outputFrameRef.current = window.requestAnimationFrame(flushOutputBuffer);
  };

  const [infomap] = useState(() =>
    new Infomap()
      .on("data", queueInfomapOutput)
      .on("error", (error) => {
        const infomapError = error.replace(/^Error:\s+/i, "");
        const buffered = drainOutputBuffer();
        setInfomapOutput((output) => [
          ...output,
          ...buffered,
          `Error: ${infomapError}`,
        ]);
        setIsRunning(false);
        console.error(infomapError);
      })
      .on("finished", async (content) => {
        const buffered = drainOutputBuffer();
        if (buffered.length > 0) {
          setInfomapOutput((output) => [...output, ...buffered]);
        }
        store.output.setContent(content);
        setOutputChangedAt(Date.now());
        await localforage.setItem("network", {
          timestamp: Date.now(),
          name: store.network.name,
          input: store.network.value,
          ...content,
        });
        setIsRunning(false);
      }),
  );

  useEffect(() => {
    const args = new URLSearchParams(window.location.search).get("args");
    const setArgs = store.params.setArgs;

    if (args) {
      setArgs(args);
    } else {
      setArgs("--clu --ftree");
    }
  }, [store.params.setArgs]);

  const onInputChange =
    (activeInput: InputName) =>
    ({ name, value }: InputFile) => {
      if (activeInput === "network") {
        store.setNetwork({ name, value });
      } else if (activeInput === "cluster data") {
        const param = store.params.getParam("--cluster-data");
        setClusterChangedAt(Date.now());
        if (!value) return store.params.resetFileParam(param);
        store.params.setFileParam(param, { name, value });
      } else if (activeInput === "meta data") {
        const param = store.params.getParam("--meta-data");
        if (!value) return store.params.resetFileParam(param);
        store.params.setFileParam(param, { name, value });
      }

      store.output.setDownloaded(false);
    };

  const onLoad = (activeInput: InputName) => (files: File[]) => {
    if (files.length < 1) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      onInputChange(activeInput)({ name: file.name, value });
    };

    reader.readAsText(file, "utf-8");
  };

  const run = () => {
    store.output.resetContent();

    setIsRunning(true);
    drainOutputBuffer();
    setInfomapOutput([]);

    try {
      infomap.run({
        network: store.infomapNetwork.content,
        filename: store.infomapNetwork.filename,
        args: store.params.args,
        files: store.infomapFiles,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setIsRunning(false);
      drainOutputBuffer();
      setInfomapOutput([`Error: ${message}`]);
      console.error(e);
      return;
    }
  };

  const onCopyClusters = () => store.output.setDownloaded(true);

  const { activeInput, network, clusterData, metaData, output, params } = store;
  const [clusterEvaluation, setClusterEvaluation] =
    useState<EvaluationMetadata>({
      codeLength: null,
      numLevels: null,
    });
  const clusterModules = useMemo(
    () => parseCluModules(clusterData.value),
    [clusterData.value],
  );
  const outputMatchesPreview =
    output.modules.size > 0 &&
    [...output.modules.keys()].some((id) => network.value.includes(String(id)));
  const clusterMatchesPreview =
    clusterModules.size > 0 &&
    [...clusterModules.keys()].some((id) => network.value.includes(String(id)));
  const outputWins =
    outputMatchesPreview &&
    (!clusterMatchesPreview || outputChangedAt >= clusterChangedAt);
  const clusterWins = clusterMatchesPreview && !outputWins;
  const previewModules = outputWins
    ? output.modules
    : clusterWins
      ? clusterModules
      : output.modules;
  const previewModuleSource = outputWins
    ? "latest Infomap result"
    : clusterWins
      ? "loaded clusters"
      : "latest Infomap result";
  const previewCodeLength =
    outputWins && output.codeLength !== null
      ? output.codeLength
      : clusterWins && clusterEvaluation.codeLength !== null
        ? clusterEvaluation.codeLength
        : output.codeLength;
  const previewNumLevels =
    outputWins && output.numLevels !== null
      ? output.numLevels
      : clusterWins && clusterEvaluation.numLevels !== null
        ? clusterEvaluation.numLevels
        : output.numLevels;
  const previewLevelModules = outputWins ? output.levelModules : undefined;
  const cluLevelParam = params.getParam("--clu-level");
  const previewSelectedLevel = cluLevelParam.active
    ? Number(cluLevelParam.value)
    : null;
  const previewLevelLabel =
    previewSelectedLevel === -1
      ? "bottom"
      : previewSelectedLevel !== null
        ? String(previewSelectedLevel)
        : undefined;

  useEffect(() => {
    if (!clusterData.value || !network.value) {
      setClusterEvaluation({ codeLength: null, numLevels: null });
      return;
    }

    setClusterEvaluation({ codeLength: null, numLevels: null });
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const evaluator = new Infomap()
        .on("finished", (content) => {
          if (cancelled) return;
          setClusterEvaluation(
            parseEvaluationMetadata(content as Record<string, unknown>),
          );
        })
        .on("error", () => {
          if (!cancelled) {
            setClusterEvaluation({ codeLength: null, numLevels: null });
          }
        });

      try {
        const args = params.noInfomapArgs.replace(/-o\s+\S+/g, "-o json");
        evaluator.run({
          network: network.value,
          filename: network.name,
          args,
          files: { [clusterData.name || "clusters.clu"]: clusterData.value },
        });
      } catch {
        setClusterEvaluation({ codeLength: null, numLevels: null });
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    clusterData.name,
    clusterData.value,
    network.name,
    network.value,
    params.noInfomapArgs,
  ]);

  const inputOptions: Record<InputName, InputFile> = {
    network: network,
    "cluster data": clusterData,
    "meta data": metaData,
  };

  const inputAccept: Record<InputName, string[] | undefined> = {
    network: undefined, // FIXME
    "cluster data": params.getParam("--cluster-data").accept,
    "meta data": params.getParam("--meta-data").accept,
  };

  const inputValue = inputOptions[activeInput].value;
  const consoleContent = infomapOutput.join("\n");
  const outputFiles = [...physicalFiles, ...stateFiles];
  const runButton = (
    <Button
      bg="#b22222"
      color="white"
      _hover={{ bg: "#971d1d" }}
      _active={{ bg: "#7f1818" }}
      _disabled={{ bg: "gray.300", color: "gray.500" }}
      disabled={hasArgsError || isRunning}
      loading={isRunning}
      onClick={run}
      size="sm"
    >
      <LuPlay />
      Run
    </Button>
  );
  const renderInputPanel = () => (
    <>
      <PanelHeader
        title="Network input"
        description={`Editing ${activeInput}`}
        action={
          <ButtonGroup attached size="sm">
            <LoadButton
              onDrop={onLoad(activeInput)}
              accept={inputAccept[activeInput]}
            >
              Load
            </LoadButton>
          </ButtonGroup>
        }
      />

      <ButtonGroup
        attached
        variant="outline"
        size="sm"
        flexShrink={0}
        mb={1}
        overflowX="auto"
        maxW="100%"
      >
        {inputTabs.map(({ key, label }) => {
          const hasInput = Boolean(inputOptions[key].value);
          const isActive = activeInput === key;

          return (
            <Button
              key={key}
              type="button"
              onClick={() => store.setActiveInput(key)}
              disabled={isActive}
              bg={isActive ? "gray.100" : undefined}
            >
              {hasInput && <LuCheck />}
              {label}
            </Button>
          );
        })}
      </ButtonGroup>

      <InputTextarea
        onDrop={onLoad(activeInput)}
        accept={inputAccept[activeInput]}
        onChange={(event) => onInputChange(activeInput)(event.target)}
        value={inputValue}
        placeholder={`Input ${activeInput} here`}
        spellCheck={false}
        wrap="off"
        overflow="auto"
        resize="none"
        flex="1 1 22rem"
        minH={0}
        variant="outline"
        bg="gray.50"
        fontSize="sm"
      />
      <ExampleNetworksList disabled={isRunning} />
    </>
  );
  const renderParametersPanel = () => (
    <>
      <PanelHeader
        title="Parameters"
        description="CLI arguments and common options"
        action={<Box display={{ base: "none", xl: "block" }}>{runButton}</Box>}
      />

      <Box flexShrink={0} mb={4}>
        <InputParameters loading={isRunning} onClick={run} />
      </Box>

      <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" pr={1}>
        <Parameters />
      </Box>
    </>
  );

  return (
    <Grid
      flex="1"
      minH={0}
      h="100%"
      overflow="hidden"
      gap={4}
      p={4}
      templateAreas={{
        base: "'console'",
        xl: "'input console output'",
      }}
      templateColumns={{
        base: "minmax(0, 1fr)",
        xl: "minmax(18rem, 32rem) minmax(28rem, 1fr) minmax(20rem, 34rem)",
      }}
      templateRows={{
        base: "minmax(0, 1fr)",
        xl: "minmax(0, 1fr)",
      }}
    >
      <GridItem
        area="input"
        minH={0}
        minW={0}
        display={{ base: "none", xl: "flex" }}
        flexDirection="column"
        overflow="hidden"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
      >
        {renderInputPanel()}
      </GridItem>
      <GridItem
        area="console"
        minH={0}
        minW={0}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
      >
        <PanelHeader
          title="Run output"
          description="Console logs and generated files"
        />

        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
          flexShrink={0}
          mb={1}
        >
          <HStack display={{ base: "flex", xl: "none" }} gap={2}>
            <Button
              onClick={() => setMobilePanel("input")}
              size="sm"
              variant="surface"
            >
              <LuPanelLeftOpen />
              Input
            </Button>
            <Button
              onClick={() => setMobilePanel("parameters")}
              size="sm"
              variant="surface"
            >
              <LuPanelRightOpen />
              Parameters
            </Button>
            {runButton}
          </HStack>
          <ButtonGroup
            attached
            variant="outline"
            size="sm"
            overflowX="auto"
            maxW="100%"
          >
            <Button
              onClick={() => setTab("network")}
              disabled={tab === "network"}
            >
              Network
            </Button>
            <Button
              onClick={() => setTab("console")}
              disabled={tab === "console"}
            >
              Console
            </Button>
            {outputFiles.map((file) => (
              <Button
                key={file.key}
                onClick={() => {
                  setTab("output");
                  setActiveKey(file.key);
                }}
                disabled={tab === "output" && activeKey === file.key}
              >
                {file.name}
              </Button>
            ))}
          </ButtonGroup>

          {tab === "output" && output.activeContent && (
            <ButtonGroup variant="outline" size="sm" flexShrink={0}>
              <Button
                onClick={output.downloadActiveContent}
                disabled={!output.activeContent || isRunning}
              >
                Download
              </Button>
              <Button onClick={store.output.downloadAll} disabled={isRunning}>
                Download All
              </Button>
            </ButtonGroup>
          )}
        </Stack>

        <Box display={tab === "network" ? "flex" : "none"} flex="1" minH={0}>
          <NetworkPreview
            codeLength={previewCodeLength}
            levelModules={previewLevelModules}
            lockedLevelLabel={previewLevelLabel}
            moduleSource={previewModuleSource}
            network={network.value}
            modules={previewModules}
            numLevels={previewNumLevels}
            selectedLevel={previewSelectedLevel}
          />
        </Box>
        <Box display={tab === "console" ? "flex" : "none"} flex="1" minH={0}>
          <Console
            placeholder="Infomap output will be printed here"
            flex="1"
            minH={0}
            h="auto"
          >
            {consoleContent}
          </Console>
        </Box>
        <Box display={tab === "output" ? "flex" : "none"} flex="1" minH={0}>
          <Field.Root flex="1" minH={0}>
            <Textarea
              readOnly
              onCopy={onCopyClusters}
              value={output.activeContent}
              placeholder="Cluster output will be printed here"
              spellCheck={false}
              wrap="off"
              overflow="auto"
              resize="none"
              h="100%"
              minH={0}
              variant="outline"
              bg="gray.50"
              fontSize="sm"
            />
          </Field.Root>
        </Box>
      </GridItem>
      <GridItem
        area="output"
        minH={0}
        minW={0}
        maxH="100%"
        display={{ base: "none", xl: "flex" }}
        flexDirection="column"
        overflow="hidden"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
      >
        {renderParametersPanel()}
      </GridItem>
      {mobilePanel && (
        <Box
          display={{ base: "block", xl: "none" }}
          inset={0}
          position="fixed"
          zIndex={1400}
        >
          <Box
            bg="blackAlpha.500"
            inset={0}
            onClick={() => setMobilePanel(null)}
            position="absolute"
          />
          <Box
            bg="white"
            bottom={0}
            boxShadow="xl"
            display="flex"
            flexDirection="column"
            left={mobilePanel === "input" ? 0 : undefined}
            maxW="min(28rem, calc(100vw - 2rem))"
            minH={0}
            overflow="hidden"
            p={4}
            position="absolute"
            right={mobilePanel === "parameters" ? 0 : undefined}
            top={0}
            w="100%"
          >
            <HStack justify="space-between" mb={4} flexShrink={0}>
              <Heading as="h2" size="sm" mb={0}>
                {mobilePanel === "parameters" ? "Parameters" : "Network input"}
              </Heading>
              <Button
                aria-label="Close panel"
                onClick={() => setMobilePanel(null)}
                size="sm"
                variant="ghost"
              >
                <LuX />
              </Button>
            </HStack>
            {mobilePanel === "parameters"
              ? renderParametersPanel()
              : renderInputPanel()}
          </Box>
        </Box>
      )}
    </Grid>
  );
}
