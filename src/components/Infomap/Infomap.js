import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  GridItem,
  Progress,
  Textarea,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import { Step, Steps } from "chakra-ui-steps";
import localforage from "localforage";
import { observer } from "mobx-react";
import { Component } from "react";
import { Form, Menu } from "semantic-ui-react";
import store from "../../store";
import Console from "./Console";
import DownloadMenu from "./DownloadMenu";
import InputParameters from "./InputParameters";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import OutputMenu from "./OutputMenu";

export default observer(
  class InfomapOnline extends Component {
    onInputChange = (activeInput) => {
      return (event) => {
        // console.log(event);
        const { name, value } = event;
        const { params } = store;

        if (activeInput === "network") {
          store.setNetwork({ name, value });
        } else if (activeInput === "cluster data") {
          const param = params.getParam("--cluster-data");
          if (!value) return params.resetFileParam(param);
          params.setFileParam(param, { name, value });
        } else if (activeInput === "meta data") {
          const param = params.getParam("--meta-data");
          if (!value) return params.resetFileParam(param);
          params.setFileParam(param, { name, value });
        }

        store.output.setDownloaded(false);

        this.setState({
          isLoading: false,
          isCompleted: false,
          infomapError: "",
        });
      };
    };
    onLoad = (activeInput) => (files) => {
      if (files.length < 1) return;

      const file = files[0];

      const reader = new FileReader();

      const onInputChange = this.onInputChange(activeInput);

      reader.onloadend = (event) => onInputChange(event, { name: file.name, value: reader.result });

      this.setState({ isLoading: true }, () => reader.readAsText(file, "utf-8"));
    };
    run = () => {
      store.output.resetContent();

      this.setState({
        isCompleted: false,
        infomapOutput: [],
      });

      if (this.runId) {
        this.infomap.terminate(this.runId);
        this.runId = null;
      }

      try {
        this.runId = this.infomap.run({
          network: store.infomapNetwork.content,
          filename: store.infomapNetwork.filename,
          args: store.params.args,
          files: store.infomapFiles,
        });
      } catch (e) {
        this.setState({
          isRunning: false,
          infomapError: e.message,
        });
        return;
      }

      this.setState({
        isRunning: true,
        infomapError: "",
      });
    };
    onInputMenuClick = (e, { name }) => store.setActiveInput(name);
    onCopyClusters = () => store.output.setDownloaded(true);

    constructor(props) {
      super(props);

      const onData = (content) =>
        this.setState({
          infomapOutput: [...this.state.infomapOutput, content],
        });

      const onError = (content) =>
        this.setState({
          infomapError: content.replace(/^Error:\s+/i, ""),
          infomapOutput: [...this.state.infomapOutput, content],
          isRunning: false,
          isCompleted: false,
        });

      const onProgress = (progress) => this.setState({ progress });

      const onFinished = async (content) => {
        store.output.setContent(content);
        await localforage.setItem("ftree", store.output.ftree);
        this.setState({
          isRunning: false,
          isCompleted: true,
          progress: 0,
        });
      };

      this.infomap = new Infomap()
        .on("data", onData)
        .on("progress", onProgress)
        .on("error", onError)
        .on("finished", onFinished);
    }

    componentDidMount() {
      localforage.config({ name: "infomap" });

      const urlSearchParams = URLSearchParams || window.URLSearchParams;
      const urlParams = new urlSearchParams(window.location.search);
      const args = urlParams.get("args");

      if (args) {
        store.params.setArgs(args);
      } else {
        store.params.setArgs("--clu --ftree");
      }
    }

    render() {
      const { isLoading, isRunning, isCompleted, infomapError, infomapOutput, progress } =
        this.state;
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

      const inputMenuOptions = ["network", "cluster data", "meta data"].map((name) => ({
        key: name,
        name,
        active: activeInput === name,
        className: inputOptions[name].value ? "finished" : undefined,
      }));

      const consoleContent = infomapOutput.join("\n");
      const hasInfomapError = !!infomapError;

      const inputMenuProps = {
        vertical: true,
        size: "small",
        onItemClick: this.onInputMenuClick,
        items: inputMenuOptions,
      };

      const outputMenuProps = { vertical: true, disabled: !isCompleted };

      let navigatorLabel = null;

      if (isCompleted && !hasInfomapError) {
        if (!output.ftree) {
          navigatorLabel = (
            <div>
              Network Navigator requires ftree output.{" "}
              {!params.getParam("--ftree").active && (
                <a onClick={() => params.setArgs(params.args + " --ftree")}>Enable.</a>
              )}
            </div>
          );
          // } else if (output.ftree) {
          //   navigatorLabel = (
          //     <div>
          //       Could not store network. Please download ftree and load manually.
          //     </div>
          //   );
        }
      }

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
        <Grid templateColumns="1fr 2fr 1fr" maxWidth="120ch" mx="auto" p="1rem" gap="2rem">
          <GridItem colSpan={3} px={[0, 0, 0, "2rem"]}>
            <Steps size="lg" activeStep={activeStep} colorScheme="blue" labelOrientation="vertical">
              <Step label="Load network" description="Edit network or load file" />
              <Step label="Run Infomap" description="Toggle parameters or add arguments" />
              <Step label="Explore map!" description="Save result or open in Network Navigator" />
            </Steps>
          </GridItem>

          <GridItem className="network">
            <LoadButton
              mb="1rem"
              size="sm"
              onDrop={this.onLoad(activeInput)}
              accept={inputAccept[activeInput]}
            >
              Load {activeInput}
            </LoadButton>

            <InputTextarea
              onDrop={this.onLoad(activeInput)}
              accept={inputAccept[activeInput]}
              onChange={this.onInputChange(activeInput)}
              value={inputValue}
              placeholder={`Input ${activeInput} here`}
              spellCheck="false"
              wrap="off"
              overflow="auto"
              resize="none"
              h="60ch"
              variant="outline"
              bg="white"
              fontSize="sm"
            >
              <Box
                pos="absolute"
                w="calc(100% - 8px)"
                p="0.5rem"
                m={1}
                fontSize="xs"
                bg="whiteAlpha.900"
                bottom={0}
                left={0}
                borderBottomRadius="lg"
                borderTopColor="gray.200"
                borderTopWidth={2}
                borderTopStyle="dashed"
                zIndex={9999}
              >
                Load {activeInput} by dragging & dropping.
                <br />
                <a href="#Input">Supported formats.</a>
              </Box>
            </InputTextarea>
            <Menu fluid className="button-menu" {...inputMenuProps} />
          </GridItem>

          <GridItem className="run">
            <InputParameters loading={isRunning} onClick={this.run} mb="1rem" />

            <Console placeholder="Infomap output will be printed here">{consoleContent}</Console>
            {isRunning && <Progress pos="relative" bottom={0} size="xs" value={progress} />}
            <div>{infomapError}</div>
          </GridItem>

          <GridItem className="output">
            {navigatorLabel}
            <ButtonGroup isAttached w="100%" mb="1rem" isDisabled={isRunning}>
              <Button
                isFullWidth
                colorScheme="blue"
                as="a"
                _hover={{
                  color: "white",
                  bg: "blue.600",
                }}
                target="_blank"
                rel="noopener noreferrer"
                href={`//www.mapequation.org/navigator?infomap=${network.name}.ftree`}
                disabled={!output.ftree}
                borderRightRadius={0}
                size="sm"
              >
                Open in Navigator
              </Button>
              <DownloadMenu disabled={isRunning} />
            </ButtonGroup>

            <FormControl>
              <Textarea
                //readOnly
                onCopy={this.onCopyClusters}
                value={output.activeContent}
                placeholder="Cluster output will be printed here"
                spellCheck="false"
                wrap="off"
                overflow="auto"
                resize="none"
                h="60ch"
                variant="outline"
                bg="white"
                fontSize="sm"
              />
            </FormControl>
            <OutputMenu fluid className="button-menu" {...outputMenuProps} />
          </GridItem>
        </Grid>
      );
    }

    state = {
      infomapOutput: [],
      isLoading: false, // Loading input network
      isRunning: false,
      isCompleted: false,
      infomapError: "",
      progress: 0,
    };
  },
);
