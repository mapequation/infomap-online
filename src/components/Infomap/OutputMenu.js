import React from "react";
import { Icon, Menu } from "semantic-ui-react";


export default ({ activeItem, disabled, onClick, physicalFiles, stateFiles }) => {

  if (stateFiles.length === 0) {
    if (physicalFiles.length < 2) {
      return null;
    }

    return (
      <Menu
        vertical
        tabular="right"
        disabled={disabled}
      >
        {physicalFiles.map(({ key, name }) => (
          <Menu.Item
            key={key}
            name={key}
            active={key === activeItem}
            onClick={onClick}
          >
            {name}
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  return (
    <Menu
      vertical
      tabular="right"
      disabled={disabled}
    >
      <Menu.Item>
        <Menu.Header>
          Physical level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>
        </Menu.Header>
        <Menu.Menu>
          {physicalFiles.map(({ key, name }) => (
            <Menu.Item
              key={key}
              name={key}
              active={key === activeItem}
              onClick={onClick}
            >
              {name}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>
          State level <a href="#PhysicalAndStateOutput"><Icon name="question circle"/></a>
        </Menu.Header>
        <Menu.Menu>
          {stateFiles.map(({ key, name }) => (
            <Menu.Item
              key={key}
              name={key}
              active={key === activeItem}
              onClick={onClick}
            >
              {name}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
}