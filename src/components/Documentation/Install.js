import infomap from "@mapequation/infomap";
import Infomap from "@mapequation/infomap";
import React from "react";
import { Icon, Message, List } from "semantic-ui-react";
import Code from "../Code";
import { Heading } from "./Contents";

export default () => (
  <>
    <Heading id="Install" />
    <p>
      We recommend installing Infomap from the Python Package Index. Upgrades are easy
      and you get access to the <a href="//mapequation.github.io/infomap/python">Python API</a>.
    </p>
    <p>
      Currently, we provide pre-compiled packages for Windows and macOS.
      If no package is available for your platform and Python version,
      the code <a href="#CompilingFromSource">compiles from source</a>.
    </p>

    <p>To install, run</p>

    <Code>pip install infomap</Code>

    <p>To upgrade, run</p>

    <Code>pip install --upgrade infomap</Code>

    <Message warning>
      <Message.Header>Infomap only supports Python 3</Message.Header>
      We currently build packages for Python 3.6 to 3.9.
    </Message>

    <Heading id="DownloadBinary" />
    <p>
      If you don't want to install Python, we provide pre-compiled binaries for Windows, Linux and macOS.
      You can download the binaries use the{" "}
      <a href="//github.com/mapequation/infomap/releases/latest">releases page</a> or use the
      following direct links:
    </p>

    <List verticalAlign="middle">
      <List.Item
        as="a"
        href="//github.com/mapequation/infomap/releases/latest/download/infomap-win.zip"
      >
        <List.Icon size="large" name="windows" color="blue" />
        <List.Content>Infomap (Windows)</List.Content>
      </List.Item>
      <List.Item
        as="a"
        href="//github.com/mapequation/infomap/releases/latest/download/infomap-linux.zip"
      >
        <List.Icon size="large" name="linux" color="black" />
        <List.Content>Infomap (Linux)</List.Content>
      </List.Item>
      <List.Item
        as="a"
        href="//github.com/mapequation/infomap/releases/latest/download/infomap-macos.zip"
      >
        <List.Icon size="large" name="apple" color="black" />
        <List.Content>Infomap (macOS)</List.Content>
      </List.Item>
    </List>

    <Message>
      <Message.Header>OpenMP required</Message.Header>
      <p>
        The Linux and macOS binaries requires OpenMP
        (<code>libomp-dev</code> on Ubuntu and <code>libomp</code> on macOS) to be installed.
      </p>
    </Message>

    <Message>
      <Message.Header>Trusting binaries on macOS</Message.Header>
      <p>
        Run <code>spctl --add Infomap</code> and enter your password
        to add the Infomap binary to GateKeeper's trusted binaries.
      </p>
    </Message>

    <Heading id="CompilingFromSource" />
    <p>
      Building Infomap from source requires a working <code>GCC</code> or <code>clang</code> compiler with support for
      C++14 and optionally OpenMP.
    </p>

    <p>
      On Ubuntu and Windows with WSL, install the <code>build-essential</code> and <code>libomp-dev</code> packages.
    </p>

    <p>
      On macOS, you can install Apple's development tools with <code>xcode-select --install</code> and the <a href="\\brew.sh">Homebrew</a> version of OpenMP with <code>brew install libomp</code>.
    </p>

    <p>
      We don't currently support building Infomap from source on Windows without WSL.
      If you don't have WSL, you should use the binary releases or the Python package.
    </p>

    <Heading id="Download" />

    <p>
      <a href={`//github.com/mapequation/infomap/archive/v${Infomap.__version__}.zip`}>
        <Icon name="download" />
        Download Infomap {Infomap.__version__} source code
      </a>{" "}
      or check the <a href="//github.com/mapequation/infomap/releases">releases page</a> for all
      releases.
    </p>

    <p>Unzip the file and compile Infomap by running</p>

    <Code>
      unzip infomap-{Infomap.__version__}.zip && cd infomap-{Infomap.__version__}
      <br />
      make -j
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
      make -j
    </Code>
  </>
);
