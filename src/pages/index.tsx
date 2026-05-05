import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import type { NextPage } from "next";
import NextLink from "next/link";
import { LuArrowRight } from "react-icons/lu";
import FlowDemo from "../features/landing/FlowDemo";
import InstallCard from "../features/landing/InstallCard";

const PortalEyebrow = ({ children }: { children: React.ReactNode }) => (
  <Text
    color="gray.500"
    fontFamily="monospace"
    fontSize="xs"
    letterSpacing="0.1em"
    textTransform="uppercase"
    mb={3}
  >
    {children}
  </Text>
);

const PortalSection = ({
  id,
  eyebrow,
  title,
  href,
  linkText,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  linkText?: string;
  children: React.ReactNode;
}) => (
  <Box as="section" id={id} mt={{ base: 10, md: 12 }}>
    <PortalEyebrow>{eyebrow}</PortalEyebrow>
    <Flex
      align={{ base: "flex-start", md: "baseline" }}
      justify="space-between"
      gap={4}
      direction={{ base: "column", md: "row" }}
      mb={5}
    >
      <Heading as="h2" size="md">
        {title}
      </Heading>
      {href && linkText && (
        <Link asChild fontSize="sm" fontWeight={600}>
          <NextLink href={href}>
            {linkText} <LuArrowRight />
          </NextLink>
        </Link>
      )}
    </Flex>
    {children}
  </Box>
);

const formatGroups = [
  {
    label: "Inputs",
    formats: ["Link list", "Pajek", "Bipartite", "Multilayer", "State network"],
  },
  {
    label: "Outputs",
    formats: ["Cluster file", "Tree", "Flow tree", "Newick", "JSON"],
  },
];

const pinRedButtonProps = {
  bg: "#b22222",
  color: "white",
  _hover: { bg: "#971d1d" },
  _active: { bg: "#7f1818" },
};

const Home: NextPage = () => {
  return (
    <Container>
      <SimpleGrid
        as="section"
        columns={{ base: 1, lg: 2 }}
        gap={{ base: 8, lg: 12 }}
        alignItems="start"
        mt={{ base: 8, md: 12 }}
      >
        <Stack align="flex-start" gap={5}>
          <PortalEyebrow>Network community detection</PortalEyebrow>
          <Heading
            as="h1"
            size="4xl"
            id="InfomapOnline"
            maxW="13em"
            lineHeight={1.12}
          >
            Network community detection using the Map Equation framework.
          </Heading>
          <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} mb={0}>
            Infomap compresses the description of flow on a network. Good
            modules are groups where a random walker tends to stay for a long
            time before moving elsewhere.
          </Text>

          <Flex gap={3} flexWrap="wrap">
            <Button asChild size="lg" {...pinRedButtonProps}>
              <NextLink href="/online">
                Open Workbench <LuArrowRight />
              </NextLink>
            </Button>
          </Flex>
        </Stack>

        <Box my={8} mx={50}>
          <FlowDemo />
        </Box>
      </SimpleGrid>

      <PortalSection
        id="install"
        eyebrow="Get started"
        title="Install"
        href="/install"
        linkText="Full install guide"
      >
        <InstallCard />
      </PortalSection>

      <PortalSection
        id="how"
        eyebrow="The method"
        title="How it works"
        href="/how-it-works"
        linkText="How it works"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={4}>
          {[
            [
              "Random walker",
              "A proxy for flow. Where the walker dwells, real-world flow tends to dwell.",
            ],
            [
              "Codebooks",
              "One index codebook plus one per module. Cheap inside, expensive to leave.",
            ],
            [
              "Map equation",
              "The average description length. Infomap searches for the shortest one.",
            ],
          ].map(([title, body]) => (
            <Box
              key={title}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={5}
            >
              <Heading as="h3" size="sm" mb={2}>
                {title}
              </Heading>
              <Text color="gray.600" fontSize="sm" mb={0}>
                {body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          px={{ base: 4, md: 6 }}
          py={5}
          textAlign="center"
          style={{ fontSize: "1.5em" }}
        >
          <TeX
            math="L(M) = q_{\curvearrowleft}H(\mathcal{Q}) + \sum_{i = 1}^{m}p_{\circlearrowright}^{i}H(\mathcal{P}^{i})"
            block
          />
        </Box>
      </PortalSection>

      <PortalSection
        id="formats"
        eyebrow="Data"
        title="Input & output formats"
        href="/formats"
        linkText="All formats"
      >
        <Stack
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={5}
          gap={4}
        >
          <Text color="gray.700" mb={0}>
            Use plain-text network inputs and choose outputs for downstream
            analysis, from compact cluster assignments to full hierarchical
            trees.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {formatGroups.map(({ label, formats }) => (
              <Box key={label}>
                <Text
                  color="gray.500"
                  fontFamily="monospace"
                  fontSize="xs"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb={2}
                >
                  {label}
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {formats.map((format) => (
                    <Box
                      key={format}
                      as="span"
                      bg="gray.100"
                      color="gray.700"
                      borderRadius="sm"
                      px={3}
                      py={1}
                      fontSize="sm"
                    >
                      {format}
                    </Box>
                  ))}
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </PortalSection>

      <PortalSection
        id="try"
        eyebrow="No install needed"
        title="Run it in your browser"
      >
        <Flex
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={{ base: 5, md: 6 }}
          gap={{ base: 5, md: 8 }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Box>
            <Text color="gray.700" mb={0} maxW="48rem">
              Drop a network file or pick an example. Everything runs locally in
              your browser for networks up to ~10k nodes.
            </Text>
          </Box>
          <Button asChild size="lg" flexShrink={0} {...pinRedButtonProps}>
            <NextLink href="/online">
              Open Workbench <LuArrowRight />
            </NextLink>
          </Button>
        </Flex>
      </PortalSection>

      <PortalSection
        id="cite"
        eyebrow="Reference"
        title="How to cite"
        href="/references"
        linkText="All citation formats"
      >
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={{ base: 5, md: 6 }}
          mb={{ base: 10, md: 14 }}
        >
          <Heading as="h3" size="sm" mb={2}>
            Cite the software and the method
          </Heading>
          <Text color="gray.600" maxW="42rem" mb={4}>
            Most papers using Infomap cite both the software package, which
            credits the implementation and version, and the map equation paper,
            which credits the flow-based community detection method.
          </Text>
          <Link asChild fontSize="sm" fontWeight={600}>
            <NextLink href="/references">
              Get BibTeX, RIS, APA, MLA, and DOI links <LuArrowRight />
            </NextLink>
          </Link>
        </Box>
      </PortalSection>
    </Container>
  );
};

export default Home;
