import {
  Heading as CkHeading,
  Code,
  Container,
  Link,
  Text,
} from "@chakra-ui/react";

import type { NextPage } from "next";

const ReferencesPage: NextPage = () => {
  const currentYear = new Date().getFullYear();
  const bibtex = `@misc{mapequation${currentYear}software,
    title = {{The MapEquation software package}},
    author = {Edler, Daniel and Holmgren, Anton and Rosvall, Martin},
    howpublished = {\\url{https://mapequation.org}},
    year = ${currentYear},
}`;

  return (
    <Container maxW="2xl">
      <CkHeading as="h1" size="lg" mt={8} mb={6} id="HowToCite">
        How to cite
      </CkHeading>
      <p>
        If you use the software at mapequation.org in a research article, or
        otherwise want to refer to it, please cite a{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//www.mapequation.org/publications.html"
        >
          relevant publication
        </Link>{" "}
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
        {bibtex}
      </Code>
    </Container>
  );
};

export default ReferencesPage;
