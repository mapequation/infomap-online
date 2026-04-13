import { store } from "../../store";
import Code from "../Code";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";
import Message from "../Message";
import Figure from "./Figure";

export default function Input() {
  return (
    <>
      <Heading id="Input" />

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

      <Heading id="InputLinkList" />

      <p>
        This is the simplest format: you describe the network only by listing
        its links.
      </p>

      <Figure id="FigureNineTriangles" />

      <Code
        highlight
        startingHeight={200}
        labelProps={{
          children: "Run example",
          onClick: () => {
            store.params.setArgs("--clu --ftree --num-trials 5");
            store.runExample("nineTriangles");
          },
        }}
      >
        {store.getExampleNetwork("nineTriangles")}
      </Code>

      <p>
        Each line has the form <code>source target weight</code> and describes a
        weighted link between two numbered nodes. The <code>weight</code> can
        be any non-negative value. If omitted, Infomap uses the default weight{" "}
        <code>1</code>.
      </p>

      <Heading id="InputPajek" />

      <p>
        The <ExternalLink href="//pajek.imfm.si/doku.php">Pajek</ExternalLink>{" "}
        format specifies nodes and links in separate sections of the file:
      </p>

      <Code
        highlight
        startingHeight={300}
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("pajek"),
        }}
      >
        {store.getExampleNetwork("pajek")}
      </Code>

      <p>
        The node section must start with <code>*Vertices N</code> and the link
        section with <code>*Edges N</code>, <code>*Links N</code>, or
        <code>*Arcs N</code> (case insensitive), where <code>N</code> is the
        number of nodes or links. The text inside quotation marks gives the
        corresponding node name. You can assign node weights by adding a third
        column with positive numbers. The list of links is interpreted in the
        same way as in the link-list format.
      </p>

      <Heading id="InputBipartite" />

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
        <ExternalLink href="//www.mapequation.org/publications.html#Kheirkhahzadeh-Etal-2016-Markovtimes">
          a bipartite-to-unipartite projection corresponds to doubling the
          Markov time
        </ExternalLink>
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

      <Figure id="FigureBipartite" />

      <p>
        The bipartite format uses the heading <code>*Bipartite N</code> where{" "}
        <code>N</code> is the first node id of the feature node type. The
        bipartite network can be specified either with node names:
      </p>

      <Code
        highlight
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("bipartite"),
        }}
      >
        {store.getExampleNetwork("bipartite")}
      </Code>

      <p>and in the link list format:</p>

      <Code
        highlight
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("bipartiteLinkList"),
        }}
      >
        {store.getExampleNetwork("bipartiteLinkList")}
      </Code>

      <Heading id="InputMultilayer" />

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
        <ExternalLink href="//mapequation.org/apps/multilayer-network/index.html">
          interactive storyboard
        </ExternalLink>{" "}
        for an illustration.
      </p>

      <Heading id="InputMultilayerFull" />
      <p>
        <code>*Multilayer</code>
      </p>

      <p>
        This multilayer format gives full control over the flow within and
        between layers, and it translates directly to a{" "}
        <a href="#InputStates">state network</a>.
      </p>

      <Figure id="FigureMultilayerNetworkFull" />

      <Code
        highlight
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("multilayer"),
        }}
      >
        {store.getExampleNetwork("multilayer")}
      </Code>

      <Message bg="info">
        The <code>*Multilayer</code> heading is no longer optional.
      </Message>

      <p>
        The <code>weight</code> column is optional. Links without the last
        column get weight <code>1.0</code> by default.
      </p>

      <Heading id="InputMultilayerIntraInter" />
      <p>
        <code>*Intra</code> and <code>*Inter</code>
      </p>

      <p>
        The multilayer format above gives full control over the dynamics, and
        no other movements are encoded. In many cases, however, it is useful to
        let a random walker move within a layer and, with a given relax rate,
        jump to another layer without recording that jump. This gradually
        relaxes the constraints imposed by the layer structure. To do this, use
        a format that explicitly separates links into two groups: links{" "}
        <em>within</em> layers under the{" "}
        <code>*Intra</code> heading and links <em>between</em> layers under the{" "}
        <code>*Inter</code> heading.
      </p>
      <p>
        For the <code>*Intra</code> links, the second layer column can be
        omitted. For the{" "}
        <code>*Inter</code> links, the second node can be omitted, as a
        shorthand for an <em>unrecorded jump between layers</em>. In that case,
        each inter-layer link <code>layer1 node1 layer2</code> is expanded to
        weighted multilayer links <code>layer1 node1 layer2 node2</code>, one
        for each <code>node2</code> that <code>node1</code> is connected to in{" "}
        <code>layer2</code> with weight proportional to the weight of the link
        between <code>node1</code> and <code>node2</code> in{" "}
        <code>layer2</code>.
      </p>
      <p>
        In this way, the random walker switches smoothly to a different layer
        at a rate proportional to the inter-layer link weight, and the encoded
        dynamics correspond to relaxed layer constraints.
      </p>

      <Figure id="FigureMultilayerNetworkIntraInter" />

      <Code
        highlight
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("multilayerIntraInter"),
        }}
      >
        {store.getExampleNetwork("multilayerIntraInter")}
      </Code>

      <Heading id="InputMultilayerIntra" />
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

      <Figure id="FigureMultilayerNetworkIntra" />

      <Code
        highlight
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("multilayerIntra"),
        }}
      >
        {store.getExampleNetwork("multilayerIntra")}
      </Code>

      <Heading id="InputStates" />

      <p>
        The state format describes the exact network used internally by Infomap.
        It can model both ordinary networks and memory networks of variable
        order.
      </p>

      <Figure id="FigureStateNetwork" />

      <Code
        highlight
        startingHeight={400}
        labelProps={{
          children: "Run example",
          onClick: () => store.runExample("states"),
        }}
      >
        {store.getExampleNetwork("states")}
      </Code>

      <p>
        The <code>*Vertices</code> section is optional and follows the Pajek
        format. It is used to name the physical nodes. The <code>*States</code>{" "}
        section describes all internal nodes with the format{" "}
        <code>state_id physical_id [name]</code>, where <code>name</code> is
        optional. The state id is then referenced in the{" "}
        <code>*Links</code> section, and the physical id of the node is
        optionally referenced in the{" "}
        <code>*Vertices</code> section. The <code>*Links</code> section
        describes all links as <code>source target [weight]</code>, where{" "}
        <code>source</code> and <code>target</code> refer to state ids in the{" "}
        <code>*States</code> section.
      </p>
    </>
  );
}
