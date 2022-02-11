import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
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
    <Box as="pre">
      {labelProps && <Text as="a" {...labelProps} />}
      <code className={styles.code}>{inner}</code>
      {lines && (
        <Text
          as="a"
          onClick={toggle}
          content={collapsed ? "Show more" : "Show less"}
        />
      )}
    </Box>
  );
}
