import { useToast } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Documentation from "../../components/Documentation";
import ErrorBoundary from "../../components/ErrorBoundary";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import ContentsDrawer from "./ContentsDrawer";

const Network = dynamic(() => import("../../components/Network"), {
  ssr: false,
  loading: Loading,
});

const Infomap = dynamic(() => import("../../components/Infomap"), {
  ssr: false,
  loading: Loading,
});

export default function HomePage() {
  const toast = useToast();

  return (
    <div>
      <Head>
        <title>
          Infomap - Network community detection using the Map Equation framework
        </title>
      </Head>

      <ContentsDrawer>
        <Header />

        <ErrorBoundary>
          <Infomap toast={toast} />
        </ErrorBoundary>

        <ErrorBoundary>
          <Network />
        </ErrorBoundary>

        <Documentation />
        <Footer />
      </ContentsDrawer>
    </div>
  );
}
