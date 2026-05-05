import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Layout } from "../shared/components/Layout";
import system from "../theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  const fillViewport = Boolean((Component as any).fillViewport);

  return (
    <>
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

      <ChakraProvider value={system}>
        <Layout fillViewport={fillViewport}>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  );
}
