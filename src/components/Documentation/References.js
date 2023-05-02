import { Code, Text } from "@chakra-ui/react";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";
import MapEquationBibTeX from "./MapEquationBibTeX";

export default function References() {
  return (
    <>
      <Heading id="HowToCite" />
      <p>
        If you are using the software at mapequation.org in one of your research
        articles or otherwise want to refer to it, please cite{" "}
        <ExternalLink href="//www.mapequation.org/publications.html">
          relevant publication
        </ExternalLink>{" "}
        or use the following format:
      </p>
      <p>
        D. Edler, A. Holmgren and M. Rosvall, The MapEquation software package,
        available online at <a href="//www.mapequation.org">mapequation.org</a>.
      </p>
      <Text fontWeight={600} my="1em">
        BibTeX
      </Text>
      <Code
        fontSize="xs"
        whiteSpace="pre-wrap"
        display="block"
        bg="white"
        p={2}
        lineHeight={1.5}
      >
        <MapEquationBibTeX />
      </Code>
    </>
  );
}
