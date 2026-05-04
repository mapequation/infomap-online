// @ts-nocheck
import {
  Heading as CkHeading,
  Container,
  chakra,
  Link,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

const Header = chakra(CkHeading, {
  baseStyle: {
    fontSize: "md",
    fontWeight: 600,
    mb: 1,
  },
});

const TeXBlockLeftAligned = ({ math, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start" }}>
    <TeX math={math} block>
      {children}
    </TeX>
  </div>
);

const AboutPage: NextPage = () => {
  return (
    <Container>
      <CkHeading as="h1" size="lg" mt={8} mb={6} id="MapEquation">
        The Map Equation
      </CkHeading>
      <p>
        Infomap optimizes{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation"
        >
          The Map equation
        </Link>
        , which turns community detection into an information-theoretic coding
        problem. For a given network partition <TeX>M</TeX>, the map equation
        gives the theoretical limit <TeX>L(M)</TeX> of how concisely we can
        describe the trajectory of a random walk on the network.
      </p>
      <p>
        The code structure is designed so that the description becomes shorter
        when the network has regions where the random walker tends to stay for a
        long time. With the random walk as a proxy for flow, minimizing the map
        equation over all possible partitions reveals the network structure that
        best matches those dynamics.
      </p>
      <p>
        To take advantage of the regional structure of the network, one index
        codebook and <TeX>m</TeX> module codebooks, one for each module in the
        network, are used to describe the random walker&apos;s movements. The
        module codebooks have codewords for nodes within each module (and exit
        codes to leave the module), which are derived from the node visit/exit
        frequencies of the random walker. The index codebook has codewords for
        the modules, which are derived from the module switch rates of the
        random walker. Therefore, the average length of the code describing a
        step of the random walker is the average length of codewords from the
        index codebook and the module codebooks weighted by their rates of use:
      </p>
      <TeX
        math="L(M) = q_\curvearrowleft H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
        block
      />

      <TeXBlockLeftAligned>L(M)</TeXBlockLeftAligned>
      <p>
        The two-level average description length for a step of the random walker
        on a network with <TeX>n</TeX> nodes partitioned into map <TeX>M</TeX>{" "}
        with <TeX>m</TeX> modules. The first term is the average description
        length of the index codebook, and the second term is the average
        description length of the module codebooks.
      </p>

      <TeXBlockLeftAligned math="q_\curvearrowleft = \sum_{i = 1}^{m}{q_{i\curvearrowleft}}" />
      <p>
        The rate at which the index codebook is used. The per-step use rate of
        the index codebook is given by the total probability that the random
        walker enters any of the <TeX>m</TeX> modules.
      </p>

      <TeXBlockLeftAligned math="H(\mathcal{Q}) = -\sum_{i = 1}^{m}{\frac{q_{i\curvearrowleft}}{q_\curvearrowleft} \log{\frac{q_{i\curvearrowleft}}{q_\curvearrowleft}}}" />
      <p>
        The frequency-weighted average length of codewords in the index
        codebook. The entropy of the relative rates at which the module
        codebooks are used gives the smallest average codeword length that is
        theoretically possible.
      </p>

      <TeXBlockLeftAligned math="\sum_{i = 1}^{m}{p_{\circlearrowright}^i} = \sum_{i = 1}^{m}{\left( \sum_{\alpha \in i}{p_\alpha + q_\curvearrowright} \right)}" />
      <p>
        The rate at which the module codebooks are used. The per-step use rate
        of the module codebooks is given by the total use rate of the{" "}
        <TeX>m</TeX> module codebooks. For module <TeX>i</TeX>, this is given by
        the fraction of time the random walker spends in module <TeX>i</TeX>,
        that is, the total probability that any node in the module is visited,
        plus the probability that the walker exits the module and the exit code
        is used.
      </p>

      <TeXBlockLeftAligned
        math={`
      \\begin{aligned}
      H(\\mathcal{P}^i) &= -\\frac{q_\\curvearrowright}{q_\\curvearrowright + \\sum_{\\beta \\in i}{p_\\beta}} \\log{\\frac{q_\\curvearrowright}{q_\\curvearrowright + \\sum_{\\beta \\in i}{p_\\beta}}} \\\\
                       &-\\sum_{\\alpha \\in i}{ \\frac{p_\\alpha}{q_\\curvearrowright + \\sum_{\\beta \\in i}{p_\\beta}} \\log{\\frac{p_\\alpha}{q_\\curvearrowright + \\sum_{\\beta \\in i}{p_\\beta}}} }
      \\end{aligned}
    `}
      />
      <p>
        The frequency-weighted average length of codewords in module codebook{" "}
        <TeX>i</TeX>. The entropy of the relative rates at which the random
        walker exits module <TeX>i</TeX> and visits each node in module{" "}
        <TeX>i</TeX> gives the smallest average codeword length that is
        theoretically possible.
      </p>

      <CkHeading as="h1" size="lg" mt={8} mb={6} id="Features">
        Features
      </CkHeading>

      <p>
        Infomap is a flow-based method that captures community structures based
        on the dynamics on the network.
      </p>

      <Header as="h3">(Un)weighted (un)directed links</Header>
      <p>
        Infomap handles both unweighted and weighted, undirected and directed
        links.
      </p>

      <Header as="h3">Two-level and multi-level solutions</Header>
      <p>
        Infomap clusters tightly interconnected nodes into modules (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/publications.html#Rosvall-Bergstrom-2008-Maps-of-information-flow"
        >
          two-level clustering
        </Link>
        ) or into an optimal hierarchy of nested modules (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/publications.html#Rosvall-Bergstrom-2011-Multilevel"
        >
          multi-level clustering
        </Link>
        ).
      </p>

      <Header as="h3">First- and second-order dynamics</Header>
      <p>
        Infomap captures flow patterns modeled with both first-order dynamics
        (where the next step depends only on the current position) and
        second-order dynamics (where the next step depends both on the current
        position and on the previous one). Infomap captures second-order
        dynamics by performing first-order dynamics on <em>memory nodes</em>,
        see{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/publications.html#Rosvall-Etal-2014-Memory"
        >
          Memory in network flows and its effects on spreading dynamics and
          community detection
        </Link>{" "}
        and{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/apps/sparse-memory-network/index.html"
        >
          this interactive storyboard
        </Link>
        .
      </p>

      <Header as="h3">Single- and multi-layer networks</Header>
      <p>
        Infomap can identify (overlapping) modules in{" "}
        <em>multilayer (multiplex) networks</em> that may not be identified in a
        single aggregated network or by analyzing the layers separately. See{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/publications.html#Domenico-Etal-2015-Multiplex"
        >
          Identifying modular flows on multilayer networks reveals highly
          overlapping organization in interconnected systems
        </Link>{" "}
        and{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/apps/multilayer-network/index.html"
        >
          this interactive storyboard
        </Link>
        .
      </p>

      <CkHeading as="h1" size="lg" mt={8} mb={6} id="Algorithm">
        Algorithm
      </CkHeading>
      <p>
        The hierarchical map equation measures the per-step average code length
        necessary to describe a random walker&apos;s movements on a network,
        given a hierarchical network partition. The challenge is to find the
        partition that minimizes this description length. How many hierarchical
        levels should the network have? How many modules should appear at each
        level? And which nodes should belong to which modules?
      </p>

      <p>
        Below we describe the Infomap algorithm, starting with the original
        two-level clustering of nodes into modules.
      </p>

      <CkHeading as="h2" size="md" mt={8} mb={6} id="TwolevelAlgorithm">
        Two-level Algorithm
      </CkHeading>
      <p>
        The core of the algorithm follows closely the{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//sites.google.com/site/findcommunities/"
        >
          Louvain method
        </Link>
        : neighboring nodes are grouped into modules, which are then grouped
        into supermodules, and so on. First, each node is assigned to its own
        module. Then, in random sequential order, each node is moved to the
        neighboring module that gives the largest decrease in the map equation.
        If no move decreases the map equation, the node stays where it is. This
        procedure is repeated, each time in a new random order, until no move
        improves the solution. The network is then rebuilt so that the modules
        from the previous level become the nodes at the next level, and the same
        procedure is repeated. This hierarchical rebuilding continues until the
        map equation can no longer be reduced.
      </p>

      <p>
        This core algorithm usually finds a good clustering quickly, but it can
        still get trapped in local optima. Once the network is rebuilt, nodes
        that ended up in the same module are forced to move together. A move
        that was helpful early in the search may therefore become harmful later,
        and modules that have merged cannot be separated again in this basic
        procedure. To improve accuracy, Infomap refines the final state of the
        core algorithm in two ways:
      </p>

      <chakra.p pl={10}>
        <chakra.em mr={4}>Submodule movements:</chakra.em>
        First, each module is treated as a network of its own, and the main
        algorithm is applied within that module. This generates one or more
        submodules. Those submodules are then moved back to the partition from
        the previous step, but are now allowed to move freely between modules.
        The main algorithm is then run again on these submodules.
      </chakra.p>

      <chakra.p pl={10}>
        <chakra.em mr={4}>Single-node movements:</chakra.em>
        First, each node is reassigned to be the only member of its own module,
        which allows single-node movements. The nodes are then placed back into
        the partition from the previous step, but each node is now free to move
        between modules. The main algorithm is then run again on the individual
        nodes.
      </chakra.p>

      <p>
        In practice, these two extensions are repeated in sequence as long as
        they improve the clustering. The submodule movements are also applied
        recursively: to find movable submodules, the algorithm first splits them
        into subsubmodules, then subsubsubmodules, and so on until no further
        split is possible. Finally, because the algorithm is stochastic and
        fast, Infomap can be restarted from scratch many times. Repeating the
        search, often 100 times or more when possible, reduces the risk of
        ending in a local minimum. After each iteration, Infomap keeps the
        clustering with the shortest description length found so far.
      </p>

      <CkHeading as="h2" size="md" mt={8} mb={6} id="MultilevelAlgorithm">
        Multi-level Algorithm
      </CkHeading>
      <p>
        We have generalized our search algorithm for the two-level map equation
        to recursively search for multilevel solutions. The recursive search
        works on a module at any level, from the whole network down to a small
        module near the finest level. For a given module, the algorithm first
        tests whether introducing submodules shortens the description length. If
        not, that branch is not explored further. If it does help, the algorithm
        then tests whether the description can be compressed even more by adding
        extra index codebooks at coarser or finer levels. To evaluate these
        possibilities, the algorithm calls itself recursively both on the
        network formed by the submodules and on the networks formed by the nodes
        within each submodule. In this way, different branches of the hierarchy
        can grow or shrink independently during the search for the best
        multilevel partition. Each split into submodules uses the two-level
        search algorithm described above.
      </p>
    </Container>
  );
};

export default AboutPage;
