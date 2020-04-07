import React from "react";
import Code from "../Code";
import { Heading } from "./Contents";

export default () => (
  <>
    <Heading id="Prerequisites" />

    <p>
      Infomap requires a working <code>gcc</code> or <code>clang</code> compiler.
    </p>

    <Heading id="Linux" />

    <p>
      In Ubuntu, for example, the metapackage <code>build-essential</code> installs the compiler as
      well as related packages. Install it from the terminal with
    </p>

    <Code>sudo apt-get install build-essential</Code>

    <Heading id="macOS" />

    <p>
      Since Mac OS X 10.9, the standard compiler tools are based on <code>clang</code>, which can be
      installed with
    </p>

    <Code>xcode-select --install</Code>

    <p>
      However, the current version lacks OpenMP support for parallelization. While the Makefile
      automatically skips the <code>-fopenmap</code> compiler flag if the standard compiler is
      clang, to get support for OpenMP you can manually install a gcc-based compiler. A simple way
      is to install <a href="//brew.sh">Homebrew</a> and type, for example,{" "}
      <code>brew install gcc</code> in the terminal.
    </p>

    <Heading id="Windows" />

    <p>
      We recommend running Infomap in{" "}
      <a href="//msdn.microsoft.com/en-us/commandline/wsl/about">bash on ubuntu on Windows 10</a>.
      Follow{" "}
      <a href="//msdn.microsoft.com/en-us/commandline/wsl/install_guide">this installation guide</a>{" "}
      or{" "}
      <a href="//www.laptopmag.com/articles/use-bash-shell-windows-10">this installation guide</a>{" "}
      to enable the Linux Bash Shell in Windows 10. For example, install git with
    </p>

    <Code>sudo apt-get install git</Code>

    <p>
      Then install the metapackage <code>build-essential</code> for the compiler and related
      packages with
    </p>

    <Code>sudo apt-get install build-essential</Code>

    <p>
      Without Windows 10, you can install MinGW/MSYS for a minimalist development environment.
      Follow the instructions on{" "}
      <a href="//www.mingw.org/wiki/Getting_Started">MinGW - Getting Started</a> or download the
      complete{" "}
      <a href="//sourceforge.net/projects/mingwbundle/files/latest/download">MinGW-MSYS Bundle</a>.
    </p>
  </>
);
