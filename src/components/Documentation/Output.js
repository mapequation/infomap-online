import React from "react";
import Infomap from "@mapequation/infomap";
import { Message } from "semantic-ui-react";
import store from "../../store";
import Code from "../Code";
import Highlight from "../Highlight";
import { Heading } from "./TOC";


export default () => {
  return (
    <>
      <Heading id="Output" />

      <p>
        By default, Infomap outputs a <a href="OutputTree">.tree</a>-file if no other output
        formats is specified. To output several outputs in a single run,
        use <code>-o tree,ftree,clu</code> (see <a href="#ParamsOutput">Output parameters</a>).
      </p>

      <p>
        All output formats start with a standardized heading which includes the
        Infomap version, the command line arguments, when it was started and completed,
        and resulting codelength:
      </p>

      <Code>
        <Highlight
          network={`# v${Infomap.__version__}
# ./Infomap network.net . --ftree --clu
# started at 2020-03-04 15:38:35
# completed in 0.114 s
# codelength 2.32073 bits
# relative codelength savings 9.22792%`}
        />
      </Code>

      <p>
        The relative codelength savings <i>S<sub>L</sub></i> is calculated as
      </p>

      <p style={{ margin: "-0.8em 0 0.2em 2em" }}>
        <i>S<sub>L</sub></i> = 1 &minus; <i>L</i>/<i>L<sub>1</sub></i>
      </p>

      <p>
        where <i>L</i> is the codelength and <i>L<sub>1</sub></i> is the one-level codelength.
      </p>

      <Message info>
        The <strong>Map format</strong> used by the old flash Network Navigator is deprecated.
      </Message>

      <Heading id="OutputTree" />
      <p>
        <code>--tree</code>, <code>-o tree</code>
      </p>

      <p>
        The default output format if no other output is specified.
        The resulting hierarchy will be written to a file with the
        extension <code>.tree</code> and corresponds to the best
        hierarchical partition (shortest description length) of the
        attempts. The output format has the pattern:
      </p>

      <Code>
        <Highlight network={store.outputFormat('tree')} />
      </Code>

      <p>
        Each row begins with the multilevel module assignments of a node.
        The module assignments are colon separated from coarse to fine level, and all
        modules within each level are sorted by the total flow (PageRank) of
        the nodes they contain.
      </p>
      <p>
        Further, the integer after the last colon is
        the rank within the finest-level module, the decimal number is the
        amount of flow in that node, i.e. the steady state population of
        random walkers, the part within quotation marks is the node name,
        and finally, the last integer is the id of the node in the
        original network file.
      </p>

      <Heading id="OutputFtree" />
      <p>
        <code>--ftree</code>, <code>-o ftree</code>
      </p>

      <p>
        The <a href="#OutputTree">Tree format</a> with an appended section
        of links with the flow between nodes within the same parent. The
        file is saved with the extension <code>.ftree</code>, and begins
        with the node hierarchy formatted as the tree format,
        followed by the links formatted as:
      </p>

      <Code>
        <Highlight network={store.outputFormat('ftreeLinks')} />
      </Code>

      <p>
        First is a line stating <code>undirected</code> or <code>directed</code> links.
        Then each module is identified by the <code>path</code> field,
        followed by all links between child nodes
        of that module.
      </p>
      <p>
        The <code>path</code> is a colon separated path in
        the tree from the <code>root</code> to finest-level modules. The
        links are sorted by flow within each module. Links entering or exiting
        the module are not included, but the flow on those links is aggregated
        to <code>enterFlow</code> and <code>exitFlow</code>.
        The number of edges and child nodes within each module is also included
        in the module header line, as defined in the commented line above.
      </p>

      <Heading id="OutputClu" />
      <p>
        <code>--clu</code>, <code>-o clu</code>
      </p>

      <p>
        A <code>.clu</code> file describes the best partition (shortest description length) of the
        attempts. By default, it will output the top level module assignments.
        To specify the module level,
        use <code>--clu-level &lt;i&gt;</code> where <code>&lt;i&gt;</code> is an integer.
      </p>
      <p>
        The format has the pattern:
      </p>

      <Code>
        <Highlight network={store.outputFormat('clu')} />
      </Code>

      <p>
        If the <code>.clu</code> file is used as an input clustering to
        Infomap, the <code>flow</code> column will not be used and may be omitted.
      </p>
    </>
  );
}
