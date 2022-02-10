import { Button, ButtonGroup, Grid, GridItem } from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import { Step, Steps } from "chakra-ui-steps";
import localforage from "localforage";
import { observer } from "mobx-react";
import { Component } from "react";
import { Form, Label, Menu, Message, Rail } from "semantic-ui-react";
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
          loading: false,
          completed: false,
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

      this.setState({ loading: true }, () => reader.readAsText(file, "utf-8"));
    };
    run = () => {
      store.output.resetContent();

      this.setState({
        completed: false,
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
          running: false,
          infomapError: e.message,
        });
        return;
      }

      this.setState({
        running: true,
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
          running: false,
          completed: false,
        });

      const onFinished = async (content) => {
        store.output.setContent(content);
        await localforage.setItem("ftree", store.output.ftree);
        this.setState({
          running: false,
          completed: true,
        });
      };

      this.infomap = new Infomap()
        .on("data", onData)
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
      const { loading, running, completed, infomapError, infomapOutput } = this.state;

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

      const SupportedExtensions = inputAccept[activeInput] ? (
        <span>
          Extensions:{" "}
          {inputAccept[activeInput]
            .map((extension) => (
              <a key={extension} href={`#${extension.substring(1)}`}>
                {extension}
              </a>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
        </span>
      ) : null;

      const consoleContent = infomapOutput.join("\n");
      const hasInfomapError = !!infomapError;

      const inputMenuProps = {
        vertical: true,
        size: "small",
        onItemClick: this.onInputMenuClick,
        items: inputMenuOptions,
      };

      const outputMenuProps = { vertical: true, disabled: !completed };

      let navigatorLabel = null;

      if (completed && !hasInfomapError) {
        if (!output.ftree) {
          navigatorLabel = (
            <Label basic size="small" pointing="below">
              Network Navigator requires ftree output.{" "}
              {!params.getParam("--ftree").active && (
                <a onClick={() => params.setArgs(params.args + " --ftree")}>Enable.</a>
              )}
            </Label>
          );
          // } else if (output.ftree) {
          //   navigatorLabel = (
          //     <Label basic size="small" pointing="below">
          //       Could not store network. Please download ftree and load manually.
          //     </Label>
          //   );
        }
      }

      let activeStep = 0;
      if (!!network.value) {
        activeStep = 1;
        if (completed || running) {
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
            <LoadButton onDrop={this.onLoad(activeInput)} accept={inputAccept[activeInput]}>
              Load {activeInput}
            </LoadButton>

            <InputTextarea
              onDrop={this.onLoad(activeInput)}
              accept={inputAccept[activeInput]}
              loading={loading}
              onChange={this.onInputChange(activeInput)}
              value={inputValue}
              placeholder={`Input ${activeInput} here`}
            />
            <Message attached="bottom" size="mini">
              Load {activeInput} by dragging & dropping.
              <br />
              <a href="#Input">Supported formats.</a> {SupportedExtensions}
            </Message>
            <Menu fluid className="button-menu" {...inputMenuProps} />
          </GridItem>

          <GridItem className="run">
            <InputParameters loading={running} onClick={this.run} />

            <Form error={hasInfomapError}>
              <Console
                content={consoleContent}
                placeholder="Infomap output will be printed here"
                attached={hasInfomapError ? "top" : false}
              />
              <Message error size="tiny" attached="bottom" content={infomapError} />
            </Form>
          </GridItem>

          <GridItem className="output">
            {navigatorLabel}
            <ButtonGroup isAttached>
              <Button
                colorScheme="blue"
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`//www.mapequation.org/navigator?infomap=${network.name}.ftree`}
                disabled={!output.ftree || running}
                borderRightRadius={0}
                //className="navigator-button"
              >
                Open in Network Navigator
              </Button>
              <DownloadMenu disabled={running} />
            </ButtonGroup>

            <Form loading={running}>
              <Form.TextArea
                value={output.activeContent}
                placeholder="Cluster output will be printed here"
                onCopy={this.onCopyClusters}
                wrap="off"
              />
            </Form>
            <OutputMenu fluid className="button-menu" {...outputMenuProps} />
          </GridItem>
        </Grid>
      );
    }

    state = {
      infomapOutput: [],
      loading: false, // Loading input network
      running: false,
      completed: false,
      infomapError: "",
    };
  },
);
