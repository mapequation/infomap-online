import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import Script from "next/script";
import { infomapVersionLabel } from "../infomapVersion";
import ErrorBoundary from "./ErrorBoundary";
import "katex/dist/katex.min.css";
import { LuDownload, LuGithub, LuQuote } from "react-icons/lu";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const Layout = ({ children, fillViewport = false }) => {
  return (
    <Box
      minH="100dvh"
      h={fillViewport ? "100dvh" : undefined}
      overflow={fillViewport ? "hidden" : undefined}
      display="flex"
      flexDirection="column"
    >
      <Head>
        <title>
          Infomap - Network community detection using the Map Equation framework
        </title>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-27168379-1"
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];

          window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);

          window.gtag("js", new Date());
          window.gtag("config", "UA-27168379-1");
        }}
      />
      <Box
        as="header"
        style={{
          background:
            "linear-gradient(to bottom, rgba(100, 80, 50, 0.35) 0%, rgba(0, 0, 0, 0) 100% )",
        }}
        flexShrink={0}
      >
        <Container>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="flex-start"
            align="center"
            gap={10}
            py={5}
          >
            <NextLink href="/">
              <HStack justify="flex-start" align="center" gap={2}>
                <Box w="40px" h="40px" flexShrink="0">
                  <img
                    alt="MapEquation"
                    role="presentation"
                    width="40px"
                    height="40px"
                    src="//mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                  />
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
                </Box>
              </HStack>
            </NextLink>
            <Button asChild variant="ghost">
              <NextLink href="/online">Try it</NextLink>
            </Button>
            <Button asChild variant="ghost">
              <NextLink href="/install">Install</NextLink>
            </Button>
            <Button asChild variant="ghost">
              <NextLink href="/formats">Formats</NextLink>
            </Button>
            <Button asChild variant="ghost" marginEnd="auto">
              <NextLink href="/how-it-works">How it works</NextLink>
            </Button>
            <Button asChild variant="surface" size="sm">
              <NextLink href="/references">
                How to cite
                <LuQuote />
              </NextLink>
            </Button>
            <Button asChild variant="surface" size="sm">
              <a href="//github.com/mapequation/infomap/releases/latest">
                {infomapVersionLabel} <LuDownload />
              </a>
            </Button>
            <Button asChild variant="surface" size="sm">
              <a href="//github.com/mapequation/infomap">
                GitHub
                <LuGithub />
              </a>
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box
        as="main"
        flex="1"
        minH={0}
        display="flex"
        flexDirection="column"
        overflow={fillViewport ? "hidden" : undefined}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </Box>

      {!fillViewport && (
        <Container
          as="footer"
          flexShrink={0}
          py={12}
          my={12}
          borderTopWidth="1px"
          borderTopColor="blackAlpha.200"
        >
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={8}>
            <Stack gap={2}>
              <Heading as="h2" size="sm">
                Infomap Online
              </Heading>
              <Text color="gray.600" mb={0}>
                &copy; {new Date().getFullYear()} mapequation.org
              </Text>
            </Stack>

            <Stack gap={2}>
              <Text
                color="gray.500"
                fontFamily="monospace"
                fontSize="xs"
                letterSpacing="0.16em"
                textTransform="uppercase"
                mb={1}
              >
                Use
              </Text>
              <NextLink href="/online">Workbench</NextLink>
              <NextLink href="/install">Install</NextLink>
              <NextLink href="/formats">Input / output formats</NextLink>
              <NextLink href="/how-it-works">How it works</NextLink>
            </Stack>

            <Stack gap={2}>
              <Text
                color="gray.500"
                fontFamily="monospace"
                fontSize="xs"
                letterSpacing="0.16em"
                textTransform="uppercase"
                mb={1}
              >
                Reference
              </Text>
              <NextLink href="/references">How to cite</NextLink>
              <a href="//www.mapequation.org/publications.html">Publications</a>
              <a href="//mapequation.github.io/infomap/python">
                Python API docs
              </a>
              <a href="//mapequation.r-universe.dev/infomap">R-universe docs</a>
            </Stack>

            <Stack gap={2}>
              <Text
                color="gray.500"
                fontFamily="monospace"
                fontSize="xs"
                letterSpacing="0.16em"
                textTransform="uppercase"
                mb={1}
              >
                Project
              </Text>
              <a href="//github.com/mapequation/infomap">GitHub</a>
              <a href="//github.com/mapequation/infomap/releases/latest">
                Latest release
              </a>
              <a href="//github.com/mapequation/infomap/blob/master/CHANGELOG.md">
                Changelog
              </a>
              <a href="//github.com/mapequation/infomap/issues">
                Report an issue
              </a>
            </Stack>
          </SimpleGrid>
        </Container>
      )}
    </Box>
  );
};
