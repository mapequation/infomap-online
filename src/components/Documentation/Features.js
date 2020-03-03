import React from "react";
import { Header } from "semantic-ui-react";
import { Heading } from "./TOC";

export default () => (
  <>
    <Heading id="Features" />

    <p>
      Infomap optimizes{" "}
      <a href="/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
        The Map equation
      </a>
      , which exploits the <em>information-theoretic</em> duality between the
      problem of compressing data, and the problem of detecting and extracting
      significant patterns or structures within those data.
    </p>

    <p>
      Specifically, the map equation is a flow-based method and operates on
      dynamics on the network.
    </p>

    <Header as="h3">(Un)weighted (un)directed links</Header>
    <p>
      Infomap handles both unweighted and weighted, undirected and directed
      links.
    </p>

    <Header as="h3">Two-level and multi-level solutions</Header>
    <p>
      Infomap clusters tightly interconnected nodes into modules (
      <a href="/publications.html#Rosvall-Bergstrom-2008-Maps-of-information-flow">
        two-level clustering
      </a>
      ) or the optimal number of nested modules (
      <a href="/publications.html#Rosvall-Bergstrom-2011-Multilevel">
        multi-level clustering
      </a>
      ).
    </p>

    <Header as="h3">First- and second-order dynamics</Header>
    <p>
      Infomap captures flow patterns modeled with both first-order dynamics (as
      on a conventional network: where flow moves to on the network only depends
      on where it currently is) and second-order dynamics (where flow moves to
      on the network both depends on where it currently is and where it just
      came from). Infomap captures second-order dynamics by performing
      first-order dynamics on <em>memory nodes</em>, see{" "}
      <a href="/publications.html#Rosvall-Etal-2014-Memory">
        Memory in network flows and its effects on spreading dynamics and
        community detection
      </a>{" "}
      and{" "}
      <a href="/apps/sparse-memory-network/index.html">
        this interactive storyboard
      </a>
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
      <a href="/publications.html#Domenico-Etal-2015-Multiplex">
        Identifying modular flows on multilayer networks reveals highly
        overlapping organization in interconnected systems
      </a>{" "}
      and{" "}
      <a href="/apps/multilayer-network/index.html">
        this interactive storyboard
      </a>
      .
    </p>
  </>
);
