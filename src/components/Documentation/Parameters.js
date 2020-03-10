import { observer } from "mobx-react";
import React, { useState } from "react";
import { Button, Checkbox, Dropdown, Input, Item } from "semantic-ui-react";
import store from "../../store";
import { Heading } from "./TOC";


const DropdownParameter = observer(({ param }) => {
  const options = param.options.map((value, key) => ({
    key,
    text: value,
    value,
  }));

  return (
    <Dropdown
      ref={ref => store.setRef(param.long, ref)}
      selection
      options={options}
      multiple={param.longType === "list"}
      placeholder={param.longType}
      clearable={param.clearable}
      value={param.value}
      onChange={(e, { value }) => store.setOption(param, value)}
    />
  );
});

const InputParameter = observer(({ param }) => {
  return (
    <Input
      ref={ref => store.setRef(param.long, ref)}
      id={param.long}
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
      id={param.long}
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
  if (param.dropdown)
    return <DropdownParameter param={param}/>;
  if (param.input)
    return <InputParameter param={param}/>;
  if (param.incremental)
    return <IncrementalParameter param={param}/>;

  return <ToggleParameter param={param}/>;
};

const getHeaderProps = (param) => {
  const { active, long, longType, dropdown, input, incremental, value } = param;

  const props = { className: active ? "active" : "", as: "label" };

  if (longType === "path") return; // TODO

  if (dropdown) {
    const ref = store.getRef(long);
    if (!ref) return props;
    return {
      onClick: () => active ? store.setOption(param, param.default) : ref.open(),
      ...props,
    };
  }

  const labelProps = { htmlFor: long, ...props };

  if (incremental) {
    return {
      onClick: () => store.setIncremental(param, value > 0 ? 0 : 1),
      ...labelProps,
    };
  }

  if (input) {
    const ref = store.getRef(long);
    if (!ref) return labelProps;
    return {
      onClick: () => active ? store.setInput(param, "") : null,
      ...labelProps,
    };
  }

  return labelProps;
};

const ParameterGroup = observer(({ group, advanced }) => {
  const params = store.getParamsForGroup(group)
    .filter(param => !param.advanced || advanced)
    .sort((a, b) => a.advanced === b.advanced ? 0 : a.advanced ? 1 : -1);

  const id = `Params${group}`;

  return (
    <>
      <Heading id={id}/>
      <Item.Group className="paramGroup">
        {params.map((param, key) => (
          <Item key={key}>
            <Item.Content verticalAlign="top">
              <Item.Header {...getHeaderProps(param)}>
                {param.short && <><code>{param.shortString}</code>{", "}</>}
                <code>{param.longString}</code>
              </Item.Header>
              <Item.Meta>
                <ParameterControl param={param}/>
              </Item.Meta>
              <Item.Description content={param.description}/>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </>
  );
});

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
