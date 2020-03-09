import React from "react";
import { Heading } from "./TOC";
import Code from "../Code";
import { Message } from "semantic-ui-react";

export default () => (
  <>
    <Heading id="Running" />

    <p>If you installed Infomap using <code>pip</code>, usage is</p>

    <Code>infomap [parameters] network_data out_directory</Code>

    <p>
      If you compiled Infomap from source by running <code>make</code>, usage is
    </p>

    <Code>./Infomap [parameters] network_data out_directory</Code>

    <p>
      To make the compiled from source version of Infomap available in any directory, add an alias
      to e.g. your <code>.profile</code> by running the following in the source directory
    </p>

    <Code>
      echo "alias Infomap=$PWD/Infomap" >> ~/.test
    </Code>

    <p>and restarting your shell.</p>

    <p>
      The optional <a href="#Parameters">parameters</a> can be put anywhere.
      The <code>network_data</code> should point to a
      valid network file and <code>out_directory</code> to a directory where
      Infomap should write output files.
    </p>

    <Message info>
      If no <strong>parameters</strong> are provided, Infomap will assume an <strong>undirected</strong>{" "}
      network and try to partition it <strong>hierarchically</strong>.
    </Message>
  </>
);
