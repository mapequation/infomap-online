import "katex/dist/katex.min.css";
import React, { createRef } from "react";
import { BlockMath } from "react-katex";
import { Divider, Grid, Header, Message, Rail, Ref, Responsive, Sticky } from "semantic-ui-react";
import Algorithm from "./Algorithm";
import Changelog from "./Changelog";
import Contents, { Heading } from "./Contents";
import Features from "./Features";
import Feedback from "./Feedback";
import "./index.css";
import Input from "./Input";
import Install from "./Install";
import MapEquation from "./MapEquation";
import Output from "./Output";
import Parameters from "./Parameters";
import References from "./References";
import Running from "./Running";

function Documentation() {
  const contextRef = createRef();
  const breakpoint = 1800;

  return (
    <Grid container stackable columns={2} className="documentation">
      <Ref innerRef={contextRef}>
        <Grid.Column>
          <Heading id="Infomap" />
          <p>
            Infomap is a network clustering algorithm based on the{" "}
            <a href="https://www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
              Map Equation
            </a>
            :
          </p>
          <BlockMath math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}" />

          <Heading id="InfomapOnline" />
          <p>
            Infomap Online is a client-side web application that enables users to run
            Infomap in the web browser.
            Your data never leaves your computer; we don't store any
            data on our servers.
          </p>
          <p>
            We achieve this by compiling Infomap from <a href="//emscripten.org">C++ to JavaScript</a>,
            which gives a performance penalty compared to the stand-alone version of Infomap.
          </p>
          <p>
            If you want to integrate Infomap in your own web application, you can use the{" "}
            <a href="//www.npmjs.com/package/@mapequation/infomap">Infomap NPM package</a>.
          </p>

          <Install />
          <Divider />
          <Running />
          <Input />
          <Output />

          <Responsive
            as={Rail}
            minWidth={breakpoint}
            position="left"
            dividing
            close
            style={{ width: 280 }}
          >
            <Sticky context={contextRef} offset={50}>
              <Header as="h2" style={{ marginTop: "0.5em" }}>
                Contents
              </Header>
              <Contents />
            </Sticky>
          </Responsive>
        </Grid.Column>
      </Ref>
      <Grid.Column>
        <Parameters />
        <Divider />
        <Changelog />
        <MapEquation />
        <Features />
        <Divider />
        <Algorithm />
        <Divider />
        <Feedback />
        <Divider />
        <References />
      </Grid.Column>
    </Grid>
  );
}

export default Documentation;
