import React, { useState } from "react";
import { Item, Checkbox } from "semantic-ui-react";
import { infomapParameters } from "@mapequation/infomap";
import { Heading } from "./TOC";

const getParamsForGroup = (params => group =>
  Object.values(params).filter(param => param.group === group))(
  infomapParameters
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

const paramDefault = param => {
  if (param.default) {
    return `Default: ${param.default}`;
  }
};

const ParameterGroup = ({ id, advanced }) => {
  const params = getParamsForGroup(id).filter(
    param => !param.advanced || advanced
  ).sort((a, b) => {
    if (a.advanced === b.advanced) {
      return 0;
    }
    return a.advanced ? 1 : -1;
  });

  return (
    <>
      <Heading id={id} />
      <Item.Group>
        {params.map((param, key) => (
          <Item key={key}>
            <Item.Content>
              <Item.Header as="h6" style={{ fontWeight: 500, fontSize: "1em" }}>
                {paramHeader(param)}
              </Item.Header>
              <Item.Description>{param.description}</Item.Description>
              {param.default && (
                <Item.Extra style={{ fontWeight: 400 }}>
                  {paramDefault(param)}
                </Item.Extra>
              )}
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
      <ParameterGroup id="About" advanced={advanced} />
      <ParameterGroup id="Input" advanced={advanced} />
      <ParameterGroup id="Output" advanced={advanced} />
      <ParameterGroup id="Algorithm" advanced={advanced} />
      <ParameterGroup id="Accuracy" advanced={advanced} />
    </>
  );
};
