import { Grid, GridItem } from "@chakra-ui/react";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import styles from "../../styles/Documentation.module.css";
import Algorithm from "./Algorithm";
import Features from "./Features";
import Feedback from "./Feedback";
import MapEquation from "./MapEquation";
import References from "./References";
import Infomap from "./Infomap";
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
    <Grid
      templateColumns="1fr 1fr"
      maxW={{
        base: "100%",
        lg: "62em",
        xl: "80em",
      }}
      mx="auto"
      p="1rem"
      gap="4rem"
      lineHeight="1.6em"
      className={styles.documentation}
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
  );
}

export default Documentation;
