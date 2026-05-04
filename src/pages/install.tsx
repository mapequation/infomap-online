// @ts-nocheck
import { Container, Heading, Icon, Link } from "@chakra-ui/react";
import type { NextPage } from "next";
import { FaApple, FaUbuntu, FaWindows } from "react-icons/fa";
import Code from "../shared/components/Code";

const InstallPage: NextPage = () => {
  return (
    <Container>
      <Heading as="h1" size="lg" mt={8} mb={6} id="Install">
        Install Infomap
      </Heading>

      <p>
        For most users, the Python package is the best starting point: it
        installs both the Python API and the <code>infomap</code> command-line
        tool. If you only need a native CLI, use Homebrew or a standalone
        binary.
      </p>

      <Heading as="h2" size="md" mt={8} mb={6} id="PythonPackage">
        Recommended: Python package
      </Heading>

      <p>
        Install from{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//pypi.org/project/infomap/"
        >
          PyPI
        </Link>
        :
      </p>

      <Code>pip install infomap</Code>

      <p>Upgrade an existing installation:</p>

      <Code>pip install --upgrade infomap</Code>

      <p>
        The package also installs the <code>infomap</code> CLI. Verify the
        installation with:
      </p>

      <Code>infomap -v</Code>

      <p>
        See the{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.github.io/infomap/python"
        >
          Python API reference
        </Link>{" "}
        for package usage.
      </p>

      <Heading as="h2" size="md" mt={8} mb={6} id="HomebrewCli">
        Native CLI with Homebrew
      </Heading>

      <p>
        Use Homebrew if you want the native command-line tool without installing
        the Python package.
      </p>

      <Code>
        brew tap mapequation/infomap
        <br />
        brew install infomap
      </Code>

      <p>Or install directly in one command:</p>

      <Code>brew install mapequation/infomap/infomap</Code>

      <p>Upgrade with the normal Homebrew flow:</p>

      <Code>brew upgrade infomap</Code>

      <Heading as="h2" size="md" mt={8} mb={6} id="DownloadBinary">
        Standalone binaries
      </Heading>

      <p>
        Standalone binaries are useful when you want to download an executable
        directly. You can download binaries from the{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//github.com/mapequation/infomap/releases/latest"
        >
          latest release
        </Link>{" "}
        or use the direct links below. OpenMP builds may be faster on larger
        networks but require OpenMP runtime libraries: <code>libomp-dev</code>{" "}
        on Ubuntu and <code>libomp</code> on macOS.
      </p>

      <table>
        <thead>
          <tr>
            <th />
            <th>OpenMP</th>
            <th>Without OpenMP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <Icon as={FaWindows} color="blue.600" mr={2} />
              Windows
            </th>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win.zip">
                infomap-win.zip
              </a>
            </td>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-win-noomp.zip">
                infomap-win-noomp.zip
              </a>
            </td>
          </tr>
          <tr>
            <th>
              <Icon as={FaUbuntu} color="orange.500" mr={2} />
              Ubuntu
            </th>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu.zip">
                infomap-ubuntu.zip
              </a>
            </td>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-ubuntu-noomp.zip">
                infomap-ubuntu-noomp.zip
              </a>
            </td>
          </tr>
          <tr>
            <th>
              <Icon as={FaApple} color="black" mr={2} />
              macOS
            </th>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac.zip">
                infomap-mac.zip
              </a>
            </td>
            <td>
              <a href="//github.com/mapequation/infomap/releases/latest/download/infomap-mac-noomp.zip">
                infomap-mac-noomp.zip
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <Heading as="h2" size="md" mt={8} mb={6} id="LanguagePackages">
        Language packages
      </Heading>

      <Heading as="h3" size="sm" mt={6} mb={4} id="RPackage">
        R
      </Heading>

      <p>
        Pre-built R binaries are published on{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.r-universe.dev"
        >
          r-universe
        </Link>
        :
      </p>

      <Code>
        install.packages(
        <br />
        &nbsp;&nbsp;"infomap",
        <br />
        &nbsp;&nbsp;repos = c("https://mapequation.r-universe.dev",
        "https://cloud.r-project.org")
        <br />)
      </Code>

      <Heading as="h3" size="sm" mt={6} mb={4} id="JavaScriptPackage">
        JavaScript
      </Heading>

      <p>
        The browser worker package used by Infomap Online is published on{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//www.npmjs.com/package/@mapequation/infomap"
        >
          npm
        </Link>
        :
      </p>

      <Code>npm install @mapequation/infomap</Code>

      <Heading as="h2" size="md" mt={8} mb={6} id="Docker">
        Docker
      </Heading>

      <p>
        Multi-architecture images are published to GitHub Container Registry.
        Run the CLI image against files in the current directory with:
      </p>

      <Code>
        docker run -it --rm \<br />
        &nbsp;&nbsp;-v "$(pwd)":/data \<br />
        &nbsp;&nbsp;ghcr.io/mapequation/infomap:latest \<br />
        &nbsp;&nbsp;[infomap arguments]
      </Code>

      <Heading as="h2" size="md" mt={8} mb={6} id="CompilingFromSource">
        Build from source
      </Heading>

      <p>
        Building locally requires a working <code>gcc</code> or{" "}
        <code>clang</code> toolchain. Clone the repository and build the native
        CLI:
      </p>

      <Code>
        git clone git@github.com:mapequation/infomap.git
        <br />
        cd infomap
        <br />
        make build-native
      </Code>

      <p>
        On macOS, the default OpenMP-enabled build may require Homebrew{" "}
        <code>libomp</code>. If OpenMP is unavailable, build without it:
      </p>

      <Code>make build-native OPENMP=0</Code>

      <p>
        This creates the <code>Infomap</code> binary in the repository root.
        Show the available CLI options with:
      </p>

      <Code>./Infomap --help</Code>

      <Heading as="h2" size="md" mt={8} mb={6} id="Running">
        Run Infomap
      </Heading>

      <p>The command-line form is:</p>

      <Code>infomap [options] network_data destination</Code>

      <p>For example:</p>

      <Code>
        infomap network.net out
        <br />
        infomap --two-level --directed network.net out
      </Code>

      <p>List all available options with:</p>

      <Code>infomap --help</Code>
    </Container>
  );
};

export default InstallPage;
