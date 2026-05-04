// @ts-nocheck
import { Heading as CkHeading, Link } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import * as exampleNetworks from "../../data/networks";
import Code from "../../shared/components/Code";
import Message from "../../shared/components/Message";

export default function Input() {
  return (
    <>
      <CkHeading as="h2" size="md" mt={8} mb={6} id="Input">
        Input formats
      </CkHeading>

      <p>
        Infomap supports several input formats for network data, including a
        minimal link-list format and the standard Pajek format.
      </p>

      <p>
        Infomap detects the format from the file headers. If no header is
        present, it assumes a <a href="#InputLinkList">link list</a>.
      </p>

      <Message bg="info" header="Self links">
        Since version <a href="#2.0.0">2.0.0</a>, Infomap includes self links by
        default. To exclude self links, use <code>--no-self-links</code>.
        <br />
        For undirected networks, Infomap follows the convention of counting self
        links once. To count them twice, double the weight of the self links.
      </Message>

      <CkHeading as="h3" size="sm" mt={6} mb={4} id="InputLinkList">
        Link-list
      </CkHeading>

      <p>
        This is the simplest format: you describe the network only by listing
        its links.
      </p>

      <figure id="FigureNineTriangles">
        <img
          src="/infomap/images/nine-triangles.svg"
          alt="Network of nine triangles"
        />
        <figcaption>
          <strong>Figure 1.</strong> Network generated from a Sierpinski fractal
          of three levels with nine triangles at the bottom level. Note that the
          optimal solution is not the symmetric case with three modules in each
          supermodule.
        </figcaption>
      </figure>

      <Code highlight>{exampleNetworks["nineTriangles"]}</Code>

      <p>
        Each line has the form <code>source target weight</code> and describes a
        weighted link between two numbered nodes. The <code>weight</code> can be
        any non-negative value. If omitted, Infomap uses the default weight{" "}
        <code>1</code>.
      </p>

      <CkHeading as="h3" size="sm" mt={6} mb={4} id="InputPajek">
        Pajek
      </CkHeading>

      <p>
        The{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//pajek.imfm.si/doku.php"
        >
          Pajek
        </Link>{" "}
        format specifies nodes and links in separate sections of the file:
      </p>

      <Code highlight>{exampleNetworks["pajek"]}</Code>

      <p>
        The node section must start with <code>*Vertices N</code> and the link
        section with <code>*Edges N</code>, <code>*Links N</code>, or
        <code>*Arcs N</code> (case insensitive), where <code>N</code> is the
        number of nodes or links. The text inside quotation marks gives the
        corresponding node name. You can assign node weights by adding a third
        column with positive numbers. The list of links is interpreted in the
        same way as in the link-list format.
      </p>

      <CkHeading as="h3" size="sm" mt={6} mb={4} id="InputBipartite">
        Bipartite
      </CkHeading>

      <p>
        A bipartite network has two types of nodes with links only between
        different node types. If we call them <em>primary</em> nodes and{" "}
        <em>feature</em> nodes, we can interpret shared feature nodes as
        indirect relations between primary nodes. When only relations between
        primary nodes are of interest, the bipartite network can be projected
        into a unipartite network of primary nodes. In this projection, each
        pair of links connecting primary nodes through a shared feature node is
        projected into a unipartite link between the connected primary nodes.
        However, this projection quickly creates too many links, even in
        moderately dense networks. With the map equation for varying Markov
        times, we avoid this projection because{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//www.mapequation.org/publications.html#Kheirkhahzadeh-Etal-2016-Markovtimes"
        >
          a bipartite-to-unipartite projection corresponds to doubling the
          Markov time
        </Link>
        . This approximates a two-step random walk. By shifting flow from
        feature nodes to primary nodes, the map equation describes steps on the
        primary nodes while avoiding the drawbacks of a unipartite projection.
      </p>

      <Message>
        The bipartite dynamics described above is the default for the bipartite
        format. It is most useful for sparse bipartite networks where the
        primary nodes are the main objects of interest. Otherwise, add the flag{" "}
        <a href="#--skip-adjust-bipartite-flow">
          <code>--skip-adjust-bipartite-flow</code>
        </a>{" "}
        or change the <code>*Bipartite</code> heading to <code>*Edges</code> to
        treat the network as unipartite.
      </Message>

      <figure id="FigureBipartite">
        <img
          src="/infomap/images/bipartite.svg"
          style={{ width: "40%", marginInline: "auto" }}
          alt="Bipartite network with three round and two square nodes"
        />
        <figcaption>
          <strong>Figure 2.</strong> Bipartite network with three primary nodes{" "}
          <TeX>1, 2, 3</TeX> and two feature nodes <TeX>4, 5</TeX>.
        </figcaption>
      </figure>

      <p>
        The bipartite format uses the heading <code>*Bipartite N</code> where{" "}
        <code>N</code> is the first node id of the feature node type. The
        bipartite network can be specified either with node names:
      </p>

      <Code highlight>{exampleNetworks["bipartite"]}</Code>

      <p>and in the link list format:</p>

      <Code highlight>{exampleNetworks["bipartiteLinkList"]}</Code>

      <CkHeading as="h3" size="sm" mt={6} mb={4} id="InputMultilayer">
        Multilayer
      </CkHeading>

      <p>
        In a multilayer network, each physical node can appear in multiple{" "}
        <em>layers</em>, with different link structure for each layer. The
        physical nodes may be defined optionally as in the{" "}
        <a href="#InputPajek">Pajek format</a>, but for the links there are
        three different ways to define them, depending on the data you have.
        With the <code>*Multilayer</code> heading, you have to specify{" "}
        <a href="#InputMultilayerFull">
          all intra-layer and inter-layer links explicitly
        </a>
        . With the <code>*Intra</code> heading you only specify links{" "}
        <em>within</em> each layer and the links <em>between</em> layers are{" "}
        <a href="#InputMultilayerIntra">generated automatically</a> by
        inter-layer relaxation,{" "}
        <a href="#InputMultilayerIntraInter">
          optionally constrained by inter-layer links
        </a>{" "}
        defined under the <code>*Inter</code> heading. See the{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//mapequation.org/apps/multilayer-network/index.html"
        >
          interactive storyboard
        </Link>{" "}
        for an illustration.
      </p>

      <CkHeading as="h4" size="xs" mt={4} mb={2} id="InputMultilayerFull">
        With multilayer links
      </CkHeading>
      <p>
        <code>*Multilayer</code>
      </p>

      <p>
        This multilayer format gives full control over the flow within and
        between layers, and it translates directly to a{" "}
        <a href="#InputStates">state network</a>.
      </p>

      <figure id="FigureMultilayerNetworkFull">
        <img
          src="/infomap/images/multilayer-network-full.svg"
          alt="Multilayer network"
        />
        <figcaption>
          <strong>Figure 3.</strong> A multilayer network with five physical
          nodes <TeX>i,\dotsc,m</TeX> in two layers, <TeX>\alpha</TeX> and{" "}
          <TeX>\beta</TeX>. With the <code>*Multilayer</code> heading, links
          between layers are explicitly defined. The figure shows how the same
          links would be generated automatically using inter-layer links (
          <a href="#FigureMultilayerNetworkIntraInter">Figure 4</a>) or only
          intra-layer links (
          <a href="#FigureMultilayerNetworkIntra">Figure 5</a>) using relax rate{" "}
          <TeX>r = 0.4</TeX>. This multilayer network is also represented as a
          state network in <a href="#FigureStateNetwork">Figure 6</a>.
        </figcaption>
      </figure>

      <Code highlight>{exampleNetworks["multilayer"]}</Code>

      <Message bg="info">
        The <code>*Multilayer</code> heading is no longer optional.
      </Message>

      <p>
        The <code>weight</code> column is optional. Links without the last
        column get weight <code>1.0</code> by default.
      </p>

      <CkHeading as="h4" size="xs" mt={4} mb={2} id="InputMultilayerIntraInter">
        With inter-layer links
      </CkHeading>
      <p>
        <code>*Intra</code> and <code>*Inter</code>
      </p>

      <p>
        The multilayer format above gives full control over the dynamics, and no
        other movements are encoded. In many cases, however, it is useful to let
        a random walker move within a layer and, with a given relax rate, jump
        to another layer without recording that jump. This gradually relaxes the
        constraints imposed by the layer structure. To do this, use a format
        that explicitly separates links into two groups: links <em>within</em>{" "}
        layers under the <code>*Intra</code> heading and links <em>between</em>{" "}
        layers under the <code>*Inter</code> heading.
      </p>
      <p>
        For the <code>*Intra</code> links, the second layer column can be
        omitted. For the <code>*Inter</code> links, the second node can be
        omitted, as a shorthand for an <em>unrecorded jump between layers</em>.
        In that case, each inter-layer link <code>layer1 node1 layer2</code> is
        expanded to weighted multilayer links{" "}
        <code>layer1 node1 layer2 node2</code>, one for each <code>node2</code>{" "}
        that <code>node1</code> is connected to in <code>layer2</code> with
        weight proportional to the weight of the link between <code>node1</code>{" "}
        and <code>node2</code> in <code>layer2</code>.
      </p>
      <p>
        In this way, the random walker switches smoothly to a different layer at
        a rate proportional to the inter-layer link weight, and the encoded
        dynamics correspond to relaxed layer constraints.
      </p>

      <figure id="FigureMultilayerNetworkIntraInter">
        <img
          src="/infomap/images/multilayer-network-intra-inter.svg"
          alt="Multilayer network in intra-inter format"
        />
        <figcaption>
          <strong>Figure 4.</strong> A multilayer network with five physical
          nodes <TeX>i,\dotsc,m</TeX> in two layers, <TeX>\alpha</TeX> and{" "}
          <TeX>\beta</TeX>, using the <code>*Intra</code> and{" "}
          <code>*Inter</code> format. The relative weights of the links between
          layers define the probability that the random walker switches layers
          for each node individually. Because jumps between layers are not
          encoded when they occur within the same physical node, each
          inter-layer link is expanded to the next possible steps of the random
          walker, as visualized in{" "}
          <a href="#FigureMultilayerNetworkFull">Figure 3</a>. This network also
          corresponds to the multilayer network in{" "}
          <a href="#FigureMultilayerNetworkIntra">Figure 5</a> where the links
          between layers are generated automatically using relax rate{" "}
          <TeX>r = 0.4</TeX>.
        </figcaption>
      </figure>

      <Code highlight>{exampleNetworks["multilayerIntraInter"]}</Code>

      <CkHeading as="h4" size="xs" mt={4} mb={2} id="InputMultilayerIntra">
        Without inter-layer links
      </CkHeading>
      <p>
        <code>*Intra</code>
      </p>

      <p>
        If no inter-layer links are provided, Infomap generates them from the
        intra-layer link structure by relaxing the layer constraints with a
        global{" "}
        <a href="#--multilayer-relax-rate">
          <code>--multilayer-relax-rate</code>
        </a>{" "}
        for each node; the default is 0.15. For each node, Infomap assumes
        inter-layer links to every layer, expanded as{" "}
        <a href="#InputMultilayerIntraInter">explained</a> for the{" "}
        <code>*Inter</code> links. However, the inter-layer links will be
        weighted proportionally to the weighted out-degree of the same physical
        node in the target layer, which generally gives non-uniform inter-layer
        transition probabilities.
      </p>

      <figure id="FigureMultilayerNetworkIntra">
        <img
          src="/infomap/images/multilayer-network-intra.svg"
          alt="Multilayer network using inter-layer relaxation"
        />
        <figcaption>
          <strong>Figure 5.</strong> A multilayer network with five physical
          nodes <TeX>i,\dotsc,m</TeX> in two layers, <TeX>\alpha</TeX> and{" "}
          <TeX>\beta</TeX>, with links between layers generated by a relax rate{" "}
          <TeX>r</TeX>. Without any explicit inter-layer links defined, the flow
          between layers through the common physical nodes can be modeled with a
          relax rate <TeX>r</TeX>, which is the probability of relaxing the
          constraint to move only in the current layer. Using relax rate{" "}
          <TeX>r = 0.4</TeX>, this network is equivalent to the multilayer
          networks in <a href="#FigureMultilayerNetworkFull">Figure 3</a> and{" "}
          <a href="#FigureMultilayerNetworkIntraInter">Figure 4</a> and the
          state network in <a href="#FigureStateNetwork">Figure 6</a>.
        </figcaption>
      </figure>

      <Code highlight>{exampleNetworks["multilayerIntra"]}</Code>

      <CkHeading as="h3" size="sm" mt={6} mb={4} id="InputStates">
        States
      </CkHeading>

      <p>
        The state format describes the exact network used internally by Infomap.
        It can model both ordinary networks and memory networks of variable
        order.
      </p>

      <figure id="FigureStateNetwork">
        <img src="/infomap/images/state-network.svg" alt="State network" />
        <figcaption>
          <strong>Figure 6.</strong> A state network with five physical nodes{" "}
          <TeX>i,\dotsc,m</TeX> and six state nodes{" "}
          <TeX math="\tilde{\alpha}_i,\dotsc,\tilde{\zeta}_m" />. It represents
          the multilayer network in{" "}
          <a href="#FigureMultilayerNetworkFull">Figure 3</a>.
        </figcaption>
      </figure>

      <Code highlight>{exampleNetworks["states"]}</Code>

      <p>
        The <code>*Vertices</code> section is optional and follows the Pajek
        format. It is used to name the physical nodes. The <code>*States</code>{" "}
        section describes all internal nodes with the format{" "}
        <code>state_id physical_id [name]</code>, where <code>name</code> is
        optional. The state id is then referenced in the <code>*Links</code>{" "}
        section, and the physical id of the node is optionally referenced in the{" "}
        <code>*Vertices</code> section. The <code>*Links</code> section
        describes all links as <code>source target [weight]</code>, where{" "}
        <code>source</code> and <code>target</code> refer to state ids in the{" "}
        <code>*States</code> section.
      </p>
    </>
  );
}
