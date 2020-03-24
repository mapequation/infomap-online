import React from "react";
import { Icon, Menu } from "semantic-ui-react";


export default ({ activeItem, disabled, onClick, physicalFiles, stateFiles }) => {
  const physicalMenuItems = physicalFiles
    .map(({ key, name }) => ({ key, name, active: activeItem === key }));

  const statesMenuItems = stateFiles
    .map(({ key, name }) => ({ key, name, active: activeItem === key }));

  const PhysicalMenu = <Menu
    vertical
    tabular="right"
    disabled={disabled}
  >
    { physicalFiles.map(({ key, name }) => (
      <Menu.Item
        key={key}
        name={key}
        active={key === activeItem}
        onClick={onClick}
      >
      { name }
      </Menu.Item>
    ))}
  </Menu>

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
      { physicalFiles.map(({ key, name }) => (
        <Menu.Item
          key={key}
          name={key}
          active={key === activeItem}
          onClick={onClick}
        >
        { name }
        </Menu.Item>
      ))}
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Header>
        State level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>
      </Menu.Header>
      <Menu.Menu>
      { stateFiles.map(({ key, name }) => (
        <Menu.Item
          key={key}
          name={key}
          active={key === activeItem}
          onClick={onClick}
        >
        { name }
        </Menu.Item>
      ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>;

  return stateFiles.length ? ExpandedMenu : PhysicalMenu;
}