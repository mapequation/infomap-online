import {
  Box,
  Button,
  Link as CkLink,
  Container,
  chakra,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { LuArrowRight, LuCheck, LuCopy } from "react-icons/lu";
import { infomapVersion as softwareVersion } from "../shared/infomapVersion";

const currentYear = new Date().getFullYear();

const formats = [
  "BibTeX",
  "RIS",
  "APA",
  "MLA",
  "Plain text",
  "EndNote",
] as const;
type CitationFormat = (typeof formats)[number];
type CitationSet = Record<CitationFormat, string>;

const softwareCitation: CitationSet = {
  BibTeX: `@misc{mapequation${softwareVersion.replaceAll(".", "")}software,
  title        = {{The MapEquation software package}},
  author       = {Edler, Daniel and Holmgren, Anton and Rosvall, Martin},
  howpublished = {\\url{https://mapequation.org}},
  version      = {${softwareVersion}},
  year         = {${currentYear}},
}`,
  RIS: `TY  - COMP
TI  - The MapEquation software package
AU  - Edler, Daniel
AU  - Holmgren, Anton
AU  - Rosvall, Martin
PY  - ${currentYear}
ET  - ${softwareVersion}
UR  - https://mapequation.org
ER  -`,
  APA: `Edler, D., Holmgren, A., & Rosvall, M. (${currentYear}). The MapEquation software package (Version ${softwareVersion}) [Computer software]. https://mapequation.org`,
  MLA: `Edler, Daniel, Anton Holmgren, and Martin Rosvall. The MapEquation Software Package. Version ${softwareVersion}, ${currentYear}, mapequation.org.`,
  "Plain text": `D. Edler, A. Holmgren and M. Rosvall, The MapEquation software package, version ${softwareVersion}, available online at mapequation.org, ${currentYear}.`,
  EndNote: `%0 Computer Program
%T The MapEquation software package
%A Edler, Daniel
%A Holmgren, Anton
%A Rosvall, Martin
%D ${currentYear}
%7 ${softwareVersion}
%U https://mapequation.org`,
};

const paperCitation: CitationSet = {
  BibTeX: `@article{rosvall2008maps,
  title   = {Maps of random walks on complex networks reveal community structure},
  author  = {Rosvall, Martin and Bergstrom, Carl T.},
  journal = {Proceedings of the National Academy of Sciences},
  volume  = {105},
  number  = {4},
  pages   = {1118--1123},
  year    = {2008},
  doi     = {10.1073/pnas.0706851105},
}`,
  RIS: `TY  - JOUR
TI  - Maps of random walks on complex networks reveal community structure
AU  - Rosvall, Martin
AU  - Bergstrom, Carl T.
JO  - Proceedings of the National Academy of Sciences
VL  - 105
IS  - 4
SP  - 1118
EP  - 1123
PY  - 2008
DO  - 10.1073/pnas.0706851105
ER  -`,
  APA: `Rosvall, M., & Bergstrom, C. T. (2008). Maps of random walks on complex networks reveal community structure. Proceedings of the National Academy of Sciences, 105(4), 1118-1123. https://doi.org/10.1073/pnas.0706851105`,
  MLA: `Rosvall, Martin, and Carl T. Bergstrom. "Maps of Random Walks on Complex Networks Reveal Community Structure." Proceedings of the National Academy of Sciences, vol. 105, no. 4, 2008, pp. 1118-1123, doi:10.1073/pnas.0706851105.`,
  "Plain text": `M. Rosvall and C. T. Bergstrom, "Maps of random walks on complex networks reveal community structure," Proceedings of the National Academy of Sciences, vol. 105, no. 4, pp. 1118-1123, 2008.`,
  EndNote: `%0 Journal Article
%T Maps of random walks on complex networks reveal community structure
%A Rosvall, Martin
%A Bergstrom, Carl T.
%J Proceedings of the National Academy of Sciences
%V 105
%N 4
%P 1118-1123
%D 2008
%R 10.1073/pnas.0706851105`,
};

type RailItem =
  | { kind: "heading"; label: string; id?: never; href?: never }
  | { id: string; label: string; href?: string; kind?: never };

const railItems: RailItem[] = [
  { id: "Software", label: "Software" },
  { id: "MapEquationPaper", label: "Original map equation paper" },
  { id: "OtherPublications", label: "Other publications" },
];

const otherPublications = [
  {
    tag: "Tutorial",
    title:
      "Community Detection with the Map Equation and Infomap: Theory and Applications",
    authors: "Smiljanić, Blöcker, Holmgren, Edler, Neuman & Rosvall",
    venue: "ACM Computing Surveys, 2026",
    href: "https://doi.org/10.1145/3779648",
  },
  {
    tag: "Memory / multilayer",
    title:
      "Mapping higher-order network flows in memory and multilayer networks with Infomap",
    authors: "Edler, Bohlin & Rosvall",
    venue: "Algorithms, 2017",
    href: "https://doi.org/10.3390/a10040112",
  },
  {
    tag: "Flow modeling",
    title: "Mapping change in large networks",
    authors: "Rosvall & Bergstrom",
    venue: "PLoS ONE, 2010",
    href: "https://doi.org/10.1371/journal.pone.0008694",
  },
  {
    tag: "Map equation",
    title: "The map equation",
    authors: "Rosvall, Axelsson & Bergstrom",
    venue: "European Physical Journal Special Topics, 2009",
    href: "https://doi.org/10.1140/epjst/e2010-01179-1",
  },
];

function FormatPicker({
  value,
  onChange,
}: {
  value: CitationFormat;
  onChange: (format: CitationFormat) => void;
}) {
  return (
    <Flex gap={1.5} flexWrap="wrap" mb={3}>
      {formats.map((format) => (
        <Button
          key={format}
          type="button"
          size="xs"
          variant={value === format ? "solid" : "surface"}
          bg={value === format ? "gray.900" : undefined}
          color={value === format ? "white" : undefined}
          onClick={() => onChange(format)}
        >
          {format}
        </Button>
      ))}
    </Flex>
  );
}

function CitationBlock({ copyKey, value }: { copyKey: string; value: string }) {
  const [copied, setCopied] = useState("");

  return (
    <Box position="relative">
      <Box
        bg="gray.100"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflowX="auto"
      >
        <chakra.pre
          m={0}
          fontFamily="monospace"
          fontSize="sm"
          lineHeight={1.6}
          whiteSpace="pre-wrap"
        >
          {value}
        </chakra.pre>
      </Box>
      <Button
        type="button"
        variant="surface"
        size="xs"
        position="absolute"
        top={2}
        right={2}
        onClick={async () => {
          await navigator?.clipboard?.writeText(value);
          setCopied(copyKey);
          window.setTimeout(() => setCopied(""), 1400);
        }}
      >
        {copied === copyKey ? <LuCheck /> : <LuCopy />}
        {copied === copyKey ? "Copied" : "Copy"}
      </Button>
    </Box>
  );
}

function CitationCard({
  id,
  title,
  text,
  citation,
}: {
  id: string;
  title: string;
  text: string;
  citation: CitationSet;
}) {
  const [format, setFormat] = useState<CitationFormat>("BibTeX");

  return (
    <Box
      as="section"
      id={id}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={{ base: 5, md: 6 }}
      mb={5}
      scrollMarginTop="6rem"
    >
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "baseline" }}
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={2}
      >
        <Heading as="h2" size="md">
          {title}
        </Heading>
        {id === "Software" && (
          <Box
            as="span"
            bg="gray.100"
            color="gray.600"
            borderRadius="sm"
            px={2}
            py={1}
            fontFamily="monospace"
            fontSize="xs"
          >
            v{softwareVersion}
          </Box>
        )}
      </Flex>
      <Text color="gray.600" fontSize="sm" maxW="42rem">
        {text}
      </Text>
      <FormatPicker value={format} onChange={setFormat} />
      <CitationBlock copyKey={id} value={citation[format]} />
    </Box>
  );
}

const ReferencesPage: NextPage = () => {
  const [active, setActive] = useState("Software");

  return (
    <Container>
      <Grid
        templateColumns={{ base: "1fr", lg: "13rem 1fr" }}
        gap={{ base: 8, lg: 12 }}
        alignItems="start"
        mt={8}
      >
        <Box
          as="aside"
          display={{ base: "none", lg: "block" }}
          position="sticky"
          top="5rem"
        >
          <Text
            color="gray.500"
            fontFamily="monospace"
            fontSize="xs"
            letterSpacing="0.1em"
            textTransform="uppercase"
            mb={3}
          >
            On this page
          </Text>
          <Box borderLeftWidth="1px" borderLeftColor="gray.300">
            {railItems.map((item, index) =>
              item.kind === "heading" ? (
                <Text
                  key={`${item.label}-${index}`}
                  color="gray.500"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  px={4}
                  pt={4}
                  pb={1}
                  mb={0}
                >
                  {item.label}
                </Text>
              ) : item.href ? (
                <CkLink
                  key={item.id}
                  asChild
                  display="block"
                  color={active === item.id ? "gray.900" : "gray.500"}
                  fontWeight={active === item.id ? 700 : 400}
                  borderLeftWidth="2px"
                  borderLeftColor={
                    active === item.id ? "red.600" : "transparent"
                  }
                  ml="-1px"
                  px={4}
                  py={1.5}
                  fontSize="sm"
                  textDecoration="none"
                >
                  <NextLink href={item.href}>{item.label}</NextLink>
                </CkLink>
              ) : (
                <CkLink
                  key={item.id}
                  href={item.id ? `#${item.id}` : "#"}
                  display="block"
                  color={active === item.id ? "gray.900" : "gray.500"}
                  fontWeight={active === item.id ? 700 : 400}
                  borderLeftWidth="2px"
                  borderLeftColor={
                    active === item.id ? "red.600" : "transparent"
                  }
                  ml="-1px"
                  px={4}
                  py={1.5}
                  fontSize="sm"
                  textDecoration="none"
                  onClick={() => {
                    if (item.id) setActive(item.id);
                  }}
                >
                  {item.label}
                </CkLink>
              ),
            )}
          </Box>
        </Box>

        <Box as="main">
          <Text color="gray.500" fontSize="sm" mb={2}>
            Documentation
          </Text>
          <Heading as="h1" size="lg" mb={4} id="HowToCite">
            How to cite Infomap
          </Heading>

          <Text
            color="gray.700"
            fontSize={{ base: "md", md: "lg" }}
            maxW="44rem"
            mb={8}
          >
            Most papers using Infomap cite two things: the software package,
            which credits the implementation and version, and the map equation
            paper, which credits the method.
          </Text>

          <CitationCard
            id="Software"
            title="Software"
            text="Use this citation when you refer to Infomap as software, especially when reproducibility depends on the package or release version."
            citation={softwareCitation}
          />

          <CitationCard
            id="MapEquationPaper"
            title="Original map equation paper"
            text="Use this citation when you describe the map equation method, random-walk coding, or the algorithmic idea behind Infomap."
            citation={paperCitation}
          />

          <Box
            as="section"
            id="OtherPublications"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={{ base: 5, md: 6 }}
            mb={12}
            scrollMarginTop="6rem"
          >
            <Heading as="h2" size="md" mb={2}>
              Other publications
            </Heading>
            <Text color="gray.600" fontSize="sm" maxW="42rem">
              Cite feature-specific papers too when they describe the model you
              use, such as memory, multilayer, or higher-order network flows.
            </Text>

            <Stack gap={0} borderTopWidth="1px" borderTopColor="gray.200">
              {otherPublications.map((publication) => (
                <Grid
                  key={publication.title}
                  templateColumns={{ base: "1fr", md: "10rem 1fr auto" }}
                  gap={{ base: 2, md: 4 }}
                  alignItems="center"
                  py={4}
                  borderBottomWidth="1px"
                  borderBottomColor="gray.200"
                >
                  <Box
                    as="span"
                    bg="gray.100"
                    color="gray.600"
                    borderRadius="sm"
                    px={2}
                    py={1}
                    justifySelf="start"
                    fontFamily="monospace"
                    fontSize="xs"
                  >
                    {publication.tag}
                  </Box>
                  <Box>
                    <Text color="gray.900" fontWeight={600} mb={1}>
                      {publication.title}
                    </Text>
                    <Text color="gray.500" fontSize="sm" mb={0}>
                      {publication.authors} · {publication.venue}
                    </Text>
                  </Box>
                  <CkLink
                    href={publication.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="sm"
                    fontWeight={600}
                  >
                    Publication <LuArrowRight />
                  </CkLink>
                </Grid>
              ))}
            </Stack>

            <Flex gap={4} flexWrap="wrap" mt={4}>
              <CkLink
                href="//www.mapequation.org/publications.html"
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                fontWeight={600}
              >
                Full publication list <LuArrowRight />
              </CkLink>
            </Flex>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default ReferencesPage;
