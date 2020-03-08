import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Checkbox, Dropdown, Input, Item } from "semantic-ui-react";
import { Heading } from "./TOC";
import store from "../../store";


const DropdownParameter = observer(({ param }) => {
  const options = param.options.map((value, key) => ({
      key,
      text: value,
      value
    }));

  return (
    <Dropdown
      selection
      options={options}
      multiple={param.longType === "list"}
      placeholder={param.longType}
      clearable={param.default === ""}
      value={param.value}
      onChange={(e, { value }) => store.setOption(param, value)}
    />
  );
});

const InputParameter = observer(({ param }) => {
  return (
    <Input
      style={{ width: "100px" }}
      placeholder={param.default}
      value={param.value}
      onChange={(e, { value }) => store.setInput(param, value)}
    />
  );
});

const FileInputParameter = observer(({ param }) => {
  return (
    <Button basic as="label" htmlFor="fileInput">
      Load file
      <input
        style={{ display: "none" }}
        type="file"
        id="fileInput"
      />
    </Button>
  );
});

const ToggleParameter = observer(({ param }) => {
  return (
    <Checkbox
      toggle
      checked={param.active}
      onChange={() => store.toggle(param)}
    />
  );
});

const IncrementalParameter = observer(({ param }) => {
  const { value, maxValue, stringValue } = param;

  const setValue = (value) => store.setIncremental(param, value);

  return (
    <Button.Group>
      <Button
        basic
        icon="minus"
        disabled={value === 0}
        onClick={() => setValue(value - 1)}
      />
      <Button
        basic
        icon
        disabled={value === 0}
        content={stringValue(value)}
      />
      <Button
        basic
        icon="plus"
        disabled={value === maxValue}
        onClick={() => setValue(value + 1)}
      />
    </Button.Group>
  );
});

const ParameterControl = ({ param }) => {
  if (param.longType) {
    switch (param.longType) {
      case "option":
      case "list":
        return <DropdownParameter param={param}/>;
      case "string":
      case "probability":
      case "number":
      case "integer":
        return <InputParameter param={param}/>;
      case "path":
        //return <FileInputParameter param={param}/>;
      default:
        return null;
    }
  }

  if (param.incremental) {
    return <IncrementalParameter param={param}/>;
  }

  return <ToggleParameter param={param}/>;
};

const ParameterGroup = ({ group, advanced }) => {
  const params = store.getParamsForGroup(group)
    .filter(param => !param.advanced || advanced)
    .sort((a, b) => a.advanced === b.advanced ? 0 : a.advanced ? 1 : -1);

  const styles = {
    header: { fontWeight: 500, fontSize: "1em" },
    extra: { fontWeight: 400 },
    meta: { float: "right", marginLeft: 20 },
  };

  const id = `Params${group}`;

  return (
    <>
      <Heading id={id}/>
      <Item.Group>
        {params.map((param, key) => (
          <Item key={key}>
            <Item.Content verticalAlign="top">
              <Item.Header as="h6" style={styles.header}>
                {param.short && <><code>{param.short}{param.shortType && `<${(param.shortType)}>`}</code>{", "}</>}
                <code>{param.long}{param.longType && ` <${(param.longType)}>`}</code>
              </Item.Header>
              <Item.Meta style={styles.meta}>
                <ParameterControl param={param}/>
              </Item.Meta>
              <Item.Description content={param.description}/>
              {param.default !== "" &&
              <Item.Extra style={styles.extra} content={`Default: ${param.default}`}/>}
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </>
  );
};

export default () => {
  const [advanced, setAdvanced] = useState(false);

  return (
    <>
      <Heading id="Parameters" advanced={advanced}/>
      <Checkbox
        toggle
        checked={advanced}
        onChange={() => setAdvanced(!advanced)}
        label="Show advanced parameters"
      />
      <ParameterGroup group="Input" advanced={advanced}/>
      <ParameterGroup group="Output" advanced={advanced}/>
      <ParameterGroup group="Algorithm" advanced={advanced}/>
      <ParameterGroup group="Accuracy" advanced={advanced}/>
      <ParameterGroup group="About" advanced={advanced}/>
    </>
  );
};
