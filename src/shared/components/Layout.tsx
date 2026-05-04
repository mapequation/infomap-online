import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
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
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="flex-start"
          align="center"
          gap={10}
          p={5}
        >
          <Link href="/">
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
          </Link>
          <Button asChild variant="ghost">
            <Link href="/online">Try it</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/install">Install</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/formats">Formats</Link>
          </Button>
          <Button asChild variant="ghost" marginEnd="auto">
            <Link href="/how-it-works">How it works</Link>
          </Button>
          <Button asChild variant="surface" size="sm">
            <Link href="/references">
              How to cite
              <LuQuote />
            </Link>
          </Button>
          <Button asChild variant="surface" size="sm">
            <a href="//github.com/mapequation/infomap/releases/latest">
              v2.10.0 <LuDownload />
            </a>
          </Button>
          <Button asChild variant="surface" size="sm">
            <a href="//github.com/mapequation/infomap">
              GitHub
              <LuGithub />
            </a>
          </Button>
        </Stack>
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

      <Container
        as="footer"
        maxW="120ch"
        flexShrink={0}
        textAlign="center"
        py={4}
      >
        &copy; {new Date().getFullYear()} mapequation.org &ndash;{" "}
        <a href="//www.mapequation.org/about.html#Terms">Terms</a>
      </Container>
    </Box>
  );
};
