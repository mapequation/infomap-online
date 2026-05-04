// @ts-nocheck
import {
  Box,
  Button,
  ButtonGroup,
  Field,
  Grid,
  GridItem,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import localforage from "localforage";
import { useEffect, useState } from "react";
import useStore from "../../store";
import Console from "./Console";
import ExamplesMenu from "./ExamplesMenu";
import InputParameters from "./InputParameters";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import Parameters from "./Parameters";

localforage.config({ name: "infomap" });

export default function InfomapOnline() {
  const store = useStore();
  const [infomapOutput, setInfomapOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const { activeKey, setActiveKey, physicalFiles, stateFiles } = store.output;
  const { hasArgsError } = store.params;

  const [tab, setTab] = useState<"console" | "output">("console");

  const [infomap] = useState(() =>
    new Infomap()
      .on("data", (data) => setInfomapOutput((output) => [...output, data]))
      .on("error", (error) => {
        const infomapError = error.replace(/^Error:\s+/i, "");
        setError(infomapError);
        setInfomapOutput((output) => [...output, error]);
        setIsRunning(false);
        setIsCompleted(false);
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
        setIsCompleted(true);
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
    (activeInput) =>
    ({ name, value }) => {
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

      setIsLoading(false);
      setIsCompleted(false);
      setError("");
    };

  const onLoad = (activeInput) => (files) => {
    if (files.length < 1) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () =>
      onInputChange(activeInput)({ name: file.name, value: reader.result });

    setIsLoading(true);
    reader.readAsText(file, "utf-8");
  };

  const run = () => {
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
    } catch (e) {
      setIsRunning(false);
      setError(e.message);
      console.error(e);
      return;
    }

    setError("");
  };

  const onCopyClusters = () => store.output.setDownloaded(true);

  const { activeInput, network, clusterData, metaData, output, params } = store;

  const inputOptions = {
    network: network,
    "cluster data": clusterData,
    "meta data": metaData,
  };

  const inputAccept = {
    network: undefined, // FIXME
    "cluster data": params.getParam("--cluster-data").accept,
    "meta data": params.getParam("--meta-data").accept,
  };

  const inputValue = inputOptions[activeInput].value;
  const consoleContent = infomapOutput.join("\n");

  return (
    <Grid
      flex="1"
      minH={0}
      h="100%"
      overflow="hidden"
      templateAreas={{
        xl: "'input console output'",
      }}
      templateColumns={{
        xl: "minmax(0, 2fr) minmax(0, 4fr) minmax(0, 2fr)",
      }}
    >
      <GridItem
        area="input"
        className="network"
        minH={0}
        minW={0}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <ButtonGroup attached w="100%" mb="1rem">
          <LoadButton
            size="sm"
            onDrop={onLoad(activeInput)}
            accept={inputAccept[activeInput]}
          >
            Load {activeInput}
          </LoadButton>
          <ExamplesMenu disabled={isRunning} />
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
          flex="1"
          minH={0}
          pb={15}
          variant="outline"
          bg="white"
          fontSize="sm"
        />
      </GridItem>
      <GridItem
        area="inputMenu"
        pt={{ base: 0, xl: "3em" }}
        style={{ display: "none" }}
      >
        <Box as="ul" fontSize="sm" textAlign={{ base: "left", xl: "right" }}>
          {["network", "cluster data", "meta data"].map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => store.setActiveInput(option)}
                style={{
                  background: "transparent",
                  border: 0,
                  color:
                    option === activeInput
                      ? "var(--chakra-colors-gray-900)"
                      : "rgba(0, 0, 0, 0.6)",
                  cursor: "pointer",
                  marginBottom: "0.25rem",
                  padding: 0,
                  textAlign: "inherit",
                  textTransform: "capitalize",
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </Box>
      </GridItem>
      <GridItem
        area="console"
        className="run"
        minH={0}
        minW={0}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Stack direction="row" justify="space-between" flexShrink={0}>
          <ButtonGroup attached w="100%" variant="outline" size="sm">
            <Button
              onClick={() => setTab("console")}
              disabled={tab === "console"}
            >
              Console
            </Button>
            {[...physicalFiles, ...stateFiles].map((file) => (
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

          {output.activeContent && (
            <ButtonGroup variant="outline" size="sm">
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
              bg="white"
              fontSize="sm"
            />
          </Field.Root>
        )}
      </GridItem>
      <GridItem
        area="output"
        className="output"
        minH={0}
        minW={0}
        maxH="100%"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        pr={2}
      >
        <Box flexShrink={0}>
          <Button
            colorPalette="blue"
            disabled={hasArgsError || isRunning}
            loading={isRunning}
            onClick={run}
            px={10}
            borderLeftRadius={0}
            size="sm"
          >
            Run Infomap
          </Button>

          <InputParameters loading={isRunning} />
        </Box>

        <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" pr={2}>
          <Parameters />
        </Box>
      </GridItem>
    </Grid>
  );
}
