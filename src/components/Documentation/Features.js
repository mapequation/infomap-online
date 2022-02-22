import { chakra, Heading as CkHeading } from "@chakra-ui/react";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

const Header = chakra(CkHeading, {
  baseStyle: {
    fontSize: "md",
    fontWeight: 600,
    mb: 1,
  },
});

export default function Features() {
  return (
    <>
      <Heading id="Features" />

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
        <ExternalLink href="//mapequation.org/publications.html#Rosvall-Bergstrom-2008-Maps-of-information-flow">
          two-level clustering
        </ExternalLink>
        ) or the optimal number of nested modules (
        <ExternalLink href="//mapequation.org/publications.html#Rosvall-Bergstrom-2011-Multilevel">
          multi-level clustering
        </ExternalLink>
        ).
      </p>

      <Header as="h3">First- and second-order dynamics</Header>
      <p>
        Infomap captures flow patterns modeled with both first-order dynamics
        (as on a conventional network: where flow moves to on the network only
        depends on where it currently is) and second-order dynamics (where flow
        moves to on the network both depends on where it currently is and where
        it just came from). Infomap captures second-order dynamics by performing
        first-order dynamics on <em>memory nodes</em>, see{" "}
        <ExternalLink href="//mapequation.org/publications.html#Rosvall-Etal-2014-Memory">
          Memory in network flows and its effects on spreading dynamics and
          community detection
        </ExternalLink>{" "}
        and{" "}
        <ExternalLink href="//mapequation.org/apps/sparse-memory-network/index.html">
          this interactive storyboard
        </ExternalLink>
        .
      </p>

      {/*<h4 id="Feature-overlapping-modules">
      Hard partitions and overlapping modules
    </h4>
    <p>
      Infomap can identify <em>overlapping modules</em> by first representing
      the dynamics with <em>memory nodes</em> and then clustering the memory
      nodes in hard partitions.).
      </p>*/}

      <Header as="h3">Single- and multi-layer networks</Header>
      <p>
        Infomap can identify (overlapping) modules in{" "}
        <em>multilayer (multiplex) networks</em> that may not be identified in a
        single aggregated network or by analyzing the layers separately. See{" "}
        <ExternalLink href="//mapequation.org/publications.html#Domenico-Etal-2015-Multiplex">
          Identifying modular flows on multilayer networks reveals highly
          overlapping organization in interconnected systems
        </ExternalLink>{" "}
        and{" "}
        <ExternalLink href="//mapequation.org/apps/multilayer-network/index.html">
          this interactive storyboard
        </ExternalLink>
        .
      </p>
    </>
  );
}
