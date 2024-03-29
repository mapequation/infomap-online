import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Image,
  List,
  ListItem,
  Progress,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import localforage from "localforage";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../../store";
import { Step, Steps } from "../Steps";
import Console from "./Console";
import DownloadMenu from "./DownloadMenu";
import ExamplesMenu from "./ExamplesMenu";
import InputParameters from "./InputParameters";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import OutputMenu from "./OutputMenu";

localforage.config({ name: "infomap" });

export default observer(function InfomapOnline({ toast }) {
  const store = useStore();
  const [infomapOutput, setInfomapOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const infomap = new Infomap()
    .on("data", (data) => setInfomapOutput((output) => [...output, data]))
    .on("progress", (progress) => setProgress(progress))
    .on("error", (error) => {
      const infomapError = error.replace(/^Error:\s+/i, "");
      setError(infomapError);
      setInfomapOutput((output) => [...output, error]);
      setIsRunning(false);
      setIsCompleted(false);
      toast({ title: "Error", description: infomapError, status: "error" });
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
      setProgress(0);
      if (window.navigator?.vibrate) {
        window.navigator.vibrate([200, 100, 200, 100, 200]);
      }
    });

  useEffect(() => {
    const args = new URLSearchParams(window.location.search).get("args");

    if (args) {
      store.params.setArgs(args);
    } else {
      store.params.setArgs("--clu --ftree");
    }
  }, [store]);

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
      toast({ title: "Error", description: e.message, status: "error" });
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
  const hasInfomapError = error.length > 0;

  let activeStep = 0;
  if (!!network.value) {
    activeStep = 1;
    if (isCompleted || isRunning) {
      activeStep = 2;
      if (output.downloaded) {
        activeStep = 3;
      }
    }
  }

  return (
    <Grid
      as={Container}
      maxW="96em"
      ref={store.mainView}
      templateAreas={{
        base: "'steps' 'input' 'inputMenu' 'console' 'output' 'outputMenu'",
        lg: "'steps steps steps' 'input console output' 'inputMenu empty outputMenu'",
        xl: "'start steps steps steps end' 'inputMenu input console output outputMenu'",
      }}
      templateColumns={{
        base: "1fr",
        lg: "1fr 2fr 1fr",
        xl: "1fr 2fr 4fr 2fr 1fr",
      }}
      mx="auto"
      gap="2rem"
    >
      <GridItem area="steps">
        <Steps activeStep={activeStep}>
          <Step>
            <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
              <Image src="/infomap/images/step1.png" alt="" boxSize="48px" />
              <Box textAlign="center">
                <Text fontWeight={700} my={0}>
                  Load network
                </Text>
                <Text fontSize="xs" my={0}>
                  Edit network or load file
                </Text>
              </Box>
            </HStack>
          </Step>
          <Step>
            <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
              <Image src="/infomap/images/step2.png" alt="" boxSize="48px" />
              <Box textAlign="center">
                <Text fontWeight={700} my={0}>
                  Run Infomap
                </Text>
                <Text fontSize="xs" my={0}>
                  Toggle parameters or add arguments
                </Text>
              </Box>
            </HStack>
          </Step>
          <Step>
            <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
              <Image src="/infomap/images/step3.png" alt="" boxSize="48px" />
              <Box textAlign="center">
                <Text fontWeight={700} my={0}>
                  Explore map!
                </Text>
                <Text fontSize="xs" my={0}>
                  Save result or open in Network Navigator
                </Text>
              </Box>
            </HStack>
          </Step>
        </Steps>
      </GridItem>

      <GridItem area="input" className="network">
        <ButtonGroup isAttached w="100%" mb="1rem" isDisabled={isRunning}>
          <LoadButton
            width="full"
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
          h="60ch"
          pb={15}
          variant="outline"
          bg="white"
          fontSize="sm"
        >
          <Box
            pos="absolute"
            w="calc(100% - 8px)"
            p="0.5rem"
            mb="1px"
            mx="1px"
            fontSize="xs"
            bg="whiteAlpha.900"
            bottom={0}
            left={0}
            borderBottomRadius="lg"
            borderTopColor="gray.200"
            borderTopWidth={2}
            borderTopStyle="dashed"
            zIndex={1000}
          >
            Load {activeInput} by dragging & dropping.
            <br />
            <a href="#Input">Supported formats.</a>
          </Box>
        </InputTextarea>
      </GridItem>

      <GridItem area="inputMenu" pt={{ base: 0, xl: "3em" }}>
        <List fontSize="sm" textAlign={{ base: "left", xl: "right" }}>
          {["network", "cluster data", "meta data"].map((option) => (
            <ListItem
              key={option}
              size="sm"
              onClick={() => store.setActiveInput(option)}
              color={option === activeInput ? "gray.900" : "blackAlpha.600"}
              mb={1}
              cursor="pointer"
              textTransform="capitalize"
            >
              {option}
            </ListItem>
          ))}
        </List>
      </GridItem>

      <GridItem area="console" className="run">
        <InputParameters loading={isRunning} onClick={run} mb="1rem" />

        <Console placeholder="Infomap output will be printed here">
          {consoleContent}
        </Console>
        {isRunning && (
          <Progress
            mx="5px"
            borderBottomRadius="md"
            pos="relative"
            bottom={0}
            size="xs"
            value={progress}
          />
        )}
      </GridItem>

      <GridItem area="output" className="output">
        <ButtonGroup isAttached w="100%" mb="1rem" isDisabled={isRunning}>
          <Tooltip
            visibility={
              isCompleted && !hasInfomapError && !output.ftree
                ? "visible"
                : "hidden"
            }
            placement="top"
            size="sm"
            hasArrow
            label="Network Navigator requires ftree output."
          >
            <Button
              width="full"
              colorScheme="blue"
              as="a"
              _hover={{ color: "white", bg: "blue.600" }}
              target="_blank"
              rel="noopener noreferrer"
              href={`//www.mapequation.org/navigator?infomap=${network.name}.ftree`}
              disabled={!output.ftree}
              borderRightRadius={0}
              size="sm"
            >
              Open in Navigator
            </Button>
          </Tooltip>
          <DownloadMenu disabled={isRunning} />
        </ButtonGroup>

        <FormControl>
          <Textarea
            readOnly
            onCopy={onCopyClusters}
            value={output.activeContent}
            placeholder="Cluster output will be printed here"
            spellCheck={false}
            wrap="off"
            overflow="auto"
            resize="none"
            h="60ch"
            variant="outline"
            bg="white"
            fontSize="sm"
          />
        </FormControl>
      </GridItem>

      <GridItem area="outputMenu" pt={{ base: 0, xl: "3em" }}>
        <OutputMenu fontSize="sm" />
      </GridItem>
    </Grid>
  );
});
