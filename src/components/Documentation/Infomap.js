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
        . It finds modules by compressing the description of flow on a network:
      </p>
      <TeX
        math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
        block
      />

      <Heading id="InfomapOnline" />
      <p>
        Infomap Online is a client-side web application for running Infomap in
        the browser. Your data never leaves your computer, and we do not store
        any data on our servers.
      </p>
      <p>
        We do this by compiling Infomap from{" "}
        <ExternalLink href="//emscripten.org">C++ to JavaScript</ExternalLink>,
        which makes the browser version slower than the stand-alone version of
        Infomap.
      </p>
      <p>
        If you want to integrate Infomap into your own web application, you can
        use the{" "}
        <ExternalLink href="//www.npmjs.com/package/@mapequation/infomap">
          Infomap NPM package
        </ExternalLink>
        .
      </p>

      <Heading id="Install" />
      <p>
        We recommend installing Infomap from the Python Package Index. Upgrades
        are straightforward, and you also get access to the{" "}
        <ExternalLink href="//mapequation.github.io/infomap/python">
          Python API
        </ExternalLink>
        .
      </p>
      <p>
        We publish Python packages for supported Python versions on major
        platforms. If no package is available for your platform and Python
        version, Infomap will <a href="#CompilingFromSource">compile from source</a>.
      </p>

      <p>To install, run</p>

      <Code>pip install infomap</Code>

      <p>To upgrade, run</p>

      <Code>pip install --upgrade infomap</Code>

      <p>
        If you only want the native CLI on macOS or Linux, install the
        Homebrew tap and formula with:
      </p>

      <Code>
        brew tap mapequation/infomap
        <br />
        brew install infomap
      </Code>

      <p>Or install directly in one command:</p>

      <Code>brew install mapequation/infomap/infomap</Code>

      <Message bg="info" header="Infomap only supports Python 3">
        We currently build packages for Python 3.11 to 3.14.
      </Message>

      <Heading id="DownloadBinary" />
      <p>
        If you don&apos;t want to install Python, we provide pre-compiled
        binaries for Windows, Ubuntu and macOS. You can download the binaries
        from the{" "}
        <ExternalLink href="//github.com/mapequation/infomap/releases/latest">
          releases page
        </ExternalLink>{" "}
        or use the direct links below. Both OpenMP and non-OpenMP variants are
        available. The OpenMP versions require{" "}
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
              Ubuntu
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
              macOS
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
        Infomap binary to Gatekeeper&apos;s trusted binaries.
      </Message>

      <Heading id="CompilingFromSource" />
      <p>
        Building Infomap from source requires a working GCC or Clang compiler
        with C++14 support and, optionally, OpenMP.
      </p>

      <p>
        On Ubuntu, install the <code>build-essential</code> and{" "}
        <code>libomp-dev</code> packages.
      </p>

      <p>
        On macOS, you can install Apple&apos;s development tools with{" "}
        <code>xcode-select --install</code> and the{" "}
        <ExternalLink href="//brew.sh">Homebrew</ExternalLink> version of OpenMP
        with <code>brew install libomp</code>.
      </p>

      <p>
        If you are building on Windows, we recommend using the binary releases
        or the Python package unless you already have a working native build
        environment.
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
        make -j build-native
      </Code>

      <p>
        If OpenMP is unavailable, you can build without it using{" "}
        <code>OPENMP=0</code>.
      </p>

      <Code>make -j build-native OPENMP=0</Code>

      <Heading id="Git" />

      <p>
        To download the development version from{" "}
        <ExternalLink href="//www.github.com/mapequation/infomap">
          GitHub
        </ExternalLink>
        , clone the repository and compile Infomap by running
      </p>

      <Code>
        git clone git@github.com:mapequation/infomap.git
        <br />
        cd infomap
        <br />
        make -j build-native
      </Code>
    </>
  );
}
