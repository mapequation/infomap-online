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
import { LuDownload, LuGithub } from "react-icons/lu";

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
            direction="row"
            flexWrap="wrap"
            justify={{ base: "center", lg: "flex-start" }}
            align="center"
            columnGap={{ base: 1, sm: 2, md: 3 }}
            rowGap={{ base: 2, md: 3 }}
            py={{ base: 3, md: 5 }}
            minW={0}
          >
            <NextLink href="/" style={{ maxWidth: "100%", minWidth: 0 }}>
              <HStack
                justify={{ base: "center", sm: "flex-start" }}
                align="center"
                gap={2}
                flexBasis={{ base: "100%", sm: "auto" }}
                mr={{ base: 0, md: 4 }}
                minW={0}
              >
                <Box
                  w={{ base: "32px", sm: "40px" }}
                  h={{ base: "32px", sm: "40px" }}
                  flexShrink="0"
                >
                  <img
                    alt="MapEquation"
                    role="presentation"
                    width="40"
                    height="40"
                    src="//mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                  />
                </Box>

                <Box minW={0}>
                  <Heading
                    fontSize={{ base: "1.35rem", sm: "1.55rem", md: "1.75rem" }}
                    fontFamily="Philosopher, serif"
                    fontWeight={700}
                  >
                    <span style={{ color: "#555" }}>Infomap</span>{" "}
                    <span style={{ color: "#b22222" }}>Online</span>
                  </Heading>
                </Box>
              </HStack>
            </NextLink>
            <Button asChild variant="ghost" size={{ base: "sm", md: "md" }}>
              <NextLink href="/online">Try it</NextLink>
            </Button>
            <Button asChild variant="ghost" size={{ base: "sm", md: "md" }}>
              <NextLink href="/install">Install</NextLink>
            </Button>
            <Button asChild variant="ghost" size={{ base: "sm", md: "md" }}>
              <NextLink href="/formats">Formats</NextLink>
            </Button>
            <Button asChild variant="ghost" size={{ base: "sm", md: "md" }}>
              <NextLink href="/how-it-works">How it works</NextLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              marginEnd={{ base: 0, lg: "auto" }}
            >
              <NextLink href="/references">How to cite</NextLink>
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
                Documentation
              </Text>
              <NextLink href="/install">Install</NextLink>
              <NextLink href="/formats">Formats</NextLink>
              <NextLink href="/how-it-works">How it works</NextLink>
              <NextLink href="/references">How to cite</NextLink>
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
              <a href="//mapequation.github.io/infomap/python">Python API</a>
              <a href="//mapequation.r-universe.dev/infomap">R-universe</a>
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
              <a href="//github.com/mapequation/infomap/issues">Issues</a>
              <a href="//github.com/mapequation/infomap/discussions">
                Discussions
              </a>
              <a href="//github.com/mapequation/infomap/blob/master/CHANGELOG.md">
                Changelog
              </a>
            </Stack>
          </SimpleGrid>
        </Container>
      )}
    </Box>
  );
};
