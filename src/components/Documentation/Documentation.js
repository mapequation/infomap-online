import React from "react";
import { Grid, Header } from "semantic-ui-react";
import TOC, { Heading } from "./TOC";
import Prerequisites from "./Prerequisites";
import Install from "./Install";
import Running from "./Running";
import Parameters from "./Parameters";
import Changelog from "./Changelog";
import Features from "./Features";
import Algorithm from "./Algorithm";
import Feedback from "./Feedback";
import References from "./References";

function Documentation() {
  return (
    <Grid container columns={2} className="documentation">
      <Grid.Column>
        <Header as="h1" id="Documentation">
          <a href="#Documentation">Table of contents</a>
        </Header>
        
        <TOC />

        
        <Heading id="Infomap" />
        <p>
          Infomap is a network clustering algorithm based on the <a href="https://www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">Map equation</a>.
          For more info, see <a href="#Features">features</a>.
        </p>

        <Install />
        <Prerequisites />

        <Heading id="InfomapOnline" />
        <p>
          Infomap Online is a client-side web application that makes it possible
          for users to run Infomap without any installation. Infomap runs
          locally on your computer and uploads no data to any server. We support
          this solution by compiling Infomap from C++ to JavaScript with{" "}
          <a href="//emscripten.org/">Emscripten</a>, which gives a performance
          penalty compared to the stand-alone version of Infomap.
        </p>
      </Grid.Column>
      <Grid.Column>
        <Running />
        <Parameters />
        <Changelog />
        <Features />
        <Algorithm />
        <Feedback />
        <References />
      </Grid.Column>
    </Grid>
  );
}

export default Documentation;
