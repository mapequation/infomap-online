import dynamic from "next/dynamic";
import { Icon, Message, Table } from "semantic-ui-react";
import Code from "../Code";
import { Heading } from "./Contents";

const Version = dynamic(() => import("../InfomapVersion"), { ssr: false });

export default function Install() {
  return (
    <>
      <Heading id="Install" />
      <p>
        We recommend installing Infomap from the Python Package Index. Upgrades are easy and you get
        access to the <a href="//mapequation.github.io/infomap/python">Python API</a>.
      </p>
      <p>
        Currently, we provide pre-compiled packages for Windows and macOS. If no package is
        available for your platform and Python version, the code{" "}
        <a href="#CompilingFromSource">compiles from source</a>.
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
        If you don&apos;t want to install Python, we provide pre-compiled binaries for Windows,
        Ubuntu and macOS. You can download the binaries from the{" "}
        <a href="//github.com/mapequation/infomap/releases/latest">releases page</a> or use the
        direct links below. The OpenMP versions require <code>libomp-dev</code> on Ubuntu and{" "}
        <code>libomp</code> on macOS.
      </p>

      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.Cell />
            <Table.HeaderCell>OpenMP</Table.HeaderCell>
            <Table.HeaderCell>Without OpenMP</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name="windows" color="blue" />
              Windows
            </Table.HeaderCell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win.zip">
                infomap-win.zip
              </a>
            </Table.Cell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win-noomp.zip">
                infomap-win-noomp.zip
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name="linux" color="black" />
              Ubuntu 18.04
            </Table.HeaderCell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu.zip">
                infomap-ubuntu.zip
              </a>
            </Table.Cell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu-noomp.zip">
                infomap-ubuntu-noomp.zip
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name="apple" color="black" />
              macOS 10.15
            </Table.HeaderCell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac.zip">
                infomap-mac.zip
              </a>
            </Table.Cell>
            <Table.Cell>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac-noomp.zip">
                infomap-mac-noomp.zip
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Message>
        <Message.Header>Trusting binaries on macOS</Message.Header>
        <p>
          Run <code>spctl --add Infomap</code> and enter your password to add the Infomap binary to
          GateKeeper&apos;s trusted binaries.
        </p>
      </Message>

      <Heading id="CompilingFromSource" />
      <p>
        Building Infomap from source requires a working GCC or Clang compiler with support for C++14
        and optionally OpenMP.
      </p>

      <p>
        On Ubuntu and Windows with WSL, install the <code>build-essential</code> and{" "}
        <code>libomp-dev</code> packages.
      </p>

      <p>
        On macOS, you can install Apple&apos;s development tools with{" "}
        <code>xcode-select --install</code> and the <a href="//brew.sh">Homebrew</a> version of
        OpenMP with <code>brew install libomp</code>.
      </p>

      <p>
        We don&apos;t currently support building Infomap from source on Windows without WSL. If you
        don&apos;t have WSL, you should use the binary releases or the Python package.
      </p>

      <Heading id="Download" />

      <p>
        <a href="//github.com/mapequation/infomap/archive/refs/heads/master.zip">
          <Icon name="download" />
          Download Infomap <Version /> source code
        </a>{" "}
        or check the <a href="//github.com/mapequation/infomap/releases">releases page</a> for all
        releases.
      </p>

      <p>Unzip the file and compile Infomap by running</p>

      <Code>
        unzip infomap-
        <Version />
        .zip && cd infomap-
        <Version />
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
}
