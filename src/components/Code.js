import React from "react";

export default ({ children }) => (
  <pre style={{ width: "100%" }}>
    <code style={{ padding: "10px 10px", width: "100%", fontSize: "1em" }}>
      {children}
    </code>
  </pre>
);