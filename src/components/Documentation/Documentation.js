import React, { createRef } from "react";
import { Grid, Header, Rail, Ref, Responsive, Sticky, Divider } from "semantic-ui-react";
import Algorithm from "./Algorithm";
import Changelog from "./Changelog";
import Features from "./Features";
import Feedback from "./Feedback";
import Input from "./Input";
import Install from "./Install";
import Output from "./Output";
import Parameters from "./Parameters";
import Prerequisites from "./Prerequisites";
import References from "./References";
import Running from "./Running";
import TOC, { Heading } from "./TOC";


function Documentation() {
  const contextRef = createRef();
  const breakpoint = 1800;

  return (
    <Grid container stackable columns={2} className="documentation">
      <Ref innerRef={contextRef}>
        <Grid.Column>
          <Heading id="Infomap"/>
          <p>
            Infomap is a network clustering algorithm based on the <a
            href="https://www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">Map
            equation</a>.
            For more info, see <a href="#Features">features</a>.
          </p>

          <Heading id="InfomapOnline"/>
          <p>
            Infomap Online is a client-side web application that makes it possible
            for users to run Infomap without any installation. Infomap runs
            locally on your computer and uploads no data to any server. We support
            this solution by compiling Infomap from C++ to JavaScript with{" "}
            <a href="//emscripten.org/">Emscripten</a>, which gives a performance
            penalty compared to the stand-alone version of Infomap.
          </p>
          <p>
            The code for running Infomap as a web worker in the browser is available
            as a <a href="//www.npmjs.com/package/@mapequation/infomap">package on NPM</a>.
          </p>

          <Install/>
          <Prerequisites/>

          <Divider/>
          <Running/>
          <Input/>
          <Output/>

          <Responsive as={Rail} minWidth={breakpoint} position="left" dividing close style={{ width: 280 }}>
            <Sticky context={contextRef} offset={50}>
              <Header as="h2" style={{ marginTop: "0.5em" }}>
                Contents
              </Header>
              <TOC/>
            </Sticky>
          </Responsive>
        </Grid.Column>
      </Ref>
      <Grid.Column>
        <Parameters/>
        <Divider/>
        <Changelog/>
        <Features/>
        <Divider/>
        <Algorithm/>
        <Divider/>
        <Feedback/>
        <Divider/>
        <References/>
      </Grid.Column>
    </Grid>
  );
}

export default Documentation;
