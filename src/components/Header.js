import Infomap from "@mapequation/infomap";
import { Container, Header as Heading, Icon, Menu } from "semantic-ui-react";
import "./Header.css";


const Header = () => (
  <header>
    <Container>
      <Menu borderless stackable className="header-menu documentation">
        <Menu.Item fitted>
          <Heading as="h1">
            <a href="https://www.mapequation.org">
              <img
                className="mapequation-logo"
                src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                alt="mapequation-icon"
              />
            </a>
            <div className="content">
              <span className="brand">
                <span className="infomap">Infomap</span> <span className="online">Online</span>
              </span>
              <div className="sub header">
                Network community detection using the Map Equation framework
              </div>
            </div>
          </Heading>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item fitted className="icons">
            <a href="#Install">
              Infomap {Infomap.__version__}
              <Icon name="download" size="big" />
            </a>
            <a href="https://github.com/mapequation/infomap">
              <Icon name="github" size="big" />
            </a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Container>
  </header>
);

export default Header;
