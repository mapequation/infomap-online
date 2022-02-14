import { chakra } from "@chakra-ui/react";
import { Heading } from "../Contents";

export default function Algorithm() {
  return (
    <>
      <Heading id="Algorithm" />
      <p>
        The hierarchical map equation measures the per-step average code length
        necessary to describe a random walker&apos;s movements on a network,
        given a hierarchical network partition, but the challenge is to find the
        partition that minimizes the description length. Into how many
        hierarchical levels should a given network be partitioned? How many
        modules should each level have? And which nodes should be members of
        which modules?
      </p>

      <p>
        Below we describe the Infomap algorithm and start with a description of
        the original two-level clustering of nodes into modules
      </p>

      <Heading id="TwolevelAlgorithm" />
      <p>
        The core of the algorithm follows closely the{" "}
        <a href="https://sites.google.com/site/findcommunities/">
          Louvain method
        </a>
        : neighboring nodes are joined into modules, which subsequently are
        joined into supermodules and so on. First, each node is assigned to its
        own module. Then, in random sequential order, each node is moved to the
        neighboring module that results in the largest decrease of the map
        equation. If no move results in a decrease of the map equation, the node
        stays in its original module. This procedure is repeated, each time in a
        new random sequential order, until no move generates a decrease of the
        map equation. Now the network is rebuilt, with the modules of the last
        level forming the nodes at this level, and, exactly as at the previous
        level, the nodes are joined into modules. This hierarchical rebuilding
        of the network is repeated until the map equation cannot be reduced
        further.
      </p>

      <p>
        With this algorithm, a fairly good clustering of the network can be
        found in a very short time. Let us call this the core algorithm and see
        how it can be improved. The nodes assigned to the same module are forced
        to move jointly when the network is rebuilt. As a result, what was an
        optimal move early in the algorithm might have the opposite effect later
        in the algorithm. Because two or more modules that merge together and
        form one single module when the network is rebuilt can never be
        separated again in this algorithm, the accuracy can be improved by
        breaking the modules of the final state of the core algorithm in either
        of the two following ways:
      </p>

      <chakra.p pl={10}>
        <em>Submodule movements:</em>
        First, each cluster is treated as a network on its own and the main
        algorithm is applied to this network. This procedure generates one or
        more submodules for each module. Then all submodules are moved back to
        their respective modules of the previous step. At this stage, with the
        same partition as in the previous step but with each submodule being
        freely movable between the modules, the main algorithm is re-applied on
        the submodules.
      </chakra.p>

      <chakra.p pl={10}>
        <em>Single-node movements:</em>
        First, each node is re-assigned to be the sole member of its own module,
        in order to allow for single-node movements. Then all nodes are moved
        back to their respective modules of the previous step. At this stage,
        with the same partition as in the previous step but with each single
        node being freely movable between the modules, the main algorithm is
        re-applied on the single nodes.
      </chakra.p>

      <p>
        In practice, we repeat the two extensions to the core algorithm in
        sequence and as long as the clustering is improved. Moreover, we apply
        the submodule movements recursively. That is, to find the submodules to
        be moved, the algorithm first splits the submodules into subsubmodules,
        subsubsubmodules, and so on until no further splits are possible.
        Finally, because the algorithm is stochastic and fast, we can restart
        the algorithm from scratch every time the clustering cannot be improved
        further and the algorithm stops. The implementation is straightforward
        and, by repeating the search more than once, 100 times or more if
        possible, the final partition is less likely to correspond to a local
        minimum. For each iteration, we record the clustering if the description
        length is shorter than the previously shortest description length.
      </p>

      <Heading id="MultilevelAlgorithm" />
      <p>
        We have generalized our search algorithm for the two-level map equation
        to recursively search for multilevel solutions. The recursive search
        operates on a module at any level; this can be all the nodes in the
        entire network, or a few nodes at the finest level. For a given module,
        the algorithm first generates submodules if this gives a shorter
        description length. If not, the recursive search does not go further
        down this branch. But if adding submodules gives a shorter description
        length, the algorithm tests if movements within the module can be
        further compressed by additional index codebooks. Further compression
        can be achieved both by adding one or more coarser codebooks to compress
        movements between submodules or by adding one or more finer index
        codebooks to compress movements within submodules. To test for all
        combinations, the algorithm calls itself recursively, both operating on
        the network formed by the submodules and on the networks formed by the
        nodes within every submodule. In this way, the algorithm successively
        increases and decreases the depth of different branches of the
        multilevel code structure in its search for the optimal hierarchical
        partitioning. For every split of a module into submodules, we use the
        two-level search algorithm described above.
      </p>
    </>
  );
}
