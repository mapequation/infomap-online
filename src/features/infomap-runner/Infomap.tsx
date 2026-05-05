import {
  Box,
  Button,
  ButtonGroup,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { LuCheck, LuPlay } from "react-icons/lu";
import useStore from "../../state";
import type { InputFile, InputName } from "../../state/types";
import Console from "./Console";
import ExampleNetworksList from "./ExamplesMenu";
import InputParameters from "./InputParameters";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import Parameters from "./Parameters";

localforage.config({ name: "infomap" });

const inputTabs = [
  { key: "network", label: "Network" },
  { key: "cluster data", label: "Clusters" },
  { key: "meta data", label: "Metadata" },
] satisfies { key: InputName; label: string }[];

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

  const { activeKey, setActiveKey, physicalFiles, stateFiles } = store.output;
  const { hasArgsError } = store.params;

  const [tab, setTab] = useState<"console" | "output">("console");

  const [infomap] = useState(() =>
    new Infomap()
      .on("data", (data) =>
        setInfomapOutput((output) => [...output, String(data)]),
      )
      .on("error", (error) => {
        const infomapError = error.replace(/^Error:\s+/i, "");
        setInfomapOutput((output) => [...output, `Error: ${infomapError}`]);
        setIsRunning(false);
        console.error(infomapError);
      })
      .on("finished", async (content) => {
        store.output.setContent(content);
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
      setInfomapOutput([`Error: ${message}`]);
      console.error(e);
      return;
    }
  };

  const onCopyClusters = () => store.output.setDownloaded(true);

  const { activeInput, network, clusterData, metaData, output, params } = store;

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

  return (
    <Grid
      flex="1"
      minH={0}
      h="100%"
      overflow="hidden"
      gap={4}
      p={4}
      templateAreas={{
        base: "'input' 'console' 'output'",
        xl: "'input console output'",
      }}
      templateColumns={{
        base: "minmax(0, 1fr)",
        xl: "minmax(16rem, 1.15fr) minmax(24rem, 2fr) minmax(18rem, 1.15fr)",
      }}
      templateRows={{
        base: "minmax(24rem, 1.4fr) minmax(18rem, 1fr) minmax(18rem, 1fr)",
        xl: "minmax(0, 1fr)",
      }}
    >
      <GridItem
        area="input"
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
          <ButtonGroup
            attached
            variant="outline"
            size="sm"
            overflowX="auto"
            maxW="100%"
          >
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

        {tab === "console" && (
          <Console
            placeholder="Infomap output will be printed here"
            flex="1"
            minH={0}
            h="auto"
          >
            {consoleContent}
          </Console>
        )}
        {tab === "output" && (
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
        )}
      </GridItem>
      <GridItem
        area="output"
        minH={0}
        minW={0}
        maxH="100%"
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
          title="Parameters"
          description="CLI arguments and common options"
          action={
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
              Run Infomap
            </Button>
          }
        />

        <Box flexShrink={0} mb={4}>
          <InputParameters loading={isRunning} onClick={run} />
        </Box>

        <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" pr={1}>
          <Parameters />
        </Box>
      </GridItem>
    </Grid>
  );
}
