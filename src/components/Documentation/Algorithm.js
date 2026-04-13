import { chakra } from "@chakra-ui/react";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

export default function Algorithm() {
  return (
    <>
      <Heading id="Algorithm" />
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

      <Heading id="TwolevelAlgorithm" />
      <p>
        The core of the algorithm follows closely the{" "}
        <ExternalLink href="//sites.google.com/site/findcommunities/">
          Louvain method
        </ExternalLink>
        : neighboring nodes are grouped into modules, which are then grouped
        into supermodules, and so on. First, each node is assigned to its own
        module. Then, in random sequential order, each node is moved to the
        neighboring module that gives the largest decrease in the map equation.
        If no move decreases the map equation, the node stays where it is. This
        procedure is repeated, each time in a new random order, until no move
        improves the solution. The network is then rebuilt so that the modules
        from the previous level become the nodes at the next level, and the
        same procedure is repeated. This hierarchical rebuilding continues
        until the map equation can no longer be reduced.
      </p>

      <p>
        This core algorithm usually finds a good clustering quickly, but it can
        still get trapped in local optima. Once the network is rebuilt, nodes
        that ended up in the same module are forced to move together. A move
        that was helpful early in the search may therefore become harmful
        later, and modules that have merged cannot be separated again in this
        basic procedure. To improve accuracy, Infomap refines the final state of
        the core algorithm in two ways:
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
        recursively: to find movable submodules, the algorithm first splits
        them into subsubmodules, then subsubsubmodules, and so on until no
        further split is possible. Finally, because the algorithm is stochastic
        and fast, Infomap can be restarted from scratch many times. Repeating
        the search, often 100 times or more when possible, reduces the risk of
        ending in a local minimum. After each iteration, Infomap keeps the
        clustering with the shortest description length found so far.
      </p>

      <Heading id="MultilevelAlgorithm" />
      <p>
        We have generalized our search algorithm for the two-level map equation
        to recursively search for multilevel solutions. The recursive search
        works on a module at any level, from the whole network down to a small
        module near the finest level. For a given module, the algorithm first
        tests whether introducing submodules shortens the description length. If
        not, that branch is not explored further. If it does help, the
        algorithm then tests whether the description can be compressed even more
        by adding extra index codebooks at coarser or finer levels. To evaluate
        these possibilities, the algorithm calls itself recursively both on the
        network formed by the submodules and on the networks formed by the
        nodes within each submodule. In this way, different branches of the
        hierarchy can grow or shrink independently during the search for the
        best multilevel partition. Each split into submodules uses the
        two-level search algorithm described above.
      </p>
    </>
  );
}
