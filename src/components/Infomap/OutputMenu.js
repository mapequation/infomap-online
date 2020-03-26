import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import store from "../../store";


const DocIcon = <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>;

export default (props) => {
  const { activeKey, setActiveKey, physicalFiles, stateFiles } = store.output;

  const getMenuItem = ({ key, name }) =>
    <Menu.Item
      key={key}
      name={key}
      active={key === activeKey}
      onClick={(e, { name }) => setActiveKey(name)}
      content={name}
    />;

  if (!stateFiles.length) {
    return physicalFiles.length < 2 ? null :
      <Menu {...props} items={physicalFiles.map(getMenuItem)}/>;
  }

  const items = [
    { header: <>Physical level {DocIcon}</>, files: physicalFiles },
    { header: <>State level {DocIcon}</>, files: stateFiles },
  ];

  return (
    <Menu {...props}>
      {items.map(({ header, files }, key) =>
        <Menu.Item key={key}>
          <Menu.Header content={header}/>
          <Menu.Menu content={files.map(getMenuItem)}/>
        </Menu.Item>)}
    </Menu>
  );
}