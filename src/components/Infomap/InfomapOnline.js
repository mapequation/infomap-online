import React from "react";
import { observer } from "mobx-react"
import localforage from "localforage";
import {
  Button,
  Step,
  Header,
  Grid,
  Segment,
  Form,
  Checkbox,
  Message,
  Menu,
  Image,
  Item,
  Table,
} from "semantic-ui-react";
import { saveAs } from "file-saver";
import arg from "arg";
import produce from "immer";
import Console from "./Console";
import Infomap,  { infomapParameters } from "@mapequation/infomap";
import store from "../../store";


console.log(infomapParameters)
export const SAMPLE_NETWORK = `#source target [weight]
1 2
1 3
1 4
2 1
2 3
3 2
3 1
4 1
4 5
4 6
5 4
5 6
6 5
6 4`;

// const argValidator = infomapParameters
//   .map(({ long, required, longType, description }) => {
//     const param = {
//       long,
//       required,
//       longType,
//     };
//     if (longType === 'list' || longType === 'option') {
//       param.options = description.match(/Options: (.*)\.$/)[1].split(', ')
//     }
//     switch (longType) {
//       case 'integer':
//         param.validate = (arg) => 
//     }
//   })
//   .reduce((validator, param) => {
//     validator[param.long] = param;
//     return validator;
//   }, {});

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

const getShortOptionIfExist = longOpt => {
  const opt = infomapParameters.find(opt => opt.long === longOpt);
  return opt.short || opt.long;
};

export default observer(class InfomapOnline extends React.Component {
  state = {
    network: SAMPLE_NETWORK,
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

    this.infomap = new Infomap()
      .on("data", this.onInfomapData)
      .on("error", this.onInfomapError)
      .on("finished", this.onInfomapFinished)
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

    let name = null;

    if (file && file.name) {
      const nameParts = file.name.split('.');
      if (nameParts.length > 1)
        nameParts.pop();
      name = nameParts.join('.');
    }

    const reader = new FileReader();
    reader.onloadend = event => {
      this.onChangeNetwork(event, { value: reader.result, name });
    };
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

  onChangeOption = (event, data) => {
    const { id: longOption, checked: value } = data;
    // Update options object
    const nextState = produce(this.state, draft => {
      if (!value) {
        delete draft.options[longOption];
      } else {
        draft.options[longOption] = value;
      }
    });

    // Regenerate args string from options
    let argv = [];
    const { options } = nextState;
    for (let key in options) {
      if (key === "_") continue;
      // Use long options if already exist, else short option
      if (this.state.args.includes(key)) {
        argv.push(key);
      } else {
        argv.push(getShortOptionIfExist(key));
      }
      // Add argument for non-flag options
      if (typeof options[key] !== "boolean") {
        argv.push(options[key]);
      }
    }
    const args = argv.join(" ");

    this.setState({ options, args, argsError: "" });
  };

  onClickRun = () => {
    this.run();
  };

  onClickCancelRun = () => {
    this.clearInfomap(false);
  };

  onClickClearConsole = () => {
    this.setState({ output: [] });
  };

  clearInfomap = (clearOutput = true) => {
    if (this.worker && this.worker.terminate) {
      this.worker.terminate();
      delete this.worker;
    }
    this.setState({
      output: clearOutput ? [] : this.state.output,
      running: false,
    });
  };

  run = () => {
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

  onInfomapData = content => {
    this.setState({
      output: [...this.state.output, content],
    });
  }

  onInfomapError = content => {
    this.setState({
      infomapError: content,
      output: [...this.state.output, content],
      running: false,
    });
  }

  onInfomapFinished = content => {
    const { clu, tree, ftree } = content;
    this.store(ftree);
    this.setState({
      clu,
      tree,
      ftree,
      activeOutput: clu ? "clu" : tree ? "tree" : "ftree",
      running: false,
      completed: true,
    });
  }

  store = async ftree => {
    await localforage.setItem("ftree", ftree);
  };

  haveOutput = () => {
    const { clu, tree, ftree } = this.state;
    return clu || tree || ftree;
  };

  getOutputMenuItems = () => {
    const items = [];
    for (let name of ["clu", "tree", "ftree"]) {
      if (this.state[name]) {
        items.push({
          key: name,
          name,
          active: this.state.activeOutput === name,
        });
      }
    }
    return items;
  };

  onOutputMenuClick = (e, { name }) => {
    this.setState({ activeOutput: name });
  };

  onClickDownloadOutput = () => {
    const { activeOutput } = this.state;
    const output = this.state[activeOutput];
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${this.state.name}.${activeOutput}`);
    this.setState({ downloaded: true });
  };

  onCopyClusters = () => {
    this.setState({ downloaded: true });
  };

  render() {
    const { options } = this.state;
    return (
      <Grid container>
        <Grid.Column width={16} textAlign="center">
          <Image
            src="https://www.mapequation.org/assets/img/schematic-mapgenerator.svg"
            alt="schematic-mapgenerator"
            centered
            style={{ maxWidth: 900 }}
          />
        </Grid.Column>
        <Grid.Column width={16} textAlign="center">
          <Step.Group ordered>
            <Step completed={!!store.network} active={!store.network}>
              <Step.Content>
                <Step.Title>Load network</Step.Title>
                <Step.Description>
                  Edit input field or upload file
                </Step.Description>
              </Step.Content>
            </Step>

            <Step
              completed={this.state.completed || this.state.running}
              active={store.network && !this.state.completed}
            >
              <Step.Content>
                <Step.Title>Run Infomap</Step.Title>
                <Step.Description>
                  Toggle options or add command line arguments
                </Step.Description>
              </Step.Content>
            </Step>

            <Step
              completed={this.state.downloaded}
              active={this.state.completed}
            >
              <Step.Content>
                <Step.Title>Explore map!</Step.Title>
                <Step.Description>
                  Save result or open in{" "}
                  <span className="brand brand-nn">Network Navigator</span>
                </Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </Grid.Column>

        <Grid.Column width={3} style={{ minHeight: 500 }}>
          <Header as="h2" className="light">Input</Header>
          <Segment
            basic
            style={{ borderRadius: 5, padding: "10px 0 0 0" }}
            loading={this.state.loading}
            color="red"
          >
            <Form>
              <Form.TextArea
                value={store.network}
                onChange={this.onChangeNetwork}
                placeholder="# Paste your network here"
                style={{ minHeight: 500 }}
              />
              <Button as="label" htmlFor="fileInput">
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
          <Header as="h2" className="light">Infomap</Header>
          <Segment
            basic
            style={{ borderRadius: 5, padding: "10px 0 0 0" }}
            color="red"
          >
            <Table basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Item.Group>
                      <Item>
                        <Item.Content>
                          <Item.Header as="h4" className="ui">
                            -2, --two-level
                          </Item.Header>
                          <Item.Meta>
                            Optimize for a two-level instead of a multi-level
                            solution
                          </Item.Meta>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Checkbox
                      toggle
                      id="--two-level"
                      checked={!!options["--two-level"]}
                      onChange={this.onChangeOption}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Item.Group>
                      <Item>
                        <Item.Content>
                          <Item.Header as="h4" className="ui">
                            --directed
                          </Item.Header>
                          <Item.Meta>
                            Treat links as directed (default: undirected)
                          </Item.Meta>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Checkbox
                      toggle
                      id="--directed"
                      checked={!!options["--directed"]}
                      onChange={this.onChangeOption}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Item.Group>
                      <Item>
                        <Item.Content>
                          <Item.Header as="h4" className="ui">
                            --ftree
                          </Item.Header>
                          <Item.Meta>
                            Write a ftree file with the modular hierarchy including aggregated links between (nested) modules.
                            (Used by Network Navigator)
                          </Item.Meta>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Checkbox
                      toggle
                      id="--ftree"
                      checked={!!options["--ftree"]}
                      onChange={this.onChangeOption}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Item.Group>
                      <Item>
                        <Item.Content>
                          <Item.Header as="h4" className="ui">
                            --clu
                          </Item.Header>
                          <Item.Meta>
                            Write a clu file with the top cluster ids for each node.
                          </Item.Meta>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Checkbox
                      toggle
                      id="--clu"
                      checked={!!options["--clu"]}
                      onChange={this.onChangeOption}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <div style={{ marginTop: -20, marginBottom: 10 }}>
              <a href="#Parameters">More parameters</a>
            </div>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  placeholder="Optional command line arguments"
                  value={this.state.args}
                  onChange={this.onChangeArgs}
                  action={
                    <Form.Button
                      primary
                      disabled={!!this.state.argsError || this.state.running}
                      loading={this.state.running}
                      onClick={this.onClickRun}
                    >
                      Run
                    </Form.Button>
                  }
                />
              </Form.Group>
              <div
                style={{
                  display: "contents",
                  position: "relative",
                  margin: "-8px 15px 35px",
                }}
              >
                <Header
                  color="red"
                  content={this.state.argsError}
                  style={{
                    position: "absolute",
                    fontSize: "1rem",
                    fontWeight: 300,
                  }}
                />
              </div>
            </Form>
            <Form error={!!this.state.infomapError}>
              <Form.Group
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Form.Button style={{ visibility: "hidden" }}>
                  Hidden
                </Form.Button>
                {this.state.running ? (
                  <Form.Button secondary onClick={this.onClickCancelRun}>
                    Cancel
                  </Form.Button>
                ) : null}
              </Form.Group>
              <Console
                value={this.state.output.join("\n")}
                placeholder="Infomap command line output will be printed here"
                style={{ minHeight: 400 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                {this.state.output.length !== 0 ? (
                  <Form.Button onClick={this.onClickClearConsole}>
                    Clear
                  </Form.Button>
                ) : null}
              </div>
              <Message
                error
                header="Infomap error"
                content={this.state.infomapError}
              />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h2" className="light">Output</Header>
          <Segment
            basic
            style={{ borderRadius: 5, padding: "10px 0 0 0" }}
            color="red"
          >
            <Form>
              <Segment attached basic style={{ padding: 0 }}>
                <Form.TextArea
                  value={this.state[this.state.activeOutput]}
                  placeholder="Infomap cluster output will be printed here"
                  style={{ minHeight: 500 }}
                  onCopy={this.onCopyClusters}
                />
              </Segment>
              {this.haveOutput() ? (
                <React.Fragment>
                  <Menu
                    attached="bottom"
                    onItemClick={this.onOutputMenuClick}
                    items={this.getOutputMenuItems()}
                  />
                  <Form.Button
                    onClick={this.onClickDownloadOutput}
                  >{`Download .${this.state.activeOutput} file`}</Form.Button>
                </React.Fragment>
              ) : null}
            </Form>
            <Button
              disabled={!this.state.ftree}
              as="a"
              href={`//www.mapequation.org/navigator?infomap=${this.state.name}.ftree`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: 10, marginTop: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 300, marginBottom: 5 }}>
                  Explore in
                </div>
                <Image
                  size="tiny"
                  src="https://www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                />
                <div
                  className="brand"
                  style={{ fontSize: 18, lineHeight: 1.1, marginTop: 5 }}
                >
                  <span className="brand-infomap">Infomap</span>{" "}
                  <span className="brand-nn">Network Navigator</span>
                </div>
              </div>
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
});
