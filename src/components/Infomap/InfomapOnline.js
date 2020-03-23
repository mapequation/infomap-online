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
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";
import Steps from "./Steps";


export default observer(class InfomapOnline extends React.Component {
  state = {
    output: [],
    loading: false, // Loading input network
    running: false,
    completed: false,
    downloaded: false,
    infomapError: "",
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
        running: false,
        completed: !!completed,
      }, () => localforage.setItem("ftree", ftree));
      store.setActiveOutput(clu ? "clu" : tree ? "tree" : "ftree");
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

  onInputChange = (activeInput) => (e, { name, value }) => {
    if (activeInput === "network") {
      store.setNetwork({ name, value });
    } else if (activeInput === "cluster data") {
      const param = store.params.getParam("--cluster-data");
      if (!param) return;
      store.params.setInput(param, value ? name || store.DEFAULT_CLU_NAME : "");
      store.setClusterData({ name, value });
    } else if (activeInput === "meta data") {
      const param = store.params.getParam("--meta-data");
      if (!param) return;
      store.params.setInput(param, value ? name || store.DEFAULT_META_NAME : "");
      store.setMetaData({ name, value });
    }
    this.setState({
      loading: false,
      completed: false,
      downloaded: false,
      infomapError: "",
    });
  };

  onLoad = (activeInput) => (files) => {
    if (files.length < 1) return;

    const file = files[0];

    const reader = new FileReader();

    const onInputChange = this.onInputChange(activeInput);

    reader.onloadend = event => onInputChange(event, { name: file.name, value: reader.result });

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
      clu_states: "",
      tree_states: "",
      ftree_states: "",
      net: "",
      states: "",
      states_as_physical: "",
    });

    if (this.runId) {
      this.infomap.cleanup(this.runId);
      this.runId = null;
    }

    try {
      this.runId = this.infomap.run(store.getNetworkForInfomap(), store.params.args, store.getFilesForInfomap());
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

  onOutputMenuClick = (e, { name }) => store.setActiveOutput(name);

  onDownloadClick = (format) => () => {
    const { name } = store.network;
    const getFilename = (name, format) => {
      if (format === "states_as_physical" || format === "states") {
        return `${name}_${format}.net`;
      }
      if (/_states/.test(format)) {
        return `${name}_states.${format.replace("_states", "")}`;
      }
      return `${name}.${format}`;
    };
    const filename = getFilename(name, format);
    const content = this.state[format];
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
    this.setState({ downloaded: true });
  };

  onDownloadZipClick = (outputOptions) => () => {
    const { name } = store.network;
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
      ftree,
      loading,
      running,
      completed,
      downloaded,
      infomapError,
      output,
    } = this.state;

    const { activeInput, activeOutput, network, clusterData, metaData, params } = store;

    const inputOptions = {
      "network": network,
      "cluster data": clusterData,
      "meta data": metaData,
    };

    const inputAccept = {
      "network": undefined, // FIXME
      "cluster data": params.getParam("--cluster-data").accept,
      "meta data": params.getParam("--meta-data").accept,
    };

    const inputValue = inputOptions[activeInput].value;

    const inputMenuOptions = ["network", "cluster data", "meta data"]
      .map(name => ({
        key: name,
        name,
        active: activeInput === name,
        className: inputOptions[name].value ? "finished" : undefined,
      }));

    const SupportedExtensions = inputAccept[activeInput] ? (
      <span>
        Extensions: {inputAccept[activeInput].map(extension => (
        <a key={extension} href={`#${extension.substring(1)}`}>{extension}</a>
      )).reduce((prev, curr) => [prev, ", ", curr])
      }
      </span>
    ) : null;

    const consoleContent = output.join("\n");
    const hasInfomapError = !!infomapError;

    const outputValue = this.state[activeOutput];

    const outputOptionsPhysical = ["clu", "tree", "ftree", "net", "states_as_physical"]
      .filter(name => this.state[name]);

    const outputOptionsStates = ["clu_states", "tree_states", "ftree_states", "states"]
      .filter(name => this.state[name]);

    const outputOptions = [...outputOptionsPhysical, ...outputOptionsStates];

    const outputMenuItemsPhysical = outputOptionsPhysical
      .map(name => ({ key: name, name, active: activeOutput === name }));

    const outputMenuItemsStates = outputOptionsStates
      .map(name => ({ key: name, name, active: activeOutput === name }));

    const OutputMenu = outputOptionsStates.length === 0 ? (
      <Menu
        vertical
        tabular="right"
        disabled={!completed}
        onItemClick={this.onOutputMenuClick}
        items={outputMenuItemsPhysical}
      />
    ) : (
      <Menu
        vertical
        tabular="right"
        disabled={!completed}
      >
        <Menu.Item>
          <Menu.Header>Physical level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a></Menu.Header>
          <Menu.Menu>
            {outputMenuItemsPhysical.map(item => (
              <Menu.Item
                key={item.key}
                active={item.name === activeOutput}
                name={item.name}
                onClick={this.onOutputMenuClick}
              />
            ))}
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>State level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a></Menu.Header>
          <Menu.Menu>
            {outputMenuItemsStates.map(item => (
              <Menu.Item
                key={item.key}
                active={item.name === activeOutput}
                name={item.name.replace("_states", "")}
                onClick={() => store.setActiveOutput(item.name)}
              />
            ))}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );

    return (
      <Grid container stackable className="infomap">
        <Grid.Column width={16} textAlign="center">
          <Steps
            firstActive={!network.value}
            firstCompleted={!!network.value}
            secondActive={!!network.value && !completed}
            secondCompleted={completed || running}
            thirdActive={completed}
            thirdCompleted={downloaded}
          />
          <div ref={store.refScrollIntoViewOnRunExample}/>
        </Grid.Column>

        <Grid.Column width={4} className="network">
          <LoadButton
            fluid
            primary
            onDrop={this.onLoad(activeInput)}
            accept={inputAccept[activeInput]}
          >
            <Icon name="file"/>Load {activeInput}
          </LoadButton>

          <InputTextarea
            onDrop={this.onLoad(activeInput)}
            accept={inputAccept[activeInput]}
            loading={loading}
            onChange={this.onInputChange(activeInput)}
            value={inputValue}
            placeholder={`Input ${activeInput} here`}
            wrap="off"
          >
            <Message
              attached="bottom"
              size="mini">
              Load {activeInput} by dragging & dropping.<br/>
              <a href="#Input">Supported formats.</a>{" "}
              {SupportedExtensions}
            </Message>
          </InputTextarea>
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
          {completed && !ftree && <Label
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
              href={`//www.mapequation.org/navigator?infomap=${network.name}.ftree`}
              disabled={!ftree || running}
              content="Open in Network Navigator"
            />
            <Dropdown
              disabled={!completed || running}
              className="button icon active"
              trigger={<React.Fragment/>}
            >
              <Dropdown.Menu>
                {outputOptions.map((format, key) =>
                  <Dropdown.Item
                    key={key}
                    icon="download"
                    onClick={this.onDownloadClick(format)}
                    content={`Download ${format}`}
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
          {OutputMenu}
        </Grid.Column>
      </Grid>
    );
  }
});
