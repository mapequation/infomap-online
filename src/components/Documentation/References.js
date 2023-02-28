import { Code, Text, Heading as CkHeading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

const Version = dynamic(() => import("../InfomapVersion"), {
  ssr: false,
  loading: () => "2.6",
});

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
        BibTeX for all Map Equation software, including Infomap
      </Text>
      <Code fontSize="xs" whiteSpace="pre-wrap" display="block">
        {`@software{mapequation2022software,
  author = {Edler, Daniel and Holmgren, Anton and Rosvall, Martin},
  title = {{The MapEquation software package}},
  url = {https://mapequation.org},
  version = {`}
        <Version />
        {`},
  year = {2022}
}`}
      </Code>

      <Text fontWeight={600} my="1em">
        BibTeX for Infomap Online
      </Text>
      <Code fontSize="xs" whiteSpace="pre-wrap" display="block">
        {`@software{mapequation2022infomaponline,
  author = {Holmgren, Anton and Edler, Daniel and Rosvall, Martin},
  title = {{Infomap Online}},
  url = {https://mapequation.org/infomap},
  version = {2.0.0},
  year = {2022}
}`}
      </Code>
    </>
  );
}
