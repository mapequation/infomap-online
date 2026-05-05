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
  const [active, setActive] = useState("WhenToUse");
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
