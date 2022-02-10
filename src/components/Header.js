import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import { FaGithub } from "react-icons/fa";
import "../styles/Header.module.css";

export default function Header() {
  const buttonProps = {
    _hover: { background: "transparent" },
  };

  return (
    <header className="page-header">
      <Container maxW="120ch">
        <HStack justify="space-between" align="center">
          <HStack justify="flex-start" align="center" spacing={3}>
            <a href="//mapequation.org">
              <img
                alt="MapEquation"
                className="mapequation-logo"
                src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
              />
            </a>
            <Box>
              <Heading fontSize="1.75rem" fontFamily="Philosopher, serif" fontWeight={700}>
                <span style={{ color: "#555" }}>Infomap</span>{" "}
                <span style={{ color: "#b22222" }}>Online</span>
              </Heading>
              <Text fontSize="0.95rem">
                Network community detection using the Map Equation framework
              </Text>
            </Box>
          </HStack>
          <ButtonGroup variant="ghost" colorScheme="blue">
            <Button as="a" rightIcon={<DownloadIcon />} href="#Install" {...buttonProps}>
              Infomap {Infomap.__version__}
            </Button>
            <IconButton
              as="a"
              href="//github.com/mapequation/infomap"
              aria-label="infomap github"
              icon={<FaGithub />}
              {...buttonProps}
            />
          </ButtonGroup>
        </HStack>
      </Container>
    </header>
  );
}
