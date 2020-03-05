import { infomapParameters } from "@mapequation/infomap";
import React, { useState } from "react";
import { Checkbox, Item, Table, Dropdown, Input, Button, Icon } from "semantic-ui-react";
import { Heading } from "./TOC";


const getParamsForGroup = (params => group =>
  Object.values(params).filter(param => param.group === group))(
    infomapParameters,
  );

const paramHeader = param => {
  let header = "";
  if (param.short) {
    header += param.short;
    if (param.shortType) header += `<${param.shortType}>`;
    header += ", ";
  }
  header += param.long;
  if (param.longType) {
    header += ` <${param.longType}>`;
  }
  return header;
};

const ParameterDefault = ({ param }) => {
  if (param.default) {
    return (
      <Item.Extra style={{ fontWeight: 400 }}>
        {`Default: ${param.default}`}
      </Item.Extra>
    );
  }
  return null;
};

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

  return (
    <>
      <Heading id={id} />
      <Table basic="very">
        <Table.Body>
          {params.map((param, key) => (
            <Table.Row key={key}>
              <Table.Cell>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Header as="h6" style={{ fontWeight: 500, fontSize: "1em" }}>
                        {paramHeader(param)}
                      </Item.Header>
                      <Item.Description>{param.description}</Item.Description>
                      <ParameterDefault param={param} />
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Table.Cell>
              <Table.Cell collapsing textAlign="right" verticalAlign="top">
                <ParameterControl param={param} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
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
