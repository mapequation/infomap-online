import { Grid, GridItem } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { Divider } from "semantic-ui-react";
import Algorithm from "./Algorithm";
import Changelog from "./Changelog";
import { Heading } from "./Contents";
import Features from "./Features";
import Feedback from "./Feedback";
import "../../styles/Documentation.module.css";
import Input from "./Input";
import Install from "./Install";
import MapEquation from "./MapEquation";
import Output from "./Output";
import Parameters from "./Parameters";
import References from "./References";
import Running from "./Running";

function Documentation() {
  return (
    <Grid
      templateColumns="1fr 1fr"
      maxW="120ch"
      mx="auto"
      p="1rem"
      gap="4rem"
      lineHeight="1.6em"
      className="documentation"
    >
      <GridItem>
        <Heading id="Infomap" />
        <p>
          Infomap is a network clustering algorithm based on the{" "}
          <a href="https://www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation">
            Map Equation
          </a>
          :
        </p>
        <TeX
          math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
          block
        />

        <Heading id="InfomapOnline" />
        <p>
          Infomap Online is a client-side web application that enables users to run Infomap in the
          web browser. Your data never leaves your computer; we don't store any data on our servers.
        </p>
        <p>
          We achieve this by compiling Infomap from <a href="//emscripten.org">C++ to JavaScript</a>
          , which gives a performance penalty compared to the stand-alone version of Infomap.
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
      </GridItem>
      <GridItem>
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
      </GridItem>
    </Grid>
  );
}

export default Documentation;
