import React from "react";
import Code from "../Code";
import { Heading } from "./Contents";

export default () => (
  <>
    <Heading id="Prerequisites" />
    <p>
      Infomap requires a working <code>gcc</code> or <code>clang</code> compiler with support for
      C++14 and optionally OpenMP.
    </p>
    <Heading id="Linux" />
    <p>
      In Ubuntu, for example, the metapackage <code>build-essential</code> installs the compiler as
      well as related packages. Install from the terminal with
    </p>
    <Code>sudo apt install build-essential libomp-dev</Code>
    <Heading id="macOS" />
    <p>
      Since Mac OS X 10.9, the standard compiler tools are based on <code>clang</code>, which can be
      installed with
    </p>
    <Code>xcode-select --install</Code>
    <p>
      However, the current version lacks OpenMP support for parallelization. To install with OpenMP
      support, install the <code>libomp</code> package with <a href="//brew.sh">Homebrew</a>:
    </p>
    <Code>brew install libomp</Code>
    <Heading id="Windows" />
    <p>
      We recommend running Infomap in{" "}
      <a href="//msdn.microsoft.com/en-us/commandline/wsl/about">WSL on Windows 10</a>. Follow the{" "}
      <a href="//msdn.microsoft.com/en-us/commandline/wsl/install_guide">WSL installation guide</a>{" "}
      to install WSL on Windows 10.
    </p>
    <p>
      Then install the metapackage <code>build-essential</code> for the compiler and related
      packages with
    </p>
    <Code>sudo apt install build-essential libomp-dev</Code>
    <p>
      To install Infomap with <code>pip</code>, install the python3 package
    </p>
    <Code>sudo apt install python3 python3-pip</Code>
    MingGW is not supported.
  </>
);
