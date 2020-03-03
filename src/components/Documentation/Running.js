import React from "react";
import { Heading } from "./TOC";
import Code from "../Code";
import { Message } from "semantic-ui-react";

export default () => (
  <>
    <Heading id="Running" />

    <p>Usage:</p>

    <Code>./Infomap [parameters] network_data out_directory</Code>

    <p>
      The optional <a href="#Parameters">parameters</a> can be put anywhere.
      The <code>network_data</code> should point to a
      valid network file and <code>out_directory</code> to a directory where
      Infomap should write output files.
    </p>

    <Message info>
      If no <code>parameters</code> are provided, Infomap will assume an <strong>undirected</strong>{" "}
      network and try to partition it <strong>hierarchically</strong>.
    </Message>
  </>
);
