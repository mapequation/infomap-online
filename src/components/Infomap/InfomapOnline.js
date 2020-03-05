import React from "react";
import { observer } from "mobx-react";
import { saveAs } from "file-saver";
import localforage from "localforage";
import {
  Button,
  Header,
  Grid,
  Segment,
  Form,
  Message,
  Menu,
} from "semantic-ui-react";
import Infomap from "@mapequation/infomap";
import store from "../../store";
import Steps from "./Steps";
import Console from "./Console";
import NavigatorButton from "./NavigatorButton";


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
      output: [...this.state.output, content]
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
        infomapError: e.message
      });
      return;
    }

    this.setState({
      running: true,
      infomapError: "",
    });
  };

  onOutputMenuClick = (e, { name }) => this.setState({ activeOutput: name });

  onDownloadOutputClick = () => {
    const { activeOutput } = this.state;
    const output = this.state[activeOutput];
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${this.state.name}.${activeOutput}`);
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
      output
    } = this.state;

    const { args, argsError, network } = store;

    const styles = {
      segment: { borderRadius: 5, padding: "10px 0 0 0" },
      textArea: { minHeight: 500 }
    };

    const childProps = {
      header: { as: "h2", className: "light" }
    };

    const consoleContent = output.join("\n");
    const hasInfomapError = !!infomapError;
    const hasArgsError = !!argsError;
    const outputValue = this.state[activeOutput];
    const haveOutput = clu || tree || ftree;

    const outputMenuItems = ["clu", "tree", "ftree"]
      .filter(name => this.state[name])
      .map(name => ({
        key: name,
        name,
        active: activeOutput === name,
      }));

    const argsFormError = hasArgsError ? {
      content: argsError,
      pointing: "above"
    } : false;

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
          <Header {...childProps.header}>Input</Header>
          <Segment
            basic
            style={styles.segment}
            loading={loading}
          >
            <Form>
              <Form.TextArea
                value={network}
                onChange={this.onChangeNetwork}
                placeholder="# Paste your network here"
                style={styles.textArea}
              />
              <Button as="label" fluid htmlFor="fileInput">
                Load from file...
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="fileInput"
                  onChange={this.onLoadNetwork}
                />
              </Button>
            </Form>
          </Segment>
        </Grid.Column>

        <Grid.Column width={9} floated="left">
          <Header {...childProps.header}>Infomap</Header>
          <Segment basic style={styles.segment}>
            <Form error={hasInfomapError}>
              <Console
                content={consoleContent}
                placeholder="Infomap command line output will be printed here"
              />
              <Message
                error
                header="Infomap error"
                content={infomapError}
              />
            </Form>

            <Form error={hasArgsError}>
              <Form.Group widths="equal">
                <Form.Input
                  placeholder="Optional command line arguments"
                  value={args}
                  onChange={this.onChangeArgs}
                  error={argsFormError}
                  action={
                    <Form.Button
                      primary
                      disabled={hasArgsError || running}
                      loading={running}
                      onClick={this.run}
                      content="Run"
                    />
                  }
                />
              </Form.Group>
            </Form>
          </Segment>
        </Grid.Column>

        <Grid.Column width={4}>
          <Header {...childProps.header}>Output</Header>
          <Segment basic style={styles.segment}>
            <Form style={{ marginBottom: "14px" }}>
              <Segment attached basic style={{ padding: 0, border: "none" }}>
                <Form.TextArea
                  value={outputValue}
                  placeholder="Infomap cluster output will be printed here"
                  style={{ height: "461px" }}
                  onCopy={this.onCopyClusters}
                />
              </Segment>
              <Menu
                attached="bottom"
                disabled={!haveOutput}
                onItemClick={this.onOutputMenuClick}
                items={outputMenuItems}
              />
            </Form>
            <Button
              disabled={!haveOutput}
              onClick={this.onDownloadOutputClick}
              content={`Download .${activeOutput}`}
            />
            <NavigatorButton
              href={`//www.mapequation.org/navigator?infomap=${name}.ftree`}
              disabled={!ftree}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
});
