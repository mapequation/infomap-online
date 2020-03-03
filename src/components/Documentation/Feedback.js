import React from "react";
import { Icon } from "semantic-ui-react";
import { Heading } from "./TOC";

export default () => (
  <>
    <Heading id="Feedback" />
    <p>
      If you have any questions, suggestions or issues regarding the
      software, please add them to{" "}
      <a href="//github.com/mapequation/infomap/issues">
        <Icon name="github"></Icon>GitHub issues
      </a>
      .
    </p>
  </>
);
