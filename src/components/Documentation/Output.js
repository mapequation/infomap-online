import Infomap, { changelog as infomapChangelog } from "@mapequation/infomap";
import React from "react";
import { Message } from "semantic-ui-react";
import store from "../../store";
import Code from "../Code";
import { Heading } from "./Contents";
import { BlockMath, InlineMath } from "react-katex";
import Figure, { FigLink } from "./Figure";

// 2020-03-30T22:07:26+02:00 -> 2020-03-30 22:07:26
const dateOfLastVersion = infomapChangelog[0].date.replace("T", " ").substring(0, 19);

export default () => {
  return (
    <>
      <Heading id="Output" />

      <p>
        By default, Infomap outputs a <a href="#OutputTree">.tree</a>-file if no other output
        formats is specified. To output several outputs in a single run, use{" "}
        <code>-o tree,ftree,clu</code> (see <a href="#ParamsOutput">Output parameters</a>).
      </p>

      <p>
        All output formats start with a standardized heading which includes the Infomap version, the
        command line arguments, when it was started and completed, and resulting codelength:
      </p>

      <Code highlight>
        {`# v${Infomap.__version__}
# ./Infomap network.net . --ftree --clu
# started at ${dateOfLastVersion}
# completed in 0.114 s
# partitioned into 2 levels with 2 top modules
# codelength 2.32073 bits
# relative codelength savings 9.22792%`}
      </Code>

      <p>
        The relative codelength savings <InlineMath>S_L</InlineMath> is calculated as
      </p>

      <BlockMath math="S_L = 1 - \frac{L}{L_1}" />

      <p>
        where <InlineMath>L</InlineMath> is the codelength and <InlineMath>L_1</InlineMath> is the
        one-level codelength.
      </p>

      <Message info>
        The <strong>Map format</strong> used by the old flash Network Navigator is deprecated.
      </Message>

      <Heading id="PhysicalAndStateOutput" />
      <p>
        The map equation for first-order network flows measures the description length of a random
        walker stepping between physical nodes within and between modules. This principle remains
        the same also for higher-order network flows, although higher-order models guide the random
        walker between physical nodes with the help of state nodes. Therefore, extending the map
        equation to higher-order network flows, including those described by memory, multilayer, and
        sparse memory networks, is straightforward. The only difference is at the finest level (
        <FigLink id="FigurePhysicalAndStateNodes" />
        b). State nodes of the same physical node assigned to the same module should share code
        word, or they would not represent the same object.
      </p>

      <p>
        For higher-order networks, Infomap writes two files for each of the <code>clu</code>,
        <code>tree</code> and <code>ftree</code> output option. The extra file has{" "}
        <code>_states</code>
        appended to the name before the extension and describes the internal state-level network. In
        the ordinary output, state nodes within each module are merged if they belong to the same
        physical node, corresponding to how the Map Equation for higher-order networks only encode
        observable flow. If state nodes of the same physical node exist in different modules, the
        node id in the physical output will occur more than once, corresponding to overlapping
        modules. In the state-level output however, each node only exist in one module.
      </p>

      <Figure id="FigurePhysicalAndStateNodes" />

      <div id="tree"></div>
      <Heading id="OutputTree" />
      <p>
        <code>--tree</code>, <code>-o tree</code>
      </p>

      <p>
        The default output format if no other output is specified. The resulting hierarchy will be
        written to a file with the extension <code>.tree</code> and corresponds to the best
        hierarchical partition (shortest description length) of the attempts. The output format has
        the pattern:
      </p>

      <Code highlight>{store.getOutputFormat("tree")}</Code>

      <p>
        Each row begins with the multilevel module assignments of a node. The module assignments are
        colon separated from coarse to fine level, and all modules within each level are sorted by
        the total flow (PageRank) of the nodes they contain.
      </p>
      <p>
        Further, the integer after the last colon is the rank within the finest-level module, the
        decimal number is the amount of flow in that node, i.e. the steady state population of
        random walkers, the part within quotation marks is the node name, and finally, the last
        integer is the id of the node in the original network file.
      </p>

      <Heading id="OutputFtree" />
      <p>
        <code>--ftree</code>, <code>-o ftree</code>
      </p>

      <p>
        The <a href="#OutputTree">Tree format</a> with an appended section of links with the flow
        between nodes within the same parent. The file is saved with the extension{" "}
        <code>.ftree</code>, and begins with the node hierarchy formatted as the tree format,
        followed by the links formatted as:
      </p>

      <Code highlight>{store.getOutputFormat("ftreeLinks")}</Code>

      <p>
        First is a line stating <code>undirected</code> or <code>directed</code> links. Then each
        module is identified by the <code>path</code> field, followed by all links between child
        nodes of that module.
      </p>
      <p>
        The <code>path</code> is a colon separated path in the tree from the <code>root</code> to
        finest-level modules. The links are sorted by flow within each module. Links entering or
        exiting the module are not included, but the flow on those links is aggregated to{" "}
        <code>enterFlow</code> and <code>exitFlow</code>. The number of edges and child nodes within
        each module is also included in the module header line, as defined in the commented line
        above.
      </p>

      <div id="clu" />
      <Heading id="OutputClu" />
      <p>
        <code>--clu</code>, <code>-o clu</code>
      </p>

      <p>
        A <code>.clu</code> file describes the best partition (shortest description length) of the
        attempts. By default, it will output the top level module assignments. To specify the module
        level, use <code>--clu-level &lt;i&gt;</code> where <code>&lt;i&gt;</code> is an integer.
      </p>
      <p>The format has the pattern:</p>

      <Code highlight>{store.getOutputFormat("clu")}</Code>

      <p>
        If the <code>.clu</code> file is used as an input clustering to Infomap, the{" "}
        <code>flow</code> column will not be used and may be omitted.
      </p>

      <div id="newick" />
      <Heading id="OutputNewick" />
      <p>
        <code>-o newick</code>
      </p>

      <p>The format has the pattern:</p>

      <Code highlight>{store.getOutputFormat("newick")}</Code>

      <div id="json" />
      <Heading id="OutputJson" />
      <p>
        <code>-o json</code>
      </p>

      <p>The format has the pattern:</p>

      <Code highlight>{store.getOutputFormat("json")}</Code>
    </>
  );
};
