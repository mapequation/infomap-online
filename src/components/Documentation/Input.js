import React from "react";
import { Message } from "semantic-ui-react";
import store from "../../store";
import Code from "../Code";
import { Heading } from "./Contents";
import Figure from "./Figure";

export default () => {
  return (
    <>
      <Heading id="Input" />

      <p>
        Infomap understands different file formats for the input network data, for example a minimal
        link list format or the standard Pajek format.
      </p>

      <p>
        Infomap will try to recognize the file format, but the format can be explicitly specified
        with the flags{" "}
        <a href="#--input-format">
          <code>-i</code>
        </a>{" "}
        or{" "}
        <a href="#--input-format">
          <code>--input-format</code>
        </a>{" "}
        followed by a format specifier.
      </p>

      <Heading id="InputLinkList" />
      <p>
        <a href="#--input-format">
          <code>-i link-list</code>
        </a>
      </p>

      <p>This is a minimal format to describe a network by only specifying a set of links.</p>

      <Figure id="FigureNineTriangles" />

      <Code
        highlight
        lines={10}
        labelProps={{
          content: "Run example",
          onClick: () => {
            const param = store.params.getParam("--num-trials");
            store.params.setInput(param, 5);
            store.runExample("nineTriangles");
          },
        }}
      >
        {store.getExampleNetwork("nineTriangles")}
      </Code>

      <p>
        Each line corresponds to the triad <code>source target weight</code> which describes a
        weighted link between the nodes with specified numbers. The <code>weight</code> can be any
        non-negative value. If omitted, the link weight will default to <code>1</code>.
      </p>

      <Heading id="InputPajek" />
      <p>
        <a href="#--input-format">
          <code>-i pajek</code>
        </a>
      </p>

      <p>
        The <a href="http://pajek.imfm.si/doku.php">Pajek</a> format specifies both the nodes and
        the links in two different sections of the file:
      </p>

      <Code
        highlight
        lines={15}
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("pajek"),
        }}
      >
        {store.getExampleNetwork("pajek")}
      </Code>

      <p>
        The node section must start with <code>*Vertices N</code> and the link section with{" "}
        <code>*Edges N</code> or
        <code>*Arcs N</code> (case insensitive), where <code>N</code> is the number of nodes or
        links. The characters within each quotation mark defines the corresponding node name.
        Weights can be given to nodes by adding a third column with positive numbers, and the list
        of links are treated the same as for a link list.
      </p>

      <Heading id="InputBipartite" />
      <p>
        <a href="#--input-format">
          <code>-i bipartite</code>
        </a>
      </p>

      <p>
        A bipartite network has two types of nodes with links only between different node types. If
        we call them <em>primary</em> nodes and <em>feature</em> nodes, we can interpret shared
        feature nodes as indirect relations between primary nodes. When only relations between
        primary nodes are of interest, the bipartite network can be projected into a unipartite
        network of primary nodes. In this projection, each pair of links connecting primary nodes
        through a shared feature node is projected into a unipartite link between the connected
        primary nodes. However, such a projection to primary nodes gives an overload of links
        already for moderately dense networks. With the map equation for varying Markov times, we
        avoid this projection because{" "}
        <a href="https://www.mapequation.org/publications.html#Kheirkhahzadeh-Etal-2016-Markovtimes">
          a bipartite-to-unipartite projection corresponds to doubling the Markov time
        </a>
        . This approach approximates a two-step random walker. By shifting the flow from the feature
        nodes to primary nodes, the map equation encodes steps on the primary nodes while avoiding
        the drawback of a unipartite network projection.
      </p>

      <Message info>
        The bipartite dynamics described above is the default for the bipartite format, and makes
        sense for a sparse bipartite network (for which the two-step dynamics helps) where only the
        primary nodes are of interest. Otherwise, add the flag{" "}
        <a href="#--skip-adjust-bipartite-flow">
          <code>--skip-adjust-bipartite-flow</code>
        </a>{" "}
        or change the <code>*Bipartite</code> heading to <code>*Edges</code> to treat the network as
        unipartite.
      </Message>

      <Figure id="FigureBipartite" />

      <p>
        The bipartite format uses the heading <code>*Bipartite N</code> where <code>N</code> is the
        first node id of the feature node type. The bipartite network can be provided both with node
        names:
      </p>

      <Code
        highlight
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("bipartite"),
        }}
      >
        {store.getExampleNetwork("bipartite")}
      </Code>

      <p>and in the link list format:</p>

      <Code
        highlight
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("bipartiteLinkList"),
        }}
      >
        {store.getExampleNetwork("bipartiteLinkList")}
      </Code>

      <Heading id="InputMultilayer" />
      <p>
        <a href="#--input-format">
          <code>-i multilayer</code>
        </a>
      </p>

      <p>
        In a multilayer network, each physical node can exist in a number of <em>layers</em>, with
        different link structure for each layer. The physical nodes may be defined optionally as in
        the <a href="#InputPajek">Pajek format</a>, but for the links there are three different ways
        to define them, depending on the data you have. With the <code>*Multilayer</code> heading,
        you have to specify{" "}
        <a href="#InputMultilayerFull">all intra-layer and inter-layer links explicitly</a>. With
        the <code>*Intra</code> heading you only specify links <em>within</em> each layer and the
        links <em>between</em> layers are{" "}
        <a href="#InputMultilayerIntra">generated automatically</a> by inter-layer relaxation,{" "}
        <a href="#InputMultilayerIntraInter">optionally constrained by inter-layer links</a> defined
        under the <code>*Inter</code> heading. See the{" "}
        <a href="//mapequation.org/apps/multilayer-network/index.html">interactive storyboard</a>{" "}
        for an illustration.
      </p>

      <Heading id="InputMultilayerFull" />
      <p>
        <code>*Multilayer</code>
      </p>

      <p>
        This multilayer format gives full control over the flow within and between each layer and
        translates directly to a <a href="InputStates">state network</a>.
      </p>

      <Figure id="FigureMultilayerNetworkFull" />

      <Code
        highlight
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("multilayer"),
        }}
      >
        {store.getExampleNetwork("multilayer")}
      </Code>

      <Message info>
        The <code>*Multilayer</code> heading is no longer optional.
      </Message>

      <p>
        The <code>weight</code> column is optional. Links without the last column will get weight{" "}
        <code>1.0</code> by default.
      </p>

      <Heading id="InputMultilayerIntraInter" />
      <p>
        <code>*Intra</code> and <code>*Inter</code>
      </p>

      <p>
        The multilayer format above gives full control of the dynamics, and no other movements are
        encoded. However, it is often useful to consider a dynamics in which a random walker moves
        within a layer and with a given relax rate jumps to another layer without recording this
        movement, such that the constraints from moving in different layers can be gradually
        relaxed. This is achieved by a format that explicitely divides the links into two groups,
        links <em>within</em> layers under the <code>*Intra</code> heading and links{" "}
        <em>between</em> layers under the <code>*Inter</code> heading.
      </p>
      <p>
        For the <code>*Intra</code> links, the second layer column can be omitted. For the
        <code>*Inter</code> links, the second node can be omitted, as a shorthand for an{" "}
        <em>unrecorded jump between layers</em>. That is, each inter-layer link{" "}
        <code>layer1 node1 layer2</code> is expanded to weighted multilayer links{" "}
        <code>layer1 node1 layer2 node2</code>, one for each <code>node2</code> that{" "}
        <code>node1</code> is connected to in <code>layer2</code> with weight proportional to the
        weight of the link between <code>node1</code> and <code>node2</code> in
        <code>layer2</code>.
      </p>
      <p>
        In this way, the random walker seamlessly switches to a different layer at a rate
        proportional to the inter-layer link weight to that layer, and the encoded dynamics
        correspond to relaxed layer constraints.
      </p>

      <Figure id="FigureMultilayerNetworkIntraInter" />

      <Code
        highlight
        labelProps={{
          content: "Run example",
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
        If no inter-layer links are provided, the inter links will be generated from the intra link
        structure by relaxing the layer constraints with a global{" "}
        <a href="#--multilayer-relax-rate">
          <code>--multilayer-relax-rate</code>
        </a>{" "}
        for each node, default 0.15. For each node, Infomap will assume inter-layer links to each
        layer, expanded as <a href="InputMultilayerIntraInter">explained</a> for the{" "}
        <code>*Inter</code> links. However, the inter-layer links will be weighted proportionally to
        the weighted out degree of the same physical node in the target layer, resulting generally
        in non-uniform inter-layer transition probabilities.
      </p>

      <Figure id="FigureMultilayerNetworkIntra" />

      <Code
        highlight
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("multilayerIntra"),
        }}
      >
        {store.getExampleNetwork("multilayerIntra")}
      </Code>

      <Heading id="InputStates" />
      <p>
        <a href="#--input-format">
          <code>-i states</code>
        </a>
      </p>

      <p>
        The state format describes the exact network used internally by Infomap. It can model both
        ordinary networks and memory networks of variable order.
      </p>

      <Figure id="FigureStateNetwork" />

      <Code
        highlight
        lines={23}
        labelProps={{
          content: "Run example",
          onClick: () => store.runExample("states"),
        }}
      >
        {store.getExampleNetwork("states")}
      </Code>

      <p>
        The <code>*Vertices</code> section is optional and follows the Pajek format. It is used to
        name the physical nodes. The <code>*States</code> section describes all internal nodes with
        the format <code>state_id physical_id [name]</code>, where <code>name</code> is optional.
        The state id is referenced in the <code>*Links</code> section, and the physical id of the
        node is optionally referenced in the <code>*Vertices</code> section. The <code>*Links</code>{" "}
        section describes all links as <code>source target [weight]</code>, where{" "}
        <code>source</code> and
        <code>target</code> references the state id in the <code>*States</code> section.
      </p>
    </>
  );
};
