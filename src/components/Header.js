import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { FaGithub } from "react-icons/fa";
import styles from "../styles/Header.module.css";

const Version = dynamic(() => import("./InfomapVersion"), { ssr: false });

export function CiteIcon() {
  return (
    <svg
      aria-hidden="true"
      height="16"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
    >
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M16 1.25v4.146a.25.25 0 01-.427.177L14.03 4.03l-3.75 3.75a.75.75 0 11-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0111.604 1h4.146a.25.25 0 01.25.25zM2.75 3.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-2.5a.75.75 0 111.5 0v2.5A1.75 1.75 0 0113.25 13H9.06l-2.573 2.573A1.457 1.457 0 014 14.543V13H2.75A1.75 1.75 0 011 11.25v-7.5C1 2.784 1.784 2 2.75 2h5.5a.75.75 0 010 1.5h-5.5z"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className={styles.header}>
      <Stack
        as={Container}
        maxW="container.xl"
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        justify="space-between"
        pt={5}
      >
        <HStack justify="flex-start" align="flex-start" spacing={3} mr="3em">
          <Box w="57px" h="57px" flexShrink="0">
            <a href="//mapequation.org">
              <img
                alt="MapEquation"
                role="presentation"
                width="57px"
                height="57px"
                src="//mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
              />
            </a>
          </Box>
          <Box>
            <Heading
              fontSize="1.75rem"
              fontFamily="Philosopher, serif"
              fontWeight={700}
            >
              <span style={{ color: "#555" }}>Infomap</span>{" "}
              <span style={{ color: "#b22222" }}>Online</span>
            </Heading>
            <Text fontSize="0.95rem" m={0}>
              Network community detection using the Map Equation framework
            </Text>
          </Box>
        </HStack>
        <ButtonGroup
          variant="outline"
          colorScheme="blue"
          pr={{ base: "3.3em", "2xl": 0 }}
        >
          <Button
            as="a"
            rightIcon={<CiteIcon />}
            href="#HowToCite"
            variant="ghost"
          >
            How to cite
          </Button>
          <Button as="a" rightIcon={<DownloadIcon />} href="#Install">
            Infomap <Version />
          </Button>
          <IconButton
            as="a"
            href="//github.com/mapequation/infomap"
            aria-label="infomap on github"
            icon={<FaGithub />}
          />
        </ButtonGroup>
      </Stack>
    </header>
  );
}
