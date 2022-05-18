import { Icon, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import { FaApple, FaUbuntu, FaWindows } from "react-icons/fa";
import Code from "../Code";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";
import Message from "../Message";

export default function Infomap() {
  return (
    <>
      <Heading id="Infomap" />
      <p>
        Infomap is a network clustering algorithm based on the{" "}
        <ExternalLink href="//www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
          Map Equation
        </ExternalLink>
        :
      </p>
      <TeX
        math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
        block
      />

      <Heading id="InfomapOnline" />
      <p>
        Infomap Online is a client-side web application that enables users to
        run Infomap in the web browser. Your data never leaves your computer; we
        don&apos;t store any data on our servers.
      </p>
      <p>
        We achieve this by compiling Infomap from{" "}
        <ExternalLink href="//emscripten.org">C++ to JavaScript</ExternalLink>,
        which gives a performance penalty compared to the stand-alone version of
        Infomap.
      </p>
      <p>
        If you want to integrate Infomap in your own web application, you can
        use the{" "}
        <ExternalLink href="//www.npmjs.com/package/@mapequation/infomap">
          Infomap NPM package
        </ExternalLink>
        .
      </p>

      <Heading id="Install" />
      <p>
        We recommend installing Infomap from the Python Package Index. Upgrades
        are easy and you get access to the{" "}
        <ExternalLink href="//mapequation.github.io/infomap/python">
          Python API
        </ExternalLink>
        .
      </p>
      <p>
        Currently, we provide pre-compiled packages for Windows and macOS. If no
        package is available for your platform and Python version, the code{" "}
        <a href="#CompilingFromSource">compiles from source</a>.
      </p>

      <p>To install, run</p>

      <Code>pip install infomap</Code>

      <p>To upgrade, run</p>

      <Code>pip install --upgrade infomap</Code>

      <Message bg="info" header="Infomap only supports Python 3">
        We currently build packages for Python 3.6 to 3.10.
      </Message>

      <Heading id="DownloadBinary" />
      <p>
        If you don&apos;t want to install Python, we provide pre-compiled
        binaries for Windows, Ubuntu and macOS. You can download the binaries
        from the{" "}
        <ExternalLink href="//github.com/mapequation/infomap/releases/latest">
          releases page
        </ExternalLink>{" "}
        or use the direct links below. The OpenMP versions require{" "}
        <code>libomp-dev</code> on Ubuntu and <code>libomp</code> on macOS.
      </p>

      <Table variant="simple" size="sm" mb={2}>
        <Thead>
          <Tr>
            <Th />
            <Th>OpenMP</Th>
            <Th>Without OpenMP</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Th>
              <Icon as={FaWindows} color="blue.600" mr={2} />
              Windows
            </Th>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win.zip">
                infomap-win.zip
              </a>
            </Td>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win-noomp.zip">
                infomap-win-noomp.zip
              </a>
            </Td>
          </Tr>
          <Tr>
            <Th>
              <Icon as={FaUbuntu} color="orange.500" mr={2} />
              Ubuntu 18.04
            </Th>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu.zip">
                infomap-ubuntu.zip
              </a>
            </Td>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu-noomp.zip">
                infomap-ubuntu-noomp.zip
              </a>
            </Td>
          </Tr>
          <Tr>
            <Th>
              <Icon as={FaApple} color="black" mr={2} />
              macOS 10.15
            </Th>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac.zip">
                infomap-mac.zip
              </a>
            </Td>
            <Td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac-noomp.zip">
                infomap-mac-noomp.zip
              </a>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Message header="Trusting binaries on macOS">
        Run <code>spctl --add Infomap</code> and enter your password to add the
        Infomap binary to GateKeeper&apos;s trusted binaries.
      </Message>

      <Heading id="CompilingFromSource" />
      <p>
        Building Infomap from source requires a working GCC or Clang compiler
        with support for C++14 and optionally OpenMP.
      </p>

      <p>
        On Ubuntu and Windows with WSL, install the <code>build-essential</code>{" "}
        and <code>libomp-dev</code> packages.
      </p>

      <p>
        On macOS, you can install Apple&apos;s development tools with{" "}
        <code>xcode-select --install</code> and the{" "}
        <ExternalLink href="//brew.sh">Homebrew</ExternalLink> version of OpenMP
        with <code>brew install libomp</code>.
      </p>

      <p>
        We don&apos;t currently support building Infomap from source on Windows
        without WSL. If you don&apos;t have WSL, you should use the binary
        releases or the Python package.
      </p>

      <Heading id="Download" />

      <p>
        <a href="//github.com/mapequation/infomap/archive/refs/heads/master.zip">
          Download Infomap source code
        </a>{" "}
        or check the{" "}
        <ExternalLink href="//github.com/mapequation/infomap/releases">
          releases page
        </ExternalLink>{" "}
        for all releases.
      </p>

      <p>Unzip the file and compile Infomap by running</p>

      <Code>
        unzip infomap.zip && cd infomap
        <br />
        make -j
      </Code>

      <Heading id="Git" />

      <p>
        To download the development version from{" "}
        <ExternalLink href="//www.github.com/mapequation/infomap">
          Github
        </ExternalLink>
        , clone the repository and compile Infomap by running
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
