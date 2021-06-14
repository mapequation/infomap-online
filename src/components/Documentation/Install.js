import Infomap from "@mapequation/infomap";
import React from "react";
import { Icon, Message } from "semantic-ui-react";
import Code from "../Code";
import { Heading } from "./Contents";

export default () => (
  <>
    <Heading id="Install" />

    <p>Infomap can be installed on your computer in several ways.</p>

    <p>
      We recommend <a href="#UsingPip">using pip</a>. If you want to compile from source yourself,
      read the section <a href="#CompilingFromSource">Compiling from source</a>.
    </p>

    <p>
      Installing Infomap requires a working <code>gcc</code> or <code>clang</code> compiler. More
      information can be found under <a href="#Prerequisites">Prerequisites</a>.
    </p>

    <Heading id="UsingPip" />

    <p>The easiest way to download Infomap is from the Python Package Index, PyPi.</p>

    <p>To install, run</p>

    <Code>pip install infomap</Code>

    <p>To upgrade, run</p>

    <Code>pip install --upgrade infomap</Code>

    <p>
      For now, we only provide binary wheels (Python packages) for macOS. This means that you might
      might need a working compiler and OpenMP libraries installed for your platform.
    </p>

    <p>
      When Infomap is installed, an executable called <code>infomap</code> is available on the
      command line from any directory.
    </p>

    <p>
      To use the Infomap Python API, read the{" "}
      <a href="//mapequation.github.io/infomap/python">the API documentation</a>.
    </p>

    <Message warning>
      <Message.Header>Python 2 support</Message.Header>
      <p>Since Python 2 has reached End of Life, Infomap now only supports Python 3.</p>
    </Message>

    <Heading id="CompilingFromSource" />

    <p>
      To compile Infomap from source, first <a href="#Download">download the source code</a> or{" "}
      <a href="#Git">clone the git repository</a>.
    </p>

    <p>
      After downloading the source and running <code>make</code>, an executable called{" "}
      <code>Infomap</code> will be available in the source directory.
    </p>

    <Heading id="Download" />

    <p>
      <a href={`//github.com/mapequation/infomap/archive/v${Infomap.__version__}.zip`}>
        <Icon name="download" />
        Download Infomap {Infomap.__version__}
      </a>{" "}
      or check the <a href="//github.com/mapequation/infomap/releases">releases page</a> for all
      releases.
    </p>

    <p>Unzip the file and compile Infomap by running</p>

    <Code>
      unzip infomap-{Infomap.__version__}.zip && cd infomap-{Infomap.__version__}
      <br />
      make
    </Code>

    <Heading id="Git" />

    <p>
      To download the development version from{" "}
      <a href="//www.github.com/mapequation/infomap">Github</a>, clone the repository and compile
      Infomap by running
    </p>

    <Code>
      git clone git@github.com:mapequation/infomap.git
      <br />
      cd infomap
      <br />
      make
    </Code>

    <Message warning>
      <Message.Header>Migrating from 0.x to 1.0</Message.Header>

      <p>
        We have moved the old master branch to <code>v0.x</code>.
      </p>

      <p>If you have cloned Infomap before v1.0, get the master branch up-to-date by running</p>

      <Code>
        git checkout v0.x
        <br />
        git branch -D master
        <br />
        git checkout master
      </Code>
    </Message>
  </>
);
