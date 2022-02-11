import TeX from "@matejmazur/react-katex";
import { Heading } from "../Contents";


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
        <a href="//mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
          The Map equation
        </a>
        , which exploits the <em>information-theoretic</em> duality between finding community
        structure in networks and minimizing the description length of a random walker&apos;s
        movements on a network. For a given network partition <TeX>M</TeX>, the map equation
        specifies the theoretical limit <TeX>L(M)</TeX> of how concisely we can describe the
        trajectory of this random walk.
      </p>
      <p>
        The underlying code structure of the map equation is designed such that the description can
        be compressed if the network has regions in which the random walker tends to stay for a long
        time. Therefore, with a random walk as a proxy for real flow, minimizing the map equation
        over all possible network partitions reveals important aspects of network structure with
        respect to the dynamics on the network.
      </p>
      <p>
        To take advantage of the regional structure of the network, one index codebook and{" "}
        <TeX>m</TeX> module codebooks, one for each module in the network, are used to describe the
        random walker&apos;s movements. The module codebooks have codewords for nodes within each
        module (and exit codes to leave the module), which are derived from the node visit/exit
        frequencies of the random walker. The index codebook has codewords for the modules, which
        are derived from the module switch rates of the random walker. Therefore, the average length
        of the code describing a step of the random walker is the average length of codewords from
        the index codebook and the module codebooks weighted by their rates of use:
      </p>
      <TeX
        math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
        block
      />

      <TeXBlockLeftAligned>L(M)</TeXBlockLeftAligned>
      <p>
        The description length for module partition <TeX>M</TeX>. For module partition <TeX>M</TeX>{" "}
        of <TeX>n</TeX> nodes into <TeX>m</TeX> modules, the lower bound of the average length of
        the code describing a step of the random walker.
      </p>

      <TeXBlockLeftAligned math="q_\curvearrowright = \sum_{i = 1}^{m}{q_{i\curvearrowright}}" />
      <p>
        The rate at which the index codebook is used. The per-step use rate of the index codebook is
        given by the total probability that the random walker exits any of the <TeX>m</TeX> modules.
      </p>

      <TeXBlockLeftAligned
        math="H(\mathcal{Q}) = -\sum_{i = 1}^{m}{\frac{q_{i\curvearrowright}}{q_\curvearrowright} \log{\frac{q_{i\curvearrowright}}{q_\curvearrowright}}}" />
      <p>
        The frequency-weighted average length of codewords in the index codebook. The entropy of the
        relative rates to use the module codebooks measures the smallest average codeword length
        that is theoretically possible.
      </p>

      <TeXBlockLeftAligned
        math="\sum_{i = 1}^{m}{p_{\circlearrowright}^i} = \sum_{i = 1}^{m}{\left( \sum_{\alpha \in i}{p_\alpha + q_\curvearrowright} \right)}" />
      <p>
        The rate at which the module codebooks are used. The per-step use rate of the module
        codebooks is given by the total use rate of the <TeX>m</TeX> module codebooks. For module{" "}
        <TeX>i</TeX>, this is given by the fraction of time the random walker spends in module{" "}
        <TeX>i</TeX>, which is given by the total probability that any node in the module is
        visited, plus the probability that it exits the module and the exit message is used.
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
        The frequency-weighted average length of codewords in module codebook <TeX>i</TeX>. The
        entropy of the relative rates at which the random walker exits module <TeX>i</TeX> and
        visits each node in module <TeX>i</TeX> measures the smallest average codeword length that
        is theoretically possible.
      </p>
    </>
  );
}
