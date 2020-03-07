import React from "react";
import { Label, Segment } from "semantic-ui-react";
import "./Code.css";

export default ({ children, label }) => (
  <Segment as="pre" className="code">
    {label != null ? <Label {...label} /> : null}
    <code>{children}</code>
  </Segment>
);
