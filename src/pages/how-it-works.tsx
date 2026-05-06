import {
  Box,
  Button,
  Link as CkLink,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import {
  LuArrowRight,
  LuPause,
  LuPlay,
  LuRotateCcw,
  LuStepBack,
  LuStepForward,
} from "react-icons/lu";
import traceDemoManifest from "../../public/trace-demo/manifest.json";

type RailItem =
  | { kind: "heading"; label: string; id?: never; href?: never }
  | { id: string; label: string; href?: string; kind?: never };

const railItems: RailItem[] = [
  { id: "Fit", label: "Fit" },
  { id: "FlowIntuition", label: "Flow intuition" },
  { id: "NetworkMap", label: "Network map" },
  { id: "ThreeChoices", label: "Three choices" },
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
    text: "The expected per-step description length for a random walk under partition M.",
  },
  {
    term: "q_{\\curvearrowleft}H(\\mathcal{Q})",
    text: "The cost of using an index codebook when flow moves between modules.",
  },
  {
    term: "p_{\\circlearrowright}^{i}H(\\mathcal{P}^{i})",
    text: "The cost of using module i's local codebook to describe node visits and exits.",
  },
  {
    term: "\\min_M L(M)",
    text: "Infomap searches for the map whose modular code gives the shortest useful flow description.",
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
    title: "Fine tune nodes",
    text: "Fine-tuning revisits individual nodes inside the current partition and keeps only moves that further reduce codelength.",
  },
  {
    title: "Coarse tune groups",
    text: "Coarse-tuning splits modules into submodules and tests moving those groups to avoid local minima.",
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

type TraceFrame = (typeof traceDemoManifest.frames)[number];

function activeAlgorithmStepIndex(frame: TraceFrame) {
  if (frame.title === "Start from singletons") return 0;
  if (frame.phase === "Move nodes greedily") return 1;
  if (frame.phase === "Aggregate modules") return 2;
  if (frame.phase === "Fine tune") return 3;
  if (frame.phase === "Coarse tune") return 4;
  if (frame.phase === "Trial") return 6;
  return -1;
}

const networkModels = [
  {
    title: "Directed and weighted links",
    text: "Use direction and weight when they should constrain where derived flow can move and how strongly links should guide it.",
    href: "/formats#InputLinkList",
    linkText: "Link-list formats",
  },
  {
    title: "Hierarchical modules",
    text: "Use hierarchical output when modular structure exists at several scales and a flat partition would hide important nested groups.",
    href: "/formats#OutputTree",
    linkText: "Tree outputs",
  },
  {
    title: "Memory and state networks",
    text: "Use state nodes when the next step depends on previous steps, context, layer, or another hidden state.",
    href: "/formats#InputStates",
    linkText: "State input",
  },
  {
    title: "Multilayer networks",
    text: "Use multilayer input when interactions depend on time, mode, layer, or context but still connect through shared physical nodes.",
    href: "/formats#InputMultilayer",
    linkText: "Multilayer input",
  },
  {
    title: "Bipartite networks",
    text: "Use bipartite input when two node types alternate naturally and a one-mode projection would distort the structure.",
    href: "/formats#InputBipartite",
    linkText: "Bipartite input",
  },
  {
    title: "Regularized map equation",
    text: "Use regularization for noisy, sparse, or incomplete networks where missing links can otherwise create spurious small modules.",
    href: "/online",
    linkText: "Workbench parameters",
  },
];

const pipelineSteps = [
  {
    title: "Represent the network",
    text: "Choose the structure your data needs: undirected, directed, weighted, bipartite, multilayer, state, or memory network.",
  },
  {
    title: "Choose how Infomap derives flow",
    text: "In practice, this means settings such as --directed, --flow-model, teleportation behavior, multilayer relaxation, Markov time, or --regularized for noisy or incomplete networks.",
  },
  {
    title: "Map the flow",
    text: "Infomap searches for communities and hierarchies that give the shortest useful description of the derived flow.",
  },
];

const fitCards = [
  {
    title: "Explicit flow",
    text: "Traffic, mobility, transactions, web navigation, messages, or other measured transitions through a system.",
  },
  {
    title: "Derived flow",
    text: "Citation networks, knowledge graphs, biological interactions, dependencies, and other networks where topology guides a random walk.",
  },
  {
    title: "Similarity and correlation data",
    text: "Gene co-expression, neuroscience, ecology, molecular similarity, or other high-dimensional data represented as similarity networks.",
  },
  {
    title: "Topology and benchmarks",
    text: "LFR-style planted communities and other modular networks where flow over topology can reveal the underlying organization.",
  },
];

const flowIntuitionCards = [
  {
    title: "Flow follows representation",
    text: "Direction, weight, bipartite structure, layers, state nodes, and parameters determine how Infomap interprets links as flow.",
  },
  {
    title: "Flow gets retained",
    text: "A module is a region where derived or observed flow tends to circulate before moving elsewhere.",
  },
  {
    title: "Flow reveals structure",
    text: "The flow does not need to be a literal object. It is a lens for finding modular organization in topology, similarity, or interaction data.",
  },
];

const networkMapItems = [
  {
    label: "Before",
    title: "A dense network of nodes and links",
    text: "The raw graph can hide the organization researchers care about, especially when thousands or millions of links overlap.",
  },
  {
    label: "After",
    title: "A readable map of communities and relationships",
    text: "The result highlights communities, bridges, nested modules, and flow between groups without pretending every detail is equally important.",
  },
];

const compressionCards = [
  {
    title: "Global names are expensive",
    text: "Naming every node from one global codebook is simple, but it misses repeated local structure when flow is regional.",
  },
  {
    title: "Local names reuse context",
    text: "Modules get local codebooks. Node names can be reused inside modules, and exit codes mark when flow changes context.",
  },
  {
    title: "The best map is concise",
    text: "Infomap balances simplicity and detail by searching for the partition with the shortest expected codelength.",
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

function AlgorithmTraceDemo({
  activeFrame,
  setActiveFrame,
}: {
  activeFrame: number;
  setActiveFrame: React.Dispatch<React.SetStateAction<number>>;
}) {
  const frames = traceDemoManifest.frames;
  const [isPlaying, setIsPlaying] = useState(false);
  const frame = frames[activeFrame];
  const isAtEnd = activeFrame === frames.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setActiveFrame((current) => {
        if (current === frames.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1100);
    return () => window.clearInterval(id);
  }, [frames.length, isPlaying]);

  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" mt={5}>
      <Box bg="gray.50" borderBottomWidth="1px" borderBottomColor="gray.200">
        <img
          src={frame.src}
          alt={frame.title}
          style={{
            aspectRatio: "800 / 640",
            display: "block",
            maxHeight: "68vh",
            objectFit: "contain",
            width: "100%",
          }}
        />
      </Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={3}
        p={4}
      >
        <Box minW={0}>
          <Text color="gray.500" fontFamily="monospace" fontSize="xs" mb={1}>
            {activeFrame + 1} / {frames.length} · {frame.phase}
          </Text>
          <Heading as="h3" size="sm" mb={1}>
            {frame.title}
          </Heading>
          <Text color="gray.600" fontSize="sm" mb={0}>
            {frame.description}
          </Text>
        </Box>
        <HStack gap={2} flexShrink={0}>
          <Button
            aria-label="Previous frame"
            title="Previous frame"
            size="sm"
            variant="outline"
            disabled={activeFrame === 0}
            onClick={() =>
              setActiveFrame((current) => Math.max(0, current - 1))
            }
          >
            <LuStepBack />
          </Button>
          <Button
            aria-label={
              isAtEnd
                ? "Restart animation"
                : isPlaying
                  ? "Pause animation"
                  : "Play animation"
            }
            title={
              isAtEnd
                ? "Restart animation"
                : isPlaying
                  ? "Pause animation"
                  : "Play animation"
            }
            size="sm"
            variant="outline"
            onClick={() => {
              if (isAtEnd) {
                setIsPlaying(false);
                setActiveFrame(0);
                return;
              }
              setIsPlaying((playing) => !playing);
            }}
          >
            {isAtEnd ? <LuRotateCcw /> : isPlaying ? <LuPause /> : <LuPlay />}
          </Button>
          <Button
            aria-label="Next frame"
            title="Next frame"
            size="sm"
            variant="outline"
            disabled={activeFrame === frames.length - 1}
            onClick={() =>
              setActiveFrame((current) =>
                Math.min(frames.length - 1, current + 1),
              )
            }
          >
            <LuStepForward />
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}

const HowItWorksPage: NextPage = () => {
  const [active, setActive] = useState("Fit");
  const [traceFrame, setTraceFrame] = useState(0);
  const activeTraceStep = activeAlgorithmStepIndex(
    traceDemoManifest.frames[traceFrame],
  );

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
            How Infomap maps networks into communities
          </Heading>

          <Stack gap={4} maxW="46rem" mb={8}>
            <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} mb={0}>
              A network is often not enough. Nodes and links can represent a
              complex system, but large networks quickly become too dense to
              interpret directly.
            </Text>
            <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} mb={0}>
              Infomap turns networks into maps of communities, bridges,
              hierarchies, and relationships between groups. It does this by
              deriving flow from the network and finding where that flow is
              retained.
            </Text>
          </Stack>

          <Stack gap={5}>
            <SectionCard
              id="Fit"
              eyebrow="Fit"
              title="When Infomap is a strong choice"
            >
              <Text color="gray.600" fontSize="sm" maxW="42rem">
                Infomap is strongest when communities should capture how a
                process can move, persist, or be described on a network. That
                includes explicit flows, but also derived flows over topology,
                similarity, correlation, and interaction data.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {fitCards.map((card, index) => (
                  <Box
                    key={card.title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    bg={index === 1 ? "gray.50" : "white"}
                  >
                    <Heading as="h3" size="sm" mb={2}>
                      {card.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {card.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="FlowIntuition"
              eyebrow="Intuition"
              title="Communities are regions where flow gets retained"
            >
              <Stack gap={3} maxW="44rem" mb={5}>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  Imagine following one unit of activity through a network: a
                  click, citation, message, transaction, visit, or modeled
                  random walker. If it keeps circulating inside the same region
                  before moving elsewhere, that region is likely to be a
                  meaningful community.
                </Text>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  The flow does not need to be a literal moving object. A random
                  walk can use topology, weights, direction, similarity, or
                  interaction structure as a lens for revealing modular
                  organization.
                </Text>
              </Stack>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {flowIntuitionCards.map((card, index) => (
                  <Box
                    key={card.title}
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
                      {card.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {card.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="NetworkMap"
              eyebrow="Network map"
              title="A network is not enough"
            >
              <Text color="gray.600" fontSize="sm" maxW="42rem">
                Raw networks can hide the organization researchers care about. A
                useful map simplifies the network without hiding important
                structure: communities, bridge nodes, nested modules, and
                relationships between groups.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {networkMapItems.map((item, index) => (
                  <Box
                    key={item.label}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={{ base: 4, md: 5 }}
                    bg={index === 1 ? "gray.50" : "white"}
                  >
                    <Text
                      color="gray.500"
                      fontFamily="monospace"
                      fontSize="xs"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      mb={2}
                    >
                      {item.label}
                    </Text>
                    <Heading as="h3" size="sm" mb={2}>
                      {item.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {item.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              id="ThreeChoices"
              eyebrow="Workflow"
              title="Three choices shape an Infomap analysis"
            >
              <Text color="gray.600" fontSize="sm" maxW="44rem">
                Most Infomap analyses do not start with observed flow. They
                start with a network. Infomap derives a flow model from how that
                network is represented and parameterized.
              </Text>
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
              id="Compression"
              eyebrow="Compression"
              title="Good maps compress what matters"
            >
              <Stack gap={3} maxW="44rem" mb={5}>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  The map equation scores how efficiently a partition describes
                  movement through the network. If flow stays within modules,
                  local codebooks can reuse short names inside each module and
                  only switch context when flow crosses module boundaries.
                </Text>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  Infomap searches for the community structure with the shortest
                  expected codelength.
                </Text>
              </Stack>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {compressionCards.map((card, index) => (
                  <Box
                    key={card.title}
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
                      {card.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={0}>
                      {card.text}
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
              <Text color="gray.600" fontSize="sm" maxW="44rem" mb={5}>
                The map equation is an information-theoretic objective: the
                expected codelength of describing a random walk with modular
                codebooks. It connects community structure to how efficiently a
                derived flow can be described.
              </Text>
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
                    makes codebook use predictable by matching module boundaries
                    to retained flow.
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
              <AlgorithmTraceDemo
                activeFrame={traceFrame}
                setActiveFrame={setTraceFrame}
              />
              <Stack
                gap={0}
                borderTopWidth="1px"
                borderTopColor="gray.200"
                mt={5}
              >
                {algorithmSteps.map((step, index) => {
                  const isCurrent = index === activeTraceStep;
                  return (
                    <Grid
                      key={step.title}
                      templateColumns={{ base: "1fr", md: "5rem 1fr" }}
                      gap={{ base: 1, md: 4 }}
                      px={3}
                      py={4}
                      bg={isCurrent ? "red.50" : "transparent"}
                      borderBottomWidth="1px"
                      borderBottomColor="gray.200"
                      borderLeftWidth="3px"
                      borderLeftColor={isCurrent ? "red.500" : "transparent"}
                      transition="background-color 160ms ease, border-color 160ms ease"
                    >
                      <Text
                        color={isCurrent ? "red.700" : "gray.500"}
                        fontFamily="monospace"
                        fontSize="xs"
                        fontWeight={isCurrent ? 700 : 400}
                        mb={0}
                      >
                        STEP {index + 1}
                      </Text>
                      <Box>
                        <Heading
                          as="h3"
                          size="sm"
                          mb={1}
                          color={isCurrent ? "gray.950" : "gray.900"}
                        >
                          {step.title}
                        </Heading>
                        <Text color="gray.600" fontSize="sm" mb={0}>
                          {step.text}
                        </Text>
                      </Box>
                    </Grid>
                  );
                })}
              </Stack>
              <Text color="gray.600" fontSize="sm" mt={4} mb={0}>
                Infomap optimizes the map equation. It favors partitions where
                derived or observed flow stays within modules for long stretches
                and crosses module boundaries infrequently. In practice, that
                can reveal structure in explicit flow data, topology, LFR-style
                benchmark networks, and similarity or correlation networks.
              </Text>
            </SectionCard>

            <SectionCard
              id="NetworkModels"
              eyebrow="Models"
              title="Choose the right network model"
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
                      {model.linkText} <LuArrowRight />
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
