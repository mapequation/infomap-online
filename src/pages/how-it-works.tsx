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
  { id: "FlowLens", label: "Flow lens" },
  { id: "ChooseLens", label: "Choose lens" },
  { id: "RetainedFlow", label: "Retained flow" },
  { id: "Compression", label: "Compression" },
  { id: "MapEquation", label: "Map equation" },
  { id: "SearchAlgorithm", label: "Optimization" },
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
    text: "Infomap searches for the map whose modular code gives the shortest useful description for the chosen flow model.",
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
    text: "Use direction and weight to define what can move, which paths are available, and how strongly links guide the flow lens.",
    href: "/formats#InputLinkList",
    linkText: "Link-list formats",
  },
  {
    title: "Hierarchical modules",
    text: "Use hierarchical output and Markov time to explore coarser or finer flow maps when the research question concerns structure across scales.",
    href: "/formats#OutputTree",
    linkText: "Tree outputs",
  },
  {
    title: "Memory and state networks",
    text: "Use state nodes when the flow lens should depend on previous steps, context, layer, or another hidden state.",
    href: "/formats#InputStates",
    linkText: "State input",
  },
  {
    title: "Multilayer networks",
    text: "Use multilayer input when the lens should preserve time, mode, layer, or context while connecting shared physical nodes.",
    href: "/formats#InputMultilayer",
    linkText: "Multilayer input",
  },
  {
    title: "Bipartite networks",
    text: "Use bipartite input when flow should alternate between two node types and a one-mode projection would distort the modeled process.",
    href: "/formats#InputBipartite",
    linkText: "Bipartite input",
  },
  {
    title: "Regularized map equation",
    text: "Use regularization to add a Bayesian prior over missing transition rates and reduce overfitting when the network is sparse, noisy, or incomplete.",
    href: "/online",
    linkText: "Workbench parameters",
  },
];

const researchToMapSteps = [
  {
    title: "Research question",
    text: "Start with what the network should explain: movement, attention, similarity, interaction, influence, or another process on the system.",
  },
  {
    title: "Network representation",
    text: "Choose the nodes, links, weights, directions, layers, state nodes, or bipartite structure that preserve the signal you want to map.",
  },
  {
    title: "Flow model",
    text: "The representation induces the flow lens: how a random walker or higher-order process can move through the network.",
  },
  {
    title: "Retained flow",
    text: "Infomap looks for regions where that flow tends to remain before moving elsewhere.",
  },
  {
    title: "Communities",
    text: "The modules are the retained-flow structure visible through the chosen lens.",
  },
  {
    title: "Interpretation",
    text: "Interpret the map in terms of the research question and the modeling choices that produced it.",
  },
];

const fitCards = [
  {
    title: "Observed flow",
    text: "Traffic, mobility, transactions, web navigation, messages, or other measured transitions through a system.",
  },
  {
    title: "Topology-induced flow",
    text: "Citation networks, dependencies, biological interactions, hyperlink structures, and other networks where topology induces a walk.",
  },
  {
    title: "Weighted similarity or correlation flow",
    text: "Proximity, affinity, co-expression, molecular similarity, and other weighted networks where flow probes topology with care around noise and regularization.",
  },
  {
    title: "Benchmark or model flow",
    text: "Synthetic, generative, or benchmark networks where the goal is to study how modular organization appears under a specified network model.",
  },
];

const flowIntuitionCards = [
  {
    title: "Not just density",
    text: "Infomap modules are not merely dense node sets. They are regions that make flow easier to describe under the chosen model.",
  },
  {
    title: "Boundaries matter",
    text: "A module boundary is useful when flow can spend time inside a region before crossing to another region.",
  },
  {
    title: "Interpret through the lens",
    text: "The detected communities should be interpreted relative to the representation and flow model that produced them.",
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
    title: "A good map is conditional",
    text: "Codelength gives a comparable objective for maps of the same flow model and rewards partitions that capture retained flow.",
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
  const [active, setActive] = useState("FlowLens");
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
            Research framework
          </Text>
          <Heading as="h1" size="lg" mb={4} id="HowItWorks">
            Infomap maps networks by treating flow as a lens
          </Heading>

          <Stack gap={4} maxW="46rem" mb={8}>
            <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} mb={0}>
              A network representation defines what can move, persist, or be
              described. Infomap then asks where that flow is retained, where it
              crosses boundaries, and which modular description best captures
              the organization relevant to the research question.
            </Text>
            <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} mb={0}>
              Infomap reveals the modular organization implied by a chosen flow
              model. A network does not define one universal community
              structure; the resulting communities are meaningful with respect
              to the flow lens used to model the network.
            </Text>
          </Stack>

          <Stack gap={5}>
            <SectionCard
              id="FlowLens"
              eyebrow="Flow as a lens"
              title="From research question to map"
            >
              <Text color="gray.600" fontSize="sm" maxW="44rem">
                The scientific logic is a modeling chain: the research question
                motivates the network representation, the representation defines
                the flow model, and Infomap maps where that flow is retained.
                The map should be interpreted through that chain.
              </Text>
              <Box
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
                p={4}
                mb={4}
              >
                <Text
                  color="gray.500"
                  fontFamily="monospace"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  mb={2}
                >
                  Working definition
                </Text>
                <Text color="gray.700" fontSize="sm" fontWeight={600} mb={0}>
                  In this page, a community means a region that gives a shorter
                  description of observed or induced flow under the chosen
                  network model.
                </Text>
              </Box>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {researchToMapSteps.map((step, index) => (
                  <Box
                    key={step.title}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                    bg={index === 2 || index === 4 ? "gray.50" : "white"}
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
              id="ChooseLens"
              eyebrow="Modeling choice"
              title="Choosing the flow lens"
            >
              <Text color="gray.600" fontSize="sm" maxW="42rem">
                Flow is a modeling choice. In some systems, flow is observed:
                traffic, mobility, transactions, messages, or navigation. In
                others, flow is induced by the network representation:
                citations, dependencies, biological interactions, similarity,
                correlation, or topology. In both cases, Infomap uses flow as a
                lens.
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
              id="RetainedFlow"
              eyebrow="Communities"
              title="Communities are regions of retained flow"
            >
              <Stack gap={3} maxW="44rem" mb={5}>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  Infomap defines communities as regions where observed or
                  induced flow tends to remain before crossing module
                  boundaries. This makes the interpretation different from
                  density-based clustering: a module is not merely a dense group
                  of nodes, but a region that gives a shorter description of
                  flow under the chosen network model.
                </Text>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  The flow does not need to be a literal moving object. A random
                  walk can use topology, weights, direction, similarity, or
                  interaction structure as a lens for revealing the organization
                  implied by flow over the chosen representation.
                </Text>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  For similarity networks, flow probes the weighted topology; it
                  does not imply that expression, similarity, or influence
                  physically moves between nodes.
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
              id="Compression"
              eyebrow="Compression"
              title="Good maps compress what matters"
            >
              <Stack gap={3} maxW="44rem" mb={5}>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  A useful map simplifies the network without hiding the
                  organization that matters for the chosen lens. The map
                  equation formalizes this idea by scoring how efficiently a
                  partition describes movement through the network.
                </Text>
                <Text color="gray.600" fontSize="sm" mb={0}>
                  If flow stays within modules, local codebooks can reuse short
                  names inside each module and only switch context when flow
                  crosses module boundaries. Short codelength means that the map
                  captures regularities in the modeled flow.
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
                codebooks. It connects retained-flow communities to how
                efficiently the chosen flow model can be described.
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
              eyebrow="Optimization"
              title="How Infomap searches after the model is defined"
            >
              <Text color="gray.600" fontSize="sm" maxW="44rem" mb={5}>
                Once the flow model and objective are defined, Infomap searches
                for a map with a short description under that model. The
                algorithmic question is practical: given this lens, which
                partition and hierarchy best compress the flow?
              </Text>
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
                Multiple trials and refinements help navigate a non-convex
                search space. The result is evaluated by codelength and then
                interpreted relative to the representation, parameters, and
                research question.
              </Text>
            </SectionCard>

            <SectionCard
              id="NetworkModels"
              eyebrow="Models"
              title="Network models define and refine the lens"
            >
              <Text color="gray.600" fontSize="sm" maxW="44rem" mb={5}>
                Infomap's network models are not just input formats. They are
                ways to define what the flow lens can see: direction, weights,
                node types, layers, memory, scale, and regularization.
              </Text>
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
