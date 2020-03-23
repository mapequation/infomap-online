import React from "react";
import { Icon, Menu } from "semantic-ui-react";


export default ({ activeItem, disabled, onClick, physicalOptions, statesOptions }) => {
  const physicalMenuItems = physicalOptions
    .map(name => ({ key: name, name, active: activeItem === name }));

  const statesMenuItems = statesOptions
    .map(name => ({ key: name, name, active: activeItem === name }));

  const PhysicalMenu = <Menu
    vertical
    tabular="right"
    disabled={disabled}
    onItemClick={onClick}
    items={physicalMenuItems}
  />;

  const ExpandedMenu = <Menu
    vertical
    tabular="right"
    disabled={disabled}
  >
    <Menu.Item>
      <Menu.Header>
        Physical level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>
      </Menu.Header>
      <Menu.Menu>
        {physicalMenuItems.map(item => (
          <Menu.Item
            key={item.key}
            active={item.name === activeItem}
            name={item.name}
            onClick={onClick}
          />
        ))}
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Header>
        State level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>
      </Menu.Header>
      <Menu.Menu>
        {statesMenuItems.map(item => (
          <Menu.Item
            key={item.key}
            active={item.name === activeItem}
            name={item.name.replace("_states", "")}
            onClick={onClick}
          />
        ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>;

  return statesOptions.length ? ExpandedMenu : PhysicalMenu;
}