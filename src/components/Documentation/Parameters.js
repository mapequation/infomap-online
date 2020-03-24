import { observer } from "mobx-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Checkbox, Dropdown, Input, Item, Ref } from "semantic-ui-react";
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
      ref={ref => store.params.setRef(param.long, ref)}
      selection
      options={options}
      multiple={param.longType === "list"}
      placeholder={param.longType}
      clearable={param.clearable}
      value={param.value}
      onChange={(e, { value }) => store.params.setOption(param, value)}
    />
  );
});

const InputParameter = observer(({ param }) => {
  return (
    <Input
      id={param.long}
      style={{ width: "100px" }}
      placeholder={param.default}
      value={param.value}
      onChange={(e, { value }) => store.params.setInput(param, value)}
    />
  );
});

const FileInputParameter = observer(({ param }) => {
  const onDrop = (files) => {
    if (files.length < 1) return;

    const file = files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result.length) return;
      store.setActiveInput(param.tabName);
      store.params.setFileParam(param, { name: file.name, value: reader.result });
    };

    reader.readAsText(file, "utf-8");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: param.accept,
    noClick: true, // Turn off default click trigger to prevent double file requests
  });

  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Button
        basic
        as="label"
        htmlFor={param.long}
        {...rootProps}
      >
        Load file
        <input
          id={param.long}
          {...getInputProps()}
        />
      </Button>
    </Ref>
  );
});

const ToggleParameter = observer(({ param }) => {
  return (
    <Checkbox
      id={param.long}
      toggle
      checked={param.active}
      onChange={() => store.params.toggle(param)}
    />
  );
});

const IncrementalParameter = observer(({ param }) => {
  const { value, maxValue, stringValue } = param;

  const setValue = (value) => store.params.setIncremental(param, value);

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
  if (param.file)
    return <FileInputParameter param={param}/>;

  return <ToggleParameter param={param}/>;
};

const getHeaderProps = (param) => {
  const { active, long, dropdown, input, file, incremental, value } = param;
  const { params } = store;

  const props = { className: active ? "active" : "", as: "label" };

  if (dropdown) {
    const ref = params.getRef(long);
    if (!ref) return props;
    return {
      onClick: () => active ? params.setOption(param, param.default) : ref.open(),
      ...props,
    };
  }

  const labelProps = { htmlFor: long, ...props };

  if (incremental) {
    return {
      onClick: () => params.setIncremental(param, value > 0 ? 0 : 1),
      ...labelProps,
    };
  }

  if (input || file) {
    return {
      onClick: (event) => {
        if (!active) return;
        if (file) {
          event.preventDefault();
          return params.resetFileParam(param);
        }
        params.setInput(param, "");
      },
      ...labelProps,
    };
  }

  return labelProps;
};

const ParameterGroup = observer(({ group, advanced }) => {
  const params = store.params.getParamsForGroup(group)
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
