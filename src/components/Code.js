import React from "react";
import { Label, Segment } from "semantic-ui-react";
import "./Code.css";

export default ({ children, label }) => (
  <Segment as="pre" style={{ boxShadow: 'none' }}>
    {label != null ? <Label {...label} /> : null}
    <code style={{ fontSize: "1em" }}>
      {children}
    </code>
  </Segment>
);
