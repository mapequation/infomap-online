import React, { useState } from "react";
import { Label, Segment } from "semantic-ui-react";
import styles from "../styles/Code.module.css";
import Highlight from "./Highlight";

export default function Code({ highlight, lines, labelProps, children }) {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => setCollapsed(!collapsed);

  if (collapsed && lines) {
    children = children.split("\n").slice(0, lines).join("\n");
  }

  const inner = highlight ? <Highlight content={children} /> : children;

  return (
    <Segment as="pre">
      {labelProps && <Label as="a" attached="top" {...labelProps} />}
      <code className={styles.code}>{inner}</code>
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
