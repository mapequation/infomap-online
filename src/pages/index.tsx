import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Header from "../components/Header";
import Contents from "../components/Contents";
import Documentation from "../components/Documentation";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import Loading from "../components/Loading";
import styles from "../styles/Drawer.module.css";

const Network = dynamic(() => import("../components/Network"), {
  ssr: false,
  loading: Loading,
});

const Infomap = dynamic(() => import("../components/Infomap"), { ssr: false });

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <div>
      <Head>
        <title>
          Infomap - Network community detection using the Map Equation framework
        </title>
      </Head>

      <IconButton
        aria-label="contents"
        icon={<HamburgerIcon />}
        variant="outline"
        bg={{ base: "whiteAlpha.800", xl: "whiteAlpha.500" }}
        onClick={onOpen}
        pos="fixed"
        visibility={isOpen ? "hidden" : "visible"}
        top={5}
        right={5}
        zIndex={5000}
        boxShadow={{ base: "md", xl: "none" }}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        blockScrollOnMount={false}
      >
        <DrawerOverlay bg="transparent" />
        <DrawerContent className={styles.drawer}>
          <DrawerCloseButton top={5} right={5} variant="outline" />
          <DrawerHeader>Contents</DrawerHeader>
          <DrawerBody>
            <Contents />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Header />

      <ErrorBoundary>
        <Infomap toast={toast} />
      </ErrorBoundary>

      <ErrorBoundary>
        <Network />
      </ErrorBoundary>

      <Documentation />
      <Footer />
    </div>
  );
};

export default Home;
