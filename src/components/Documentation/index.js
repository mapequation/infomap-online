import { Container, Grid, GridItem } from "@chakra-ui/react";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import Algorithm from "./Algorithm";
import CallToAction from "./CallToAction";
import Features from "./Features";
import Feedback from "./Feedback";
import Infomap from "./Infomap";
import MapEquation from "./MapEquation";
import References from "./References";
import Running from "./Running";
// import Input from "./Input";
// import Output from "./Output";
// import Parameters from "./Parameters";
// import Changelog from "./Changelog";

const Input = dynamic(() => import("./Input"), { ssr: false });
const Output = dynamic(() => import("./Output"), { ssr: false });
const Parameters = dynamic(() => import("./Parameters"), { ssr: false });
const Changelog = dynamic(() => import("./Changelog"), { ssr: false });

function Documentation() {
  return (
    <>
      <CallToAction />
      <Grid
        as={Container}
        maxW="container.xl"
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        mx="auto"
        p="1rem"
        gap={{ base: 0, lg: "4rem" }}
        lineHeight="1.6em"
        textShadow="rgba(255, 255, 255, 0.746094) 0 1px 0"
      >
        <GridItem>
          <Infomap />
          <Running />
          <Input />
          <Output />
        </GridItem>
        <GridItem>
          <Parameters />
          <Changelog />
          <MapEquation />
          <Features />
          <Algorithm />
          <Feedback />
          <References />
        </GridItem>
      </Grid>
    </>
  );
}

export default Documentation;
