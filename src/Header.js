import React from "react";
import "./Header.css";
import { Container, Menu, Header as H, Icon } from "semantic-ui-react";
import Infomap from "@mapequation/infomap";

const Header = () => (
  <header>
    <Container>
      <Menu borderless className="header-menu documentation">
        <Menu.Item fitted>
          <H as="h1">
            <a href="https://www.mapequation.org">
              <img
                className="mapequation-logo"
                src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                alt="mapequation-icon"
              />
            </a>
            <div className="content">
              <span className="brand">
                <span className="brand-infomap">Infomap</span>{" "}
                <span className="brand-nn">Online</span>
              </span>
              <div className="sub header">
                Network community detection using the Map Equation framework
              </div>
            </div>
          </H>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <a href="#Install">
              Infomap { Infomap.__version__ }
              <Icon className="Github" name="download" size="big"></Icon>
            </a>
          </Menu.Item>
          <Menu.Item fitted>
            <H as="h1">
              <a href="https://github.com/mapequation/infomap">
                <Icon className="Github" name="github"></Icon>
              </a>
            </H>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Container>
  </header>
);

export default Header;
