import {
  Box,
  Button,
  Link as CkLink,
  Container,
  chakra,
  Flex,
  Grid,
  Heading,
  Icon,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useState } from "react";
import {
  LuArrowRight,
  LuCheck,
  LuCopy,
  LuMonitor,
  LuTerminal,
} from "react-icons/lu";

const installMethods = [
  {
    id: "PythonPackage",
    label: "Python",
    title: "Python package",
    recommended: true,
    description:
      "Use this if you want the Python API or the easiest way to install the infomap command-line tool.",
    tags: ["Python 3.11+", "macOS", "Linux", "Windows"],
    command: "pip install infomap",
    commands: [
      ["Upgrade an existing installation", "pip install --upgrade infomap"],
      ["Verify the installation", "infomap -v"],
    ],
    links: [
      ["PyPI", "//pypi.org/project/infomap/"],
      ["Python API reference", "//mapequation.github.io/infomap/python"],
    ],
  },
  {
    id: "HomebrewCli",
    label: "CLI",
    title: "Native CLI with Homebrew",
    description:
      "Use Homebrew if you want the native command-line tool without installing the Python package.",
    tags: ["macOS", "Linux", "CLI"],
    command: "brew install mapequation/infomap/infomap",
    commands: [
      [
        "Tap and install separately",
        "brew tap mapequation/infomap\nbrew install infomap",
      ],
      ["Upgrade with the normal Homebrew flow", "brew upgrade infomap"],
    ],
  },
  {
    id: "DownloadBinary",
    label: "Binaries",
    title: "Standalone binaries",
    description:
      "Use a standalone binary when you want to download an executable directly. OpenMP builds may be faster on larger networks but require OpenMP runtime libraries.",
    tags: ["macOS", "Linux", "Windows", "OpenMP"],
    custom: "binaries",
    links: [
      ["Latest release", "//github.com/mapequation/infomap/releases/latest"],
    ],
  },
  {
    id: "RPackage",
    label: "R",
    title: "R package",
    description: "Pre-built R binaries are published on r-universe.",
    tags: ["R", "r-universe"],
    command:
      'install.packages("infomap", repos = c("https://mapequation.r-universe.dev", "https://cloud.r-project.org"))',
    links: [["r-universe", "//mapequation.r-universe.dev/infomap"]],
  },
  {
    id: "JavaScriptPackage",
    label: "TypeScript",
    title: "TypeScript package",
    description:
      "Use the WebAssembly worker package to embed Infomap in browser and TypeScript applications.",
    tags: ["TypeScript", "NPM"],
    command: "npm install @mapequation/infomap",
    links: [["npm", "//www.npmjs.com/package/@mapequation/infomap"]],
  },
  {
    id: "Docker",
    label: "Docker",
    title: "Docker",
    description:
      "Use the GitHub Container Registry image for reproducible CLI runs in CI or shared compute environments.",
    tags: ["Docker", "amd64", "arm64"],
    command:
      'docker run -it --rm -v "$(pwd)":/data ghcr.io/mapequation/infomap:latest [infomap arguments]',
  },
  {
    id: "CompilingFromSource",
    label: "Source",
    title: "Build from source",
    description:
      "Build locally when you want to modify Infomap or compile with custom flags. Requires a working gcc or clang toolchain.",
    tags: ["gcc", "clang"],
    command:
      "git clone git@github.com:mapequation/infomap.git\ncd infomap\nmake build-native",
    commands: [
      ["Build without OpenMP", "make build-native OPENMP=0"],
      ["Show available CLI options", "./Infomap --help"],
    ],
  },
];

type RailItem =
  | { kind: "heading"; label: string; id?: never; href?: never }
  | { kind?: never; id: string; label: string; href?: string };

const railItems: RailItem[] = [
  ...installMethods.map(({ id, label }) => ({ id, label })),
  { id: "Running", label: "Run Infomap" },
  { kind: "heading", label: "Read next" },
  { id: "FormatsNext", label: "Formats", href: "/formats" },
];

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(children) ? children.join("") : String(children);

  return (
    <Box position="relative">
      <Box
        bg="gray.100"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflowX="auto"
      >
        <chakra.pre
          m={0}
          fontFamily="monospace"
          fontSize="sm"
          lineHeight={1.6}
          whiteSpace="pre-wrap"
        >
          {children}
        </chakra.pre>
      </Box>
      <Button
        type="button"
        variant="surface"
        size="xs"
        position="absolute"
        top={2}
        right={2}
        onClick={async () => {
          await navigator?.clipboard?.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        }}
      >
        {copied ? <LuCheck /> : <LuCopy />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </Box>
  );
}

function MethodCard({ method }) {
  return (
    <Box
      as="article"
      id={method.id}
      bg="white"
      borderWidth="1px"
      borderColor={method.recommended ? "gray.300" : "gray.200"}
      borderRadius="md"
      p={{ base: 5, md: 6 }}
      scrollMarginTop="6rem"
      position="relative"
    >
      {method.recommended && (
        <Box
          position="absolute"
          top="-0.7rem"
          left={5}
          borderRadius="sm"
          backgroundColor="white"
          borderColor="gray.300"
          borderWidth="1px"
          px={2}
          py={1}
          fontFamily="monospace"
          fontSize="xs"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Most users start here
        </Box>
      )}

      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "baseline" }}
        gap={3}
        direction={{ base: "column", md: "row" }}
        mb={2}
      >
        <Heading as="h2" size="md">
          {method.title}
        </Heading>
        <Flex gap={2} flexWrap="wrap">
          {method.tags.map((tag) => (
            <Box
              key={tag}
              as="span"
              bg="gray.100"
              color="gray.600"
              borderRadius="sm"
              px={2}
              py={1}
              fontFamily="monospace"
              fontSize="xs"
            >
              {tag}
            </Box>
          ))}
        </Flex>
      </Flex>

      <Text color="gray.600" fontSize="sm">
        {method.description}
      </Text>

      {method.custom === "binaries" ? (
        <BinaryTable />
      ) : (
        <CodeBlock>{method.command}</CodeBlock>
      )}

      {method.commands?.length > 0 && (
        <Box mt={3}>
          <Stack gap={4} mt={3}>
            {method.commands.map(([title, command]) => (
              <Box key={title}>
                <Text color="gray.600" fontSize="sm" mb={2}>
                  {title}
                </Text>
                <CodeBlock>{command}</CodeBlock>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {method.links?.length > 0 && (
        <Flex gap={4} flexWrap="wrap" mt={4} pt={4} borderTopWidth="1px">
          {method.links.map(([label, href]) => (
            <CkLink
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              fontWeight={600}
            >
              {label} <LuArrowRight />
            </CkLink>
          ))}
        </Flex>
      )}
    </Box>
  );
}

function BinaryTable() {
  return (
    <Box overflowX="auto">
      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader />
            <Table.ColumnHeader>OpenMP</Table.ColumnHeader>
            <Table.ColumnHeader>Without OpenMP</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Icon as={LuMonitor} color="gray.600" mr={2} />
              Windows
            </Table.Cell>
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
            <Table.Cell>
              <Icon as={LuMonitor} color="gray.600" mr={2} />
              macOS
            </Table.Cell>
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
          <Table.Row>
            <Table.Cell>
              <Icon as={LuTerminal} color="gray.600" mr={2} />
              Ubuntu
            </Table.Cell>
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
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

const InstallPage: NextPage = () => {
  const [active, setActive] = useState("PythonPackage");

  return (
    <Container>
      <Grid
        templateColumns={{ base: "1fr", lg: "13rem 1fr" }}
        gap={{ base: 8, lg: 12 }}
        alignItems="start"
        mt={8}
      >
        <Box
          as="aside"
          display={{ base: "none", lg: "block" }}
          position="sticky"
          top="5rem"
        >
          <Text
            color="gray.500"
            fontFamily="monospace"
            fontSize="xs"
            letterSpacing="0.1em"
            textTransform="uppercase"
            mb={3}
          >
            On this page
          </Text>
          <Box borderLeftWidth="1px" borderLeftColor="gray.300">
            {railItems.map((item, index) =>
              item.kind === "heading" ? (
                <Text
                  key={`${item.label}-${index}`}
                  color="gray.500"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  px={4}
                  pt={4}
                  pb={1}
                  mb={0}
                >
                  {item.label}
                </Text>
              ) : item.href ? (
                <CkLink
                  key={item.id}
                  asChild
                  display="block"
                  color={active === item.id ? "gray.900" : "gray.500"}
                  fontWeight={active === item.id ? 700 : 400}
                  borderLeftWidth="2px"
                  borderLeftColor={
                    active === item.id ? "red.600" : "transparent"
                  }
                  ml="-1px"
                  px={4}
                  py={1.5}
                  fontSize="sm"
                  textDecoration="none"
                >
                  <NextLink href={item.href}>{item.label}</NextLink>
                </CkLink>
              ) : (
                <CkLink
                  key={item.id}
                  href={`#${item.id}`}
                  display="block"
                  color={active === item.id ? "gray.900" : "gray.500"}
                  fontWeight={active === item.id ? 700 : 400}
                  borderLeftWidth="2px"
                  borderLeftColor={
                    active === item.id ? "red.600" : "transparent"
                  }
                  ml="-1px"
                  px={4}
                  py={1.5}
                  fontSize="sm"
                  textDecoration="none"
                  onClick={() => setActive(item.id)}
                >
                  {item.label}
                </CkLink>
              ),
            )}
          </Box>
        </Box>

        <Box as="main">
          <Text color="gray.500" fontSize="sm" mb={2}>
            Documentation
          </Text>
          <Heading as="h1" size="lg" mb={4} id="Install">
            Install Infomap
          </Heading>

          <Text
            color="gray.700"
            fontSize={{ base: "md", md: "lg" }}
            maxW="42rem"
          >
            For most users, the Python package is the best starting point: it
            installs both the Python API and the <code>infomap</code>{" "}
            command-line tool. If you only need a native CLI, use Homebrew or a
            standalone binary.
          </Text>

          <Flex gap={2} flexWrap="wrap" mb={8}>
            {["Python 3.11+", "CLI included", "macOS / Linux / Windows"].map(
              (tag) => (
                <Box
                  key={tag}
                  as="span"
                  bg="gray.100"
                  color="gray.600"
                  borderRadius="sm"
                  px={2}
                  py={1}
                  fontFamily="monospace"
                  fontSize="xs"
                >
                  {tag}
                </Box>
              ),
            )}
          </Flex>

          <Stack gap={6}>
            {installMethods.map((method) => (
              <MethodCard key={method.id} method={method} />
            ))}
          </Stack>

          <Box
            as="section"
            id="Running"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={{ base: 5, md: 6 }}
            mt={8}
            mb={12}
            scrollMarginTop="6rem"
          >
            <Heading as="h2" size="md" mb={3}>
              Run Infomap
            </Heading>
            <Text color="gray.600">
              After installation, the command-line form is:
            </Text>
            <CodeBlock>infomap [options] network_data destination</CodeBlock>

            <Text color="gray.600" mt={5}>
              For example:
            </Text>
            <CodeBlock>
              {
                "infomap network.net out\ninfomap --two-level --directed network.net out"
              }
            </CodeBlock>

            <Text color="gray.600" mt={5}>
              List all available options with:
            </Text>
            <CodeBlock>infomap --help</CodeBlock>
          </Box>

          <Box
            as="section"
            id="ReadNext"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={{ base: 5, md: 6 }}
            mb={12}
            scrollMarginTop="6rem"
          >
            <Heading as="h2" size="md" mb={3}>
              Read next
            </Heading>
            <Flex gap={4} flexWrap="wrap">
              <CkLink asChild fontWeight={600}>
                <NextLink href="/formats">
                  Input and output formats <LuArrowRight />
                </NextLink>
              </CkLink>
            </Flex>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default InstallPage;
