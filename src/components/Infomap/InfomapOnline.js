import Infomap from "@mapequation/infomap";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import localforage from "localforage";
import { observer } from "mobx-react";
import React from "react";
import { Button, Dropdown, Form, Grid, Icon, Label, Menu, Message } from "semantic-ui-react";
import store from "../../store";
import Console from "./Console";
import InputParameters from "./InputParameters";
import Steps from "./Steps";


export default observer(class InfomapOnline extends React.Component {
  state = {
    name: "network",
    output: [],
    clu: "",
    tree: "",
    ftree: "",
    loading: false, // True while loading input network
    running: false,
    completed: false,
    downloaded: false,
    activeInput: "network", // Current input tab
    activeOutput: "tree", // Current output tab
    infomapError: "",
    clusterData: "",
    metaData: "",
  };

  constructor(props) {
    super(props);

    const onData = content => this.setState({
      output: [...this.state.output, content],
    });

    const onError = content => this.setState({
      infomapError: content.replace(/^Error:\s+/i, ""),
      output: [...this.state.output, content],
      running: false,
      completed: false,
    });

    const onFinished = content => {
      const { clu, tree, ftree, clu_states, tree_states, ftree_states, net, states, states_as_physical } = content;
      const completed = clu || tree || ftree || net || states || clu_states || tree_states || ftree_states || states_as_physical;
      this.setState({
        ...content,
        activeOutput: clu ? "clu" : tree ? "tree" : "ftree",
        running: false,
        completed: !!completed,
      }, () => localforage.setItem("ftree", ftree));
    };

    this.infomap = new Infomap()
      .on("data", onData)
      .on("error", onError)
      .on("finished", onFinished);
  }

  componentDidMount = () => {
    localforage.config({ name: "infomap" });

    const urlSearchParams = URLSearchParams || window.URLSearchParams;
    const urlParams = new urlSearchParams(window.location.search);
    const args = urlParams.get("args");

    if (args) {
      store.params.setArgs(args);
    } else {
      store.params.setArgs("--clu --ftree");
    }
  };

  onChangeNetwork = (event, { value, name }) => {
    if (value === "") name = "network";
    store.setNetwork(value);
    this.setState(prev => ({
      name: name || prev.name,
      loading: false,
      completed: false,
      downloaded: false,
      infomapError: "",
    }));
  };

  onLoad = (activeInput) => (files) => {
    if (files.length < 1) return;

    const file = files[0];

    let name = "";

    if (file && file.name) {
      const nameParts = file.name.split(".");
      if (nameParts.length > 1) nameParts.pop();
      name = nameParts.join(".");
    }

    const reader = new FileReader();

    reader.onloadend = event => {
      if (activeInput === "network")
        return this.onChangeNetwork(event, { value: reader.result, name });
      if (activeInput === "clusterData")
        return;
      if (activeInput === "metaData")
        return;
    };

    this.setState({ loading: true },
      () => reader.readAsText(file, "utf-8"));
  };

  run = () => {
    this.setState({
      completed: false,
      downloaded: false,
      output: [],
      clu: "",
      tree: "",
      ftree: "",
    });

    if (this.runId) {
      this.infomap.cleanup(this.runId);
      this.runId = null;
    }

    try {
      this.runId = this.infomap.run(store.network, store.params.args);
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

  onInputMenuClick = (e, { name }) => this.setState({ activeInput: name });

  onOutputMenuClick = (e, { name }) => this.setState({ activeOutput: name });

  onDownloadClick = (format) => () => {
    const { name } = this.state;
    const content = this.state[format];
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${name}.${format}`);
    this.setState({ downloaded: true });
  };

  onDownloadZipClick = (outputOptions) => () => {
    const { name } = this.state;
    const zip = new JSZip();
    for (let format of outputOptions) {
      const content = this.state[format];
      zip.file(`${name}.${format}`, content);
    }
    zip.generateAsync({ type: "blob" })
      .then(blob => saveAs(blob, `${name}.zip`));
  };

  onCopyClusters = () => this.setState({ downloaded: true });

  render() {
    const {
      name,
      clu,
      tree,
      ftree,
      loading,
      running,
      completed,
      downloaded,
      infomapError,
      activeInput,
      activeOutput,
      output,
    } = this.state;

    const { network, params } = store;

    const inputOptions = {
      network,
      "cluster": this.state.clusterData,
      "meta data": this.state.metaData,
    };

    const inputValue = inputOptions[activeInput];

    const inputMenuOptions = ["network", "cluster", "meta data"]
      .map(name => ({
        key: name,
        name,
        active: activeInput === name,
        className: inputOptions[name] ? "finished" : undefined,
      }));

    const consoleContent = output.join("\n");
    const hasInfomapError = !!infomapError;

    const outputValue = this.state[activeOutput];

    const haveOutput = clu || tree || ftree;

    const outputOptions = ["clu", "tree", "ftree"]
      .filter(name => this.state[name]);

    const outputMenuItems = outputOptions
      .map(name => ({ key: name, name, active: activeOutput === name }));

    return (
      <Grid container stackable className="infomap">
        <Grid.Column width={16} textAlign="center">
          <Steps
            firstCompleted={!!network}
            firstActive={!network}
            secondCompleted={completed || running}
            secondActive={!!network && !completed}
            thirdCompleted={downloaded}
            thirdActive={completed}
          />
        </Grid.Column>

        <Grid.Column width={4} className="network">
          <Button fluid primary>
            <Icon name="file"/>Load {activeInput}
            <input style={{ display: "none" }}/>
          </Button>

          <Form loading={loading}>
            <Form.TextArea
              value={inputValue}
              onChange={this.onChangeNetwork}
              placeholder={`Input ${activeInput} here`}
              wrap="off"
            />
            <Message
              attached="bottom"
              size="mini"
              content={`Load ${activeInput} by dragging & dropping`}
            />
          </Form>
          <Menu
            vertical
            tabular
            className="left"
            size="small"
            onItemClick={this.onInputMenuClick}
            items={inputMenuOptions}
          />
        </Grid.Column>

        <Grid.Column width={8} floated="left" className="run">
          <InputParameters loading={running} onClick={this.run}/>

          <Form error={hasInfomapError}>
            <Console
              content={consoleContent}
              placeholder="Infomap output will be printed here"
              attached={hasInfomapError ? "top" : false}
            />
            <Message
              error
              size="tiny"
              attached="bottom"
              content={infomapError}
            />
          </Form>
        </Grid.Column>

        <Grid.Column width={4} className="output">
          {completed && !ftree &&  <Label
            basic
            size="small"
            pointing="below"
          >
            Network Navigator requires ftree output.{" "}
            {!params.getParam("--ftree").active &&
            <a onClick={() => params.setArgs(params.args + " --ftree")}>
              Enable.
            </a>}
          </Label>}
          <Button.Group primary fluid>
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`//www.mapequation.org/navigator?infomap=${name}.ftree`}
              disabled={!ftree || running}
              content="Open in Network Navigator"
            />
            <Dropdown
              disabled={!haveOutput || running}
              className="button icon active"
              trigger={<React.Fragment/>}
            >
              <Dropdown.Menu>
                {outputOptions.map((format, key) =>
                  <Dropdown.Item
                    key={key}
                    icon="download"
                    onClick={this.onDownloadClick(format)}
                    content={`Download .${format}`}
                  />,
                )}
                {outputOptions.length > 1 &&
                <Dropdown.Item
                  icon="download"
                  onClick={this.onDownloadZipClick(outputOptions)}
                  content="Download all"
                />}
              </Dropdown.Menu>
            </Dropdown>
          </Button.Group>

          <Form loading={running}>
            <Form.TextArea
              value={outputValue}
              placeholder="Cluster output will be printed here"
              onCopy={this.onCopyClusters}
              wrap="off"
            />
          </Form>
          <Menu
            vertical
            tabular="right"
            size="small"
            disabled={!haveOutput}
            onItemClick={this.onOutputMenuClick}
            items={outputMenuItems}
          >
          </Menu>
        </Grid.Column>
      </Grid>
    );
  }
});
