import Infomap from "@mapequation/infomap";
import { saveAs } from "file-saver";
import localforage from "localforage";
import { observer } from "mobx-react";
import React from "react";
import { Button, Dropdown, Form, Grid, Icon, Menu, Message, Popup, Segment } from "semantic-ui-react";
import store from "../../store";
import Console from "./Console";
import Steps from "./Steps";


export default observer(class InfomapOnline extends React.Component {
  state = {
    name: "network",
    output: [],
    clu: "",
    tree: "",
    ftree: "",
    running: false,
    completed: false,
    loading: false, // True while loading input network
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
    });

    const onFinished = ({ clu, tree, ftree }) => this.setState({
      clu,
      tree,
      ftree,
      activeOutput: clu ? "clu" : tree ? "tree" : "ftree",
      running: false,
      completed: true,
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
      this.onChangeArgs(null, { value: args });
    }
  };

  onChangeNetwork = (event, { value, name }) => {
    store.setNetwork(value);
    this.setState(prev => ({
      name: name || prev.name,
      completed: false,
      downloaded: false,
      loading: false,
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

  onChangeArgs = (event, { value }) => store.setArgs(value);

  run = () => {
    this.setState({ output: [] });

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
      ftree,
      tree,
      completed,
      running,
      loading,
      downloaded,
      infomapError,
      activeOutput,
      output,
    } = this.state;

    const { args, argsError, network } = store;

    const styles = {
      segment: { borderRadius: 5, padding: "10px 0 0 0" },
      textArea: { minHeight: 500, resize: "none" },
      button: { marginBottom: "1em" },
      dropdown: { marginBottom: "1em", textAlign: "center" },
      formGroup: { marginBottom: "calc(1em - 2px)" },
      attachedSegment: { padding: 0, border: "none" },
      attachedTextArea: {
        resize: "none",
        height: "calc(500px - 37.15px)",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTop: 0,
      },
      runButton: {
        marginRight: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      popup: {
        boxShadow: "none",
        color: "#9f3a38",
        lineHeight: 1,
        padding: "0.5em 0.8em 0.7em calc(0.3em - 10px)",
        marginBottom: "-0.5em",
        fontSize: ".85714286rem",
        fontWeight: 700,
      },
    };

    const consoleContent = output.join("\n");
    const hasInfomapError = !!infomapError;
    const hasArgsError = !!argsError;
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
      <Grid container stackable>
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
          <Segment basic style={styles.segment}>
            <Button
              as="label"
              fluid
              primary
              htmlFor="fileInput"
              style={styles.button}
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
                style={styles.textArea}
              />
            </Form>
          </Segment>
        </Grid.Column>

        <Grid.Column width={9} floated="left">
          <Segment basic style={styles.segment}>
            <Form>
              <Popup
                flowing
                position="top left"
                style={styles.popup}
                open={hasArgsError}
                content={argsError}
                trigger={<span/>}
              />
              <Form.Group widths="equal" style={styles.formGroup}>
                <Form.Input
                  placeholder="Parameters"
                  value={args}
                  onChange={this.onChangeArgs}
                  action={<Form.Button
                    primary
                    style={styles.runButton}
                    disabled={hasArgsError || running}
                    loading={running}
                    onClick={this.run}
                    content="Run Infomap"
                  />
                  }
                />
              </Form.Group>
            </Form>

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
          </Segment>
        </Grid.Column>

        <Grid.Column width={4}>
          <Segment basic style={styles.segment}>
            <Button.Group primary fluid>
              <Button
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`//www.mapequation.org/navigator?infomap=${name}.ftree`}
                disabled={!ftree || running}
                style={styles.button}
                content="Open in Network Navigator"
              />
              <Dropdown
                disabled={!haveOutput || running}
                style={styles.dropdown}
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
              <Segment attached basic style={styles.attachedSegment}>
                <Form.TextArea
                  value={outputValue}
                  placeholder="Infomap cluster output will be printed here"
                  style={styles.attachedTextArea}
                  onCopy={this.onCopyClusters}
                />
              </Segment>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
});
