import React from "react";
import { Header } from "semantic-ui-react";
import Code from "../Code";
import { Heading } from "./TOC";


export default () => {
  return (
    <>
      <Heading id="Input"/>

      <p>
        Infomap understands different file formats for the input network data,
        for example a minimal link list format or the standard Pajek format.
      </p>

      <p>
        Infomap will try to recognize the file format,
        but the format can be explicitly specified with the
        flags <code>-i</code> or <code>--input-format</code> followed
        by a format specifier.
      </p>

      <p>
        The following input formats can be used
      </p>

      <Heading id="InputLinkList"/>
      <p>
        <code>-i link-list</code>
      </p>

      <p>
        This is a minimal format to describe a network by only
        specifying a set of links:
      </p>

      <Code>#source target [weight]<br/>
        1 2 1<br/>
        1 3 1<br/>
        2 3 2<br/>
        3 5 0.5
      </Code>

      <p>
        Each line corresponds to the triad <code>source target weight</code> which
        describes a weighted link between the nodes with specified numbers.
        The <code>weight</code> can be any non-negative value. If omitted, the
        link weight will default to <code>1</code>.
      </p>

      <Heading id="InputPajek" />
      <p>
        <code>-i pajek</code>
      </p>

      <p>
        The <a href="http://pajek.imfm.si/doku.php">Pajek</a> format
        specifies both the nodes and the links in two different sections of
        the file:
      </p>

      <Code># A network in Pajek format<br/>
        *Vertices 4<br/>
        1 "1"<br/>
        2 "2"<br/>
        3 "3"<br/>
        4 "4"<br/>
        *Edges 4<br/>
        #source target [weight]<br/>
        1 2 1<br/>
        1 3 1<br/>
        1 4 1<br/>
        2 3 1
      </Code>

      <p>
        The node section must start with <code>*Vertices N</code> and the
        link section with <code>*Edges N</code> or
        <code>*Arcs N</code> (case insensitive), where <code>N</code> is the
        number of nodes or links. The characters within each quotation mark
        defines the corresponding node name. Weights can be given to nodes
        by adding a third column with positive numbers, and the list of
        links are treated the same as for a link list.
      </p>

      <Heading id="InputBipartite" />
      <p>
        <code>-i bipartite</code>
      </p>

      <p>
        The bipartite network format uses prefixes <code>f</code> and
        <code>n</code> for features and nodes, respectively. The bipartite
        network can be provided both with node names:
      </p>

      <Code># A bipartite network with node names<br/>
        *Vertices 5<br/>
        1 "Node 1"<br/>
        2 "Node 2"<br/>
        3 "Node 3"<br/>
        4 "Node 4"<br/>
        5 "Node 5"<br/>
        *Edges 6<br/>
        #feature node [weight]<br/>
        f1 n1 2<br/>
        f1 n2 2<br/>
        f1 n3 1<br/>
        f2 n3 1<br/>
        f2 n4 2<br/>
        f2 n5 2
      </Code>

      <p>and in the link list format:</p>

      <Code># A bipartite network in link list format<br/>
        #feature node [weight]<br/>
        f1 n1 2<br/>
        f1 n2 2<br/>
        f1 n3 1<br/>
        f2 n3 1<br/>
        f2 n4 2<br/>
        f2 n5 2
      </Code>

      <Heading id="InputMultilayer" />
      <p>
        <code>-i multilayer</code>
      </p>

      <p>
        In a multilayer network, each physical node can exist in a number
        of <em>layers</em>, with different link structure for each layer. A
        general multilayer format follows
        the Pajek layout, but with the links defined
        between nodes for each layer:
      </p>

      <Code># A network in a general multilayer format<br/>
        *Vertices 4<br/>
        1 "Node 1"<br/>
        2 "Node 2"<br/>
        3 "Node 3"<br/>
        4 "Node 4"<br/>
        *Multilayer<br/>
        #layer node layer node [weight]<br/>
        1 1 1 2 2<br/>
        1 1 2 2 1<br/>
        1 2 1 1 1<br/>
        1 3 2 2 1<br/>
        2 2 1 3 1<br/>
        2 3 2 2 1<br/>
        2 4 2 1 2<br/>
        2 4 1 2 1
      </Code>

      <p>
        The <code>weight</code> column is optional. Links without the last
        column will get weight <code>1.0</code> by default.
      </p>

      <p>
        If no heading (beginning with <code>*</code>) is given, the
        multilayer format assumes <code>*Multilayer</code> link format:
      </p>

      <Code># A network in a general multilayer format<br/>
        #layer node layer node [weight]<br/>
        1 1 1 2 2<br/>
        1 1 2 2 1<br/>
        1 2 1 1 1<br/>
        1 3 2 2 1<br/>
        2 2 1 3 1<br/>
        2 3 2 2 1<br/>
        2 4 2 1 2<br/>
        2 4 1 2 1
      </Code>

      <p>
        The multilayer format above gives full control of the dynamics, and
        no other movements are encoded. However, it is often useful to
        consider a dynamics in which a random walker moves within a layer
        and with a given relax rate jumps to another layer without recording
        this movement, such that the constraints from moving in different
        layers can be gradually relaxed. The format below explicitely
        divides the links into two groups, links <em>within</em> layers
        (intra-layer links) and links <em>between</em> layers (inter-layer
        links).
      </p>
      <p>
        For the first group, the second layer column can be omitted.
        For the second group, the second node can be omitted, as a shorthand
        for an <em>unrecorded jump between layers</em>. That is, each
        inter-layer link <code>layer1 node1 layer2</code> is expanded to
        weighted multilayer links <code>layer1 node1 layer2 node2</code>, one
        for each <code>node2</code> that <code>node1</code> is connected to
        in <code>layer2</code> with weight proportional to the weight of the
        link between <code>node1</code> and <code>node2</code> in
        <code>layer2</code>.
      </p>
      <p>
        In this way, the random walker seamlessly
        switches to a different layer at a rate proportional to the
        inter-layer link weight to that layer, and the encoded dynamics
        correspond to relaxed layer constraints (see
        the <a href="//mapequation.org/apps/multilayer-network/index.html"
      >interactive storyboard</a> for illustration).
      </p>
      <p>
        To define links like this, use the <code>*Intra</code> and <code>*Inter</code> headings:
      </p>

      <Code># A network in multilayer format<br/>
        *Intra<br/>
        #layer node node weight<br/>
        1 1 2 1<br/>
        1 2 1 1<br/>
        1 2 3 1<br/>
        1 3 2 1<br/>
        1 3 1 1<br/>
        1 1 3 1<br/>
        1 2 4 1<br/>
        1 4 2 1<br/>
        2 4 5 1<br/>
        2 5 4 1<br/>
        2 5 6 1<br/>
        2 6 5 1<br/>
        2 6 4 1<br/>
        2 4 6 1<br/>
        2 3 6 1<br/>
        2 6 3 1<br/>
        *Inter<br/>
        #layer node layer weight<br/>
        1 3 2<br/>
        2 3 1<br/>
        1 4 2<br/>
        2 4 1
      </Code>

      <p>
        If no inter links are provided, the inter links will be generated
        from the intra link structure by relaxing the layer constraints on
        those links.
      </p>

      <Heading id="InputStates" />
      <p>
        <code>-i states</code>
      </p>

      <p>
        The state format describes the exact network used internally by
        Infomap. It can model both ordinary networks and memory networks of
        variable order.
      </p>

      <Code># A network in state format<br/>
        *Vertices 4<br/>
        1 "PRE"<br/>
        2 "SCIENCE"<br/>
        3 "PRL"<br/>
        4 "BIO"<br/>
        *States<br/>
        #state_id physical_id [name]<br/>
        1 2 "1 2"<br/>
        2 3 "2 3"<br/>
        3 2 "4 2"<br/>
        4 4 "2 4"<br/>
        *Links<br/>
        #source_state_id target_state_id<br/>
        1 2<br/>
        3 4
      </Code>

      <p>
        The <code>*Vertices</code> section is optional and follows the
        Pajek format. It is used to name the
        physical nodes. The <code>*States</code> section describes all
        internal nodes with the format <code>state_id physical_id [name]</code>,
        where <code>name</code> is optional. The state id is referenced in
        the <code>*Links</code> section, and the physical id of the node is
        optionally referenced in the <code>*Vertices</code> section.
        The <code>*Links</code> section describes all links
        as <code>source target [weight]</code>, where <code>source</code> and
        <code>target</code> references the state id in
        the <code>*States</code> section.
      </p>
    </>
  );
}
