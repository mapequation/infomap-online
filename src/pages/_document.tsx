import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Infomap - Network community detection using the Map Equation framework"
        />
        <meta name="author" content="" />

        <meta property="og:title" content="Infomap" />
        <meta property="og:site_name" content="mapequation.org" />
        <meta
          property="og:description"
          content="Network community detection using the Map Equation framework"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mapequation.org/infomap" />
        <meta
          property="og:image"
          content="https://www.mapequation.org/assets/img/infomap-online.png"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Infomap Online" />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Infomap - Network community detection using the Map Equation framework"
        />
        <meta
          name="twitter:description"
          content="Infomap finds important patterns in complex networks by optimizing the map equation, which exploits the information-theoretic duality between the problem of compressing data and detecting patterns."
        />
        <meta name="twitter:url" content="https://www.mapequation.org/infomap" />
        <meta
          name="twitter:image"
          content="https://www.mapequation.org/assets/img/infomap-online.png"
        />

        <link rel="shortcut icon" href="https://www.mapequation.org/assets/img/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://www.mapequation.org/assets/img/icons/apple-touch-icon-57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://www.mapequation.org/assets/img/icons/apple-touch-icon-72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://www.mapequation.org/assets/img/icons/apple-touch-icon-114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://www.mapequation.org/assets/img/icons/apple-touch-icon-144.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
