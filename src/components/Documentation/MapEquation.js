import TeX from "@matejmazur/react-katex";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

const TeXBlockLeftAligned = ({ math, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start" }}>
    <TeX math={math} block>
      {children}
    </TeX>
  </div>
);

export default function MapEquation() {
  return (
    <>
      <Heading id="MapEquation" />
      <p>
        Infomap optimizes{" "}
        <ExternalLink href="//mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
          The Map equation
        </ExternalLink>
        , which turns community detection into an information-theoretic coding
        problem. For a given network partition <TeX>M</TeX>, the map equation
        gives the theoretical limit <TeX>L(M)</TeX> of how concisely we can
        describe the trajectory of a random walk on the network.
      </p>
      <p>
        The code structure is designed so that the description becomes shorter
        when the network has regions where the random walker tends to stay for
        a long time. With the random walk as a proxy for flow, minimizing the
        map equation over all possible partitions reveals the network structure
        that best matches those dynamics.
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
    </>
  );
}
