import React, { useState } from "react";
import { Label, Segment } from "semantic-ui-react";
import "./Code.css";
import Highlight from "./Highlight";


export default function Code({ highlight, lines, labelProps, children }) {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => setCollapsed(!collapsed);

  if (collapsed && lines) {
    children = children.split("\n").slice(0, lines).join("\n");
  }

  const inner = highlight ? <Highlight content={children} /> : children;

  return (
    <Segment as="pre" className="code">
      {labelProps && <Label as="a" attached="top" {...labelProps} />}
      <code>{inner}</code>
      {lines && (
        <Label
          as="a"
          attached="bottom"
          onClick={toggle}
          content={collapsed ? "Show more" : "Show less"}
        />
      )}
    </Segment>
  );
}
