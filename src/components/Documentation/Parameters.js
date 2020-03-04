import { infomapParameters } from "@mapequation/infomap";
import React, { useState } from "react";
import { Checkbox, Item } from "semantic-ui-react";
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

const paramDefault = param => {
  if (param.default) {
    return (
      <Item.Extra style={{ fontWeight: 400 }}>
        {`Default: ${param.default}`}
      </Item.Extra>
    );
  }
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
      <Heading id={id}/>
      <Item.Group>
        {params.map((param, key) => (
          <Item key={key}>
            <Item.Content>
              <Item.Header as="h6" style={{ fontWeight: 500, fontSize: "1em" }}>
                {paramHeader(param)}
              </Item.Header>
              <Item.Description>{param.description}</Item.Description>
              {paramDefault(param)}
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
      <Heading id="Parameters" advanced={advanced}/>
      <Checkbox
        toggle
        checked={advanced}
        onChange={toggle}
        label="Show advanced parameters"
      />
      {["ParamsInput", "ParamsOutput", "ParamsAlgorithm", "ParamsAccuracy", "ParamsAbout"].map((id) =>
        <ParameterGroup id={id} key={id} advanced={advanced}/>
      )}
    </>
  );
};
