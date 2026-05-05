import {
  Box,
  Link as CkLink,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";

const railItems = [
  { id: "WhenToUse", label: "When to use" },
  { id: "FlowPipeline", label: "Flow mapping" },
  { id: "RandomWalks", label: "Random walks" },
  { id: "Compression", label: "Compression" },
  { id: "MapEquation", label: "Map equation" },
  { id: "SearchAlgorithm", label: "Search algorithm" },
  { id: "NetworkModels", label: "Network models" },
  { kind: "heading", label: "Read next" },
  { id: "HowToCiteNext", label: "How to cite", href: "/references" },
];

const formulaTerms = [
  {
    term: "L(M)",
    text: "The lower bound on the per-step description length of the random walk for partition M.",
  },
  {
    term: "q_{\\curvearrowleft}H(\\mathcal{Q})",
    text: "The average cost of using the index codebook to name modules when flow enters them.",
  },
  {
    term: "p_{\\circlearrowright}^{i}H(\\mathcal{P}^{i})",
    text: "The average cost of using module i's codebook to name node visits and exits.",
  },
  {
    term: "\\min_M L(M)",
    text: "Infomap searches for the partition whose modular code compresses the flow best.",
  },
];

const algorithmSteps = [
  {
    title: "Start from singletons",
    text: "The two-level phase begins with each node in its own module, a high-codelength partition where almost every step crosses modules.",
  },
  {
    title: "Move nodes greedily",
    text: "In random order, Infomap tests moves to neighboring modules or a new singleton module and accepts moves that reduce codelength.",
  },
  {
    title: "Move modules as units",
    text: "Found modules are aggregated and moved together, repeating the same codelength-reducing logic at coarser scales.",
  },
  {
    title: "Fine- and coarse-tune",
    text: "Fine-tuning revisits individual nodes; coarse-tuning splits modules into submodules and moves those groups to avoid local minima.",
  },
  {
    title: "Add levels when useful",
    text: "The multilevel phase adds extra index codebooks only when a deeper hierarchy further compresses inter-module flow.",
  },
  {
    title: "Repeat trials",
    text: "Because the solution landscape is non-convex, multiple trials with different random seeds help find shorter codelengths.",
  },
];

const networkModels = [
  {
    title: "Weighted and directed links",
    text: "Weights and directions often carry essential flow information, so the map equation uses them instead of discarding them.",
    href: "/formats#InputLinkList",
  },
  {
    title: "Hierarchical modules",
    text: "If flows are organized at several scales, multilevel Infomap can add nested codebooks instead of forcing one flat partition.",
    href: "/formats#OutputTree",
  },
  {
    title: "Memory and state networks",
    text: "State nodes represent higher-order dependencies, where the next step depends on previous steps or context.",
    href: "/formats#InputStates",
  },
  {
    title: "Multilayer networks",
    text: "Layer-aware input distinguishes time, mode, or context while still allowing flow through shared physical nodes.",
    href: "/formats#InputMultilayer",
  },
  {
    title: "Bipartite networks",
    text: "Bipartite-aware coding can exploit alternating visits between two node types instead of projecting the network first.",
    href: "/formats#InputBipartite",
  },
  {
    title: "Observed or modeled flows",
    text: "If flows are observed, use them directly; otherwise a random walk turns network structure into an implied flow to analyze.",
    href: "/formats",
  },
];

const pipelineSteps = [
  {
    title: "Choose a network representation",
    text: "Represent the system at the level your question needs: weighted or directed links, multilayer data, state nodes, or bipartite structure.",
  },
  {
    title: "Model the flow",
    text: "Use observed flow when available. Otherwise derive an implied random-walk flow from the network; teleportation is only there to make directed flow ergodic.",
  },
  {
    title: "Map the flow",
    text: "Minimize the map equation to find modules where the walker remains long enough to make a modular description shorter.",
  },
];

function SectionCard({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      as="section"
      id={id}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={{ base: 5, md: 6 }}
      scrollMarginTop="6rem"
    >
      <Text
        color="gray.500"
        fontFamily="monospace"
        fontSize="xs"
        letterSpacing="0.1em"
        textTransform="uppercase"
        mb={2}
      >
        {eyebrow}
      </Text>
      <Heading as="h2" size="md" mb={3}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

const HowItWorksPage: NextPage = () => {
  const [active, setActive] = useState("WhenToUse");

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
                  href={item.id ? `#${item.id}` : "#"}
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
                  onClick={() => {
                    if (item.id) setActive(item.id);
                  }}
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
          <Heading as="h1" size="lg" mb={4} id="HowItWorks">
            How Infomap works
          </Heading>

          <Text
            color="gray.700"
            fontSize={{ base: "md", md: "lg" }}
            maxW="44rem"
            mb={8}
          >
            Infomap is a flow-based community detection method. It asks how a
            process moves through a network, then finds modules that make that
            movement easier to describe.
          </Text>

          <Stack gap={5}>
            <SectionCard
              id="WhenToUse"
              eyebrow="Scope"
              title="Use Infomap when communities should explain flow"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  bg="gray.50"
                >
                  <Heading as="h3" size="sm" mb={2}>
                    Good fit
                  </Heading>
                  <Text color="gray.600" fontSize="sm" mb={0}>
                    Use Infomap when links represent movement, citations,
                    traffic, communication, transitions, or interactions that
                    can induce a process on the network. The modules then
                    summarize where that process tends to remain.
                  </Text>
                </Box>
                <Box
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                >
                  <Heading as="h3" size="sm" mb={2}>
                    Match the question
                  </Heading>
                  <Text color="gray.600" fontSize="sm" mb={0}>
                    The random walker does not have to be a literal moving
                    object. It is a useful proxy for finding modular structure
                    in general. If your question is only about planted groups or
                    pairwise similarity, compare with statistical or generative
                    clustering models too.
                  </Text>
                </Box>
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="FlowPipeline"
              eyebrow="Workflow"
              title="Map equation analysis has three choices"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {pipelineSteps.map((step, index) => (
                  <Box
                    key={step.title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    bg={index === 1 ? "gray.50" : "white"}
                  >
                    <Text
                      color="gray.500"
                      fontFamily="monospace"
                      fontSize="xs"
                      mb={2}
                    >
                      0{index + 1}
                    </Text>
                    <Heading as="h3" size="sm" mb={2}>
                      {step.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {step.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="RandomWalks"
              eyebrow="Intuition"
              title="Communities are regions where flow lingers"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {[
                  [
                    "Flow follows links",
                    "When real flows are not observed, Infomap can use a random walk to translate link structure into an implied flow.",
                  ],
                  [
                    "Flow lingers in regions",
                    "A flow module is a group of nodes where observed or implied flow tends to stay for a relatively long time.",
                  ],
                  [
                    "Flow also reflects structure",
                    "The flow model is a lens on the network: structure shapes where flow can persist, and persistent flow highlights structure.",
                  ],
                ].map(([title, text], index) => (
                  <Box
                    key={title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    bg={index === 1 ? "gray.50" : "white"}
                  >
                    <Text
                      color="gray.500"
                      fontFamily="monospace"
                      fontSize="xs"
                      mb={2}
                    >
                      0{index + 1}
                    </Text>
                    <Heading as="h3" size="sm" mb={2}>
                      {title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="Compression"
              eyebrow="Compression"
              title="A good map compresses without hiding structure"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {[
                  [
                    "One global codebook",
                    "Naming every node globally is simple, but it does not highlight important structures and can waste bits when flow is regional.",
                  ],
                  [
                    "Local codebooks",
                    "Modules get unique names, while node names are reused inside modules. Exit codes mark when flow leaves a module.",
                  ],
                  [
                    "Best partition",
                    "The best partition is the one that balances compression and map-like structure by minimizing expected codelength.",
                  ],
                ].map(([title, text], index) => (
                  <Box
                    key={title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    bg={index === 1 ? "gray.50" : "white"}
                  >
                    <Text
                      color="gray.500"
                      fontFamily="monospace"
                      fontSize="xs"
                      mb={2}
                    >
                      0{index + 1}
                    </Text>
                    <Heading as="h3" size="sm" mb={2}>
                      {title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="MapEquation"
              eyebrow="Formula"
              title="The map equation scores a partition"
            >
              <Grid
                templateColumns={{ base: "minmax(0, 1fr)", md: "3fr 2fr" }}
                gap={5}
                alignItems="stretch"
                minW={0}
              >
                <Stack gap={4} minW={0}>
                  <Box
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={{ base: 4, md: 5 }}
                    minH={{ md: "11rem" }}
                    display="flex"
                    alignItems="center"
                    justifyContent={{ base: "flex-start", sm: "center" }}
                    overflowX="auto"
                    textAlign="center"
                    fontSize={{ base: "0.78rem", sm: "sm", md: "lg" }}
                    maxW="100%"
                  >
                    <TeX
                      math="L(M) = q_{\curvearrowleft}H(\mathcal{Q}) + \sum_{i = 1}^{m}p_{\circlearrowright}^{i}H(\mathcal{P}^{i})"
                      block
                    />
                  </Box>
                  <Text color="gray.600" fontSize="sm" mb={0}>
                    The entropy terms come from source coding: common events can
                    have shorter codewords than rare events. A good partition
                    makes codebook use predictable by matching the module
                    boundaries to persistent flow.
                  </Text>
                </Stack>
                <Stack gap={3}>
                  {formulaTerms.map((item) => (
                    <Box
                      key={item.term}
                      borderBottomWidth="1px"
                      borderBottomColor="gray.200"
                      pb={3}
                    >
                      <Text color="gray.900" fontWeight={700} mb={1}>
                        <TeX math={item.term} />
                      </Text>
                      <Text color="gray.600" fontSize="sm" mb={0}>
                        {item.text}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </SectionCard>

            <SectionCard
              id="SearchAlgorithm"
              eyebrow="Algorithm"
              title="Infomap searches for the shortest codelength"
            >
              <Stack gap={0} borderTopWidth="1px" borderTopColor="gray.200">
                {algorithmSteps.map((step, index) => (
                  <Grid
                    key={step.title}
                    templateColumns={{ base: "1fr", md: "5rem 1fr" }}
                    gap={{ base: 1, md: 4 }}
                    py={4}
                    borderBottomWidth="1px"
                    borderBottomColor="gray.200"
                  >
                    <Text
                      color="gray.500"
                      fontFamily="monospace"
                      fontSize="xs"
                      mb={0}
                    >
                      STEP {index + 1}
                    </Text>
                    <Box>
                      <Heading as="h3" size="sm" mb={1}>
                        {step.title}
                      </Heading>
                      <Text color="gray.600" fontSize="sm" mb={0}>
                        {step.text}
                      </Text>
                    </Box>
                  </Grid>
                ))}
              </Stack>
              <Text color="gray.600" fontSize="sm" mt={4} mb={0}>
                Infomap optimizes the map equation. It favors partitions where
                observed or implied flow stays within modules for long stretches
                and crosses module boundaries infrequently. In practice, that
                can reveal structure even when the data was not generated by an
                explicit flow process.
              </Text>
            </SectionCard>

            <SectionCard
              id="NetworkModels"
              eyebrow="Models"
              title="The same idea extends to richer network data"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {networkModels.map((model) => (
                  <Box
                    key={model.title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    <Heading as="h3" size="sm" mb={2}>
                      {model.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {model.text}
                    </Text>
                    <CkLink href={model.href} fontSize="sm" fontWeight={600}>
                      Related format <LuArrowRight />
                    </CkLink>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

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
                  <NextLink href="/references">
                    How to cite Infomap <LuArrowRight />
                  </NextLink>
                </CkLink>
              </Flex>
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
};

export default HowItWorksPage;
