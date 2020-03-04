import React from "react";
import { Segment } from "semantic-ui-react";

export default ({ children, label }) => (
  <Segment as="pre" style={{ boxShadow: 'none' }}>
    { label }
    <code style={{ fontSize: "1em" }}>
      {children}
    </code>
  </Segment>
);