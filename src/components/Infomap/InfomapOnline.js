import Infomap from "@mapequation/infomap";
import { saveAs } from "file-saver";
import localforage from "localforage";
import { observer } from "mobx-react";
import React from "react";
import { Button, Dropdown, Form, Grid, Icon, Label, Menu, Message, Segment } from "semantic-ui-react";
import store from "../../store";
import Console from "./Console";
import Steps from "./Steps";
import InputParameters from "./InputParameters";


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
    activeOutput: "tree", // Current output tab
    infomapError: "",
  };

  constructor(props) {
    super(props);

    const onData = content => this.setState({
      output: [...this.state.output, content],
    });

    const onError = content => this.setState({
      infomapError: content,
      output: [...this.state.output, content],
      running: false,
      completed: false,
    });

    const onFinished = ({ clu, tree, ftree }) => this.setState({
      clu,
      tree,
      ftree,
      activeOutput: clu ? "clu" : tree ? "tree" : "ftree",
      running: false,
      completed: clu || tree || ftree,
    }, () => localforage.setItem("ftree", ftree));

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
      store.setArgs(args);
    }
  };

  onChangeNetwork = (event, { value, name }) => {
    store.setNetwork(value);
    this.setState(prev => ({
      name: name || prev.name,
      loading: false,
      completed: false,
      downloaded: false,
      infomapError: "",
    }));
  };

  onLoadNetwork = (event) => {
    this.setState({ loading: true });

    const { files } = event.target;
    const file = files[0];

    let name = "";

    if (file && file.name) {
      const nameParts = file.name.split(".");
      if (nameParts.length > 1) nameParts.pop();
      name = nameParts.join(".");
    }

    const reader = new FileReader();

    reader.onloadend = event =>
      this.onChangeNetwork(event, { value: reader.result, name });

    reader.readAsText(file, "utf-8");
  };

  run = () => {
    this.setState({
      completed: false,
      downloaded: false,
      output: [],
    });

    if (this.runId) {
      this.infomap.cleanup(this.runId);
      this.runId = null;
    }

    try {
      this.runId = this.infomap.run(store.network, store.args);
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

  onOutputMenuClick = (e, { name }) => this.setState({ activeOutput: name });

  onDownloadClick = (format) => () => {
    const { name } = this.state;
    const output = this.state[format];
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${name}.${format}`);
    this.setState({ downloaded: true });
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
      activeOutput,
      output,
    } = this.state;

    const { network } = store;

    const consoleContent = output.join("\n");
    const hasInfomapError = !!infomapError;
    const outputValue = this.state[activeOutput];
    const haveOutput = clu || tree || ftree;

    let outputOptions = ["clu", "tree", "ftree"]
      .filter(name => this.state[name]);

    const outputMenuItems = outputOptions
      .map(name => ({
        key: name,
        name,
        active: activeOutput === name,
      }));

    return (
      <Grid container stackable className="infomap">
        <Grid.Column width={16} textAlign="center">
          <Steps
            firstCompleted={!!network}
            firstActive={!network}
            secondCompleted={completed || running}
            secondActive={network && !completed}
            thirdCompleted={downloaded}
            thirdActive={completed}
          />
        </Grid.Column>

        <Grid.Column width={3}>
          <Button
            as="label"
            fluid
            primary
            htmlFor="fileInput"
            className="topButton"
          >
            <Icon name="file"/>
            Load network
            <input
              style={{ display: "none" }}
              type="file"
              id="fileInput"
              onChange={this.onLoadNetwork}
            />
          </Button>
          <Form loading={loading}>
            <Form.TextArea
              value={network}
              onChange={this.onChangeNetwork}
              placeholder="# Paste your network here"
              className="network"
            />
          </Form>
        </Grid.Column>

        <Grid.Column width={9} floated="left">
          <InputParameters loading={running} onClick={this.run}/>

          <Form error={hasInfomapError}>
            <Console
              content={consoleContent}
              placeholder="Infomap output will be printed here"
              attached={hasInfomapError ? "top" : false}
            />
            <Message
              error
              attached="bottom"
              content={infomapError}
            />
          </Form>
        </Grid.Column>

        <Grid.Column width={4}>
          {completed && !ftree && <Label
            basic
            size="small"
            pointing="below"
            content="Network Navigator requires ftree output"
          />}
          <Button.Group primary fluid>
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`//www.mapequation.org/navigator?infomap=${name}.ftree`}
              disabled={!ftree || running}
              className="topButton"
              content="Open in Network Navigator"
            />
            <Dropdown
              disabled={!haveOutput || running}
              className="button icon active topDropdown"
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
              </Dropdown.Menu>
            </Dropdown>
          </Button.Group>

          <Form loading={running}>
            <Menu
              pointing
              borderless
              size="small"
              attached="top"
              disabled={!haveOutput}
              onItemClick={this.onOutputMenuClick}
              items={outputMenuItems}
            />
            <Segment attached basic className="output">
              <Form.TextArea
                value={outputValue}
                placeholder="Infomap cluster output will be printed here"
                onCopy={this.onCopyClusters}
              />
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
});
