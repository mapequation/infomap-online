import { infomapParameters } from "@mapequation/infomap";
import React, { useState } from "react";
import { Checkbox, Item, Table, Dropdown, Input, Button, Icon } from "semantic-ui-react";
import { Heading } from "./TOC";


const getParamsForGroup = (params => group =>
  Object.values(params).filter(param => param.group === group))(
    infomapParameters,
  );

const DropdownParameter = ({ param }) => {
  const match = param.description.match(/Options: (.*)\.$/);
  if (!(match && match[1])) return null;

  const options = match[1]
    .split(',')
    .map((value, key) => ({
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
      defaultValue={param.default}
    />
  );
};

const InputParameter = ({ param }) => {
  return (
    <Input
      style={{ width: "100px" }}
      placeholder={param.default}
    />
  );
};

const FileInputParameter = ({ param }) => {
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
}

const ToggleParameter = ({ param }) => {
  const [checked, setChecked] = useState(param.default);

  return (
    <Checkbox
      toggle
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  );
}

const IncrementalParameter = ({ param }) => {
  const [value, setValue] = useState(0);

  const string = param.short.slice(1);

  const maxValue = string === "h" ? 2 : 3;

  const decrement = () => {
    if (value === 0) return;
    setValue(value - 1);
  }

  const increment = () => {
    if (value === maxValue) return;
    setValue(value + 1);
  }

  return (
    <Button.Group>
      <Button icon basic onClick={decrement} disabled={value === 0}>
        <Icon name="minus" />
      </Button>
      <Button icon basic disabled={value === 0}>
        {value > 0 ? string.repeat(value) : string}
      </Button>
      <Button icon basic onClick={increment} disabled={value === maxValue}>
        <Icon name="plus" />
      </Button>
    </Button.Group>
  )
}

const ParameterControl = ({ param }) => {
  if (param.longType) {
    switch (param.longType) {
      case "option":
      case "list":
        return <DropdownParameter param={param} />;
      case "string":
      case "probability":
      case "number":
      case "integer":
        return <InputParameter param={param} />;
      case "path":
        return <FileInputParameter param={param} />;
      default:
        return null;
    }
  }

  if (param.incremental) {
    return <IncrementalParameter param={param} />
  }

  return <ToggleParameter param={param} />;
};

const ParameterGroup = ({ id, advanced }) => {
  // Param headings are prepended with "Prams" as a namespace
  // Remove that part
  const match = id.match(/^Params(.*)$/);
  const group = match && match[1] ? match[1] : id;

  const params = getParamsForGroup(group)
    .filter(param => !param.advanced || advanced)
    .sort((a, b) => a.advanced === b.advanced ? 0 : a.advanced ? 1 : -1);

  const styles = {
    header: { fontWeight: 500, fontSize: "1em" },
    extra: { fontWeight: 400 },
    meta: { float: "right", marginLeft: 20 },
  };

  const paramHeader = ({ long, longType, short, shortType }) => {
    let header = "";
    if (short) {
      header += short;
      if (shortType) header += `<${shortType}>`;
      header += ", ";
    }
    header += long;
    if (longType) {
      header += ` <${longType}>`;
    }
    return header;
  };

  return (
    <>
      <Heading id={id}/>
      <Item.Group>
        {params.map((param, key) => (
          <Item key={key}>
            <Item.Content verticalAlign="top">
              <Item.Header as="h6" style={styles.header} content={paramHeader(param)}/>
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

  const toggle = () => setAdvanced(!advanced);

  return (
    <>
      <Heading id="Parameters" advanced={advanced} />
      <Checkbox
        toggle
        checked={advanced}
        onChange={toggle}
        label="Show advanced parameters"
      />
      {["ParamsInput", "ParamsOutput", "ParamsAlgorithm", "ParamsAccuracy", "ParamsAbout"].map((id) =>
        <ParameterGroup id={id} key={id} advanced={advanced} />
      )}
    </>
  );
};
