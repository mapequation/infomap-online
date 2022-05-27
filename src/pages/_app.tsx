import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ChakraProvider,
  cookieStorageManager,
  GlobalStyle,
  LightMode,
} from "@chakra-ui/react";
import theme from "../theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
      <LightMode>
        <GlobalStyle />
        <Component {...pageProps} />
      </LightMode>
    </ChakraProvider>
  );
}
