import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Stack,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { FaGithub } from "react-icons/fa";
import styles from "../styles/Header.module.css";

const Version = dynamic(() => import("./InfomapVersion"), { ssr: false });

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
