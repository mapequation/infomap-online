import { Container, Heading, Link } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Container>
      <Heading as="h1" size="lg" mt={8} mb={6} id="Infomap">
        Infomap
      </Heading>
      <p>
        Infomap is a network clustering algorithm based on the{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="//www.mapequation.org/publications.html#Rosvall-Axelsson-Bergstrom-2009-Map-equation"
        >
          Map Equation
        </Link>
        . It finds modules by compressing the description of flow on a network:
      </p>
      <TeX
        math="L(M) = q_\curvearrowright H(\mathcal{Q}) + \sum_{i = 1}^{m}{p_{\circlearrowright}^i H(\mathcal{P}^i)}"
        block
      />

      <Heading as="h2" size="md" mt={8} mb={6} id="InfomapOnline">
        Infomap Online
      </Heading>
      <p>
        Infomap Online is a client-side web application for running Infomap in
        the browser. Your data never leaves your computer, and we do not store
        any data on our servers.
      </p>
      <p>
        We do this by compiling Infomap from{" "}
        <Link target="_blank" rel="noopener noreferrer" href="//emscripten.org">
          C++ to JavaScript
        </Link>
        , which makes the browser version slower than the stand-alone version of
        Infomap.
      </p>
    </Container>
  );
};

export default Home;
