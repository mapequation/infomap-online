import Code from "../Code";
import { Heading } from "../Contents";
import Message from "../Message";

export default function Running() {
  return (
    <>
      <Heading id="Running" />
      <p>
        If you installed Infomap with <code>pip</code>, run
      </p>
      <Code>infomap [params] network outdir</Code>
      <p>
        If you downloaded the binary or compiled Infomap from source, run
      </p>
      <Code>./Infomap [params] network outdir</Code>
      <p>on Linux and macOS, and</p>
      <Code>.\Infomap [params] network outdir</Code>
      <p>
        in the Windows command line. You can also use{" "}
        <code>--help</code> to list all parameters.
      </p>
      <p>
        The optional <a href="#Parameters">parameters</a> can appear anywhere
        in the command. <code>network</code> should point to a valid network
        file, and <code>outdir</code> should point to a directory where Infomap
        will write the output files.
      </p>
      <Message bg="info">
        If no <strong>parameters</strong> are provided, Infomap will assume an{" "}
        <strong>undirected</strong> network and try to partition it{" "}
        <strong>hierarchically</strong>.
      </Message>
    </>
  );
}
