import React from "react";
import { Button, Image } from "semantic-ui-react";

export default (props) => (
  <Button
    as="a"
    target="_blank"
    rel="noopener noreferrer"
    style={{ padding: 10, marginTop: 20 }}
    {...props}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ fontWeight: 300, marginBottom: 5 }}>
        Explore in
      </div>
      <Image
        size="mini"
        src="https://www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
      />
      <div
        className="brand"
        style={{ fontSize: 16, lineHeight: 1.1, marginTop: 5 }}
      >
        <span className="brand-infomap">Infomap</span>{" "}
        <span className="brand-nn">Network Navigator</span>
      </div>
    </div>
  </Button>
);