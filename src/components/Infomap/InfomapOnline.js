import React from "react";
import { observer } from "mobx-react"
import { saveAs } from "file-saver";
import localforage from "localforage";
import arg from "arg";
import {
  Button,
  Header,
  Grid,
  Segment,
  Form,
  Message,
  Menu,
  Image,
} from "semantic-ui-react";
import Infomap, { infomapParameters } from "@mapequation/infomap";
import store from "../../store";
import Steps from "./Steps";
import Console from "./Console";
import NavigatorButton from "./NavigatorButton";

const argSpec = getArgSpec();

function getArgSpec() {
  const spec = {};
  infomapParameters.forEach(param => {
    const { short, long, shortType, incremental } = param;
    if (short) {
      spec[short] = long;
    }
    switch (shortType || "") {
      case "f": // float
      case "n": // integer
      case "P": // probability
        spec[long] = Number;
        break;
      case "s": // string
      case "p": // path
      case "o": // option
      case "l": // list
        spec[long] = String;
        break;
      case "": // no argument flag
      default:
        spec[long] = incremental ? arg.COUNT : Boolean;
    }
  });
  return spec;
}

export default observer(class InfomapOnline extends React.Component {
  state = {
    network: store.network,
    args: "--ftree --clu",
    argsError: "",
    output: [],
    name: "network",
    running: false,
    completed: false,
    clu: "",
    tree: "",
    ftree: "",
    activeOutput: "tree",
    downloaded: false,
    loading: false, // True while loading input network
    options: {},
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
    const args = urlParams.get('args');

    if (args) {
      this.onChangeArgs(null, { value: args });
    } else if (this.state.args) {
      this.onChangeArgs(null, { value: this.state.args });
    }
  }

  onChangeNetwork = (event, data) => {
    store.setNetwork(data.value);
    this.setState({
      network: data.value,
      completed: false,
      downloaded: false,
      name: data.name || this.state.name,
      loading: false,
      infomapError: "",
    });
  };

  onLoadNetwork = (event, data) => {
    this.setState({ loading: true });

    const { files } = event.target;
    const file = files[0];

    let name = "";

    if (file && file.name) {
      const nameParts = file.name.split('.');
      if (nameParts.length > 1) nameParts.pop();
      name = nameParts.join('.');
    }

    const reader = new FileReader();

    reader.onloadend = event =>
      this.onChangeNetwork(event, { value: reader.result, name });

    reader.readAsText(file, "utf-8");
  };

  onChangeArgs = (event, data) => {
    const argv = data.value.split(/\s/);
    let argsError = "";
    let options = this.state.options;

    try {
      options = arg(argSpec, { argv, permissive: false });
    } catch (err) {
      argsError = err.message;
    }

    if (!argsError) {
      // TODO: Check if required arguments are valid
    }

    this.setState({ args: data.value, argsError, options });
  };

  run = () => {
    this.setState({ output: [] });

    if (this.runId) {
      this.infomap.cleanup(this.runId);
      this.runId = null;
    }

    try {
      this.runId = this.infomap.run(store.network, this.state.args);
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
    const { clu, ftree, tree } = this.state;

    const styles = {
      segment: { borderRadius: 5, padding: "10px 0 0 0" },
      textArea: { minHeight: 500 }
    };

    const childProps = {
      header: { as: "h2", className: "light" }
    }

    const consoleContent = this.state.output.join("\n");
    const hasInfomapError = !!this.state.infomapError;
    const hasArgsError = !!this.state.argsError;
    const outputValue = this.state[this.state.activeOutput];
    const haveOutput = clu || tree || ftree;

    const outputMenuItems = ["clu", "tree", "ftree"]
      .filter(name => this.state[name])
      .map(name => ({
        key: name,
        name,
        active: this.state.activeOutput === name,
      }));

    const argsFormError = hasArgsError ? {
      content: this.state.argsError,
      pointing: "above"
    } : false;

    return (
      <Grid container stackable>
        <Grid.Column width={16} textAlign="center">
          <Image
            src="https://www.mapequation.org/assets/img/schematic-mapgenerator.svg"
            alt="schematic-mapgenerator"
            centered
            style={{ maxWidth: 900 }}
          />
        </Grid.Column>
        <Grid.Column width={16} textAlign="center">
          <Steps
            firstCompleted={!!store.network}
            firstActive={!store.network}
            secondCompleted={this.state.completed || this.state.running}
            secondActive={store.network && !this.state.completed}
            thirdCompleted={this.state.downloaded}
            thirdActive={this.state.completed}
          />
        </Grid.Column>

        <Grid.Column width={3}>
          <Header {...childProps.header}>Input</Header>
          <Segment
            basic
            style={styles.segment}
            loading={this.state.loading}
          >
            <Form>
              <Form.TextArea
                value={store.network}
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
                content={this.state.infomapError}
              />
            </Form>

            <Form error={hasArgsError}>
              <Form.Group widths="equal">
                <Form.Input
                  placeholder="Optional command line arguments"
                  value={this.state.args}
                  onChange={this.onChangeArgs}
                  error={argsFormError}
                  action={
                    <Form.Button
                      primary
                      disabled={hasArgsError || this.state.running}
                      loading={this.state.running}
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
              content={`Download .${this.state.activeOutput}`}
            />
            <NavigatorButton
              href={`//www.mapequation.org/navigator?infomap=${this.state.name}.ftree`}
              disabled={!this.state.ftree}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
});
