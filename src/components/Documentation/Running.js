import Code from "../Code";
import Message from "../Message";
import { Heading } from "../Contents";


export default function Running() {
  return (
    <>
      <Heading id="Running" />
      <p>
        If you installed Infomap using <code>pip</code>, usage is
      </p>
      <Code>infomap [params] network outdir</Code>
      <p>If you downloaded the binary or compiled Infomap from source, usage is</p>
      <Code>./Infomap [params] network outdir</Code>
      on Linux and macOS and
      <Code>.\Infomap [params] network outdir</Code>
      <p>
        in the Windows command line. You can also use the <code>--help</code> option to get a list
        of all parameters.
      </p>
      <p>
        The optional <a href="#Parameters">parameters</a> can be put anywhere. The{" "}
        <code>network</code> should point to a valid network file and <code>outdir</code> to a
        directory where Infomap should write output files.
      </p>

      <Message bg="info">
        If no <strong>parameters</strong> are provided, Infomap will assume an{" "}
        <strong>undirected</strong> network and try to partition it <strong>hierarchically</strong>.
      </Message>
    </>
  );
}
