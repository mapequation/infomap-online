import React from "react";
import { Message } from "semantic-ui-react";
import Code from "../Code";
import { Heading } from "./Contents";

export default () => (
  <>
    <Heading id="Running" />

    <p>
      If you installed Infomap using <code>pip</code>, usage is
    </p>

    <Code>infomap [parameters] network_data out_directory</Code>

    <p>
      If you compiled Infomap from source by running <code>make</code>, usage is
    </p>

    <Code>./Infomap [parameters] network_data out_directory</Code>

    <p>
      To make the compiled from source version of Infomap available in any directory, either add the
      source directory to your <code>$PATH</code>, or add an alias to your <code>.profile</code> by
      running
    </p>

    <Code>echo "alias Infomap=$PWD/Infomap" >> ~/.profile</Code>

    <p>in the source directory and restarting your shell.</p>

    <p>
      The optional <a href="#Parameters">parameters</a> can be put anywhere. The{" "}
      <code>network_data</code> should point to a valid network file and <code>out_directory</code>{" "}
      to a directory where Infomap should write output files.
    </p>

    <Message info>
      If no <strong>parameters</strong> are provided, Infomap will assume an{" "}
      <strong>undirected</strong> network and try to partition it <strong>hierarchically</strong>.
    </Message>
  </>
);
