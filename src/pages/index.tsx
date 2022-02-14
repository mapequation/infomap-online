import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
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
import styles from "../styles/Drawer.module.css";

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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-27168379-1"
        onLoad={() => {
          // @ts-ignore
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            // @ts-ignore
            dataLayer.push(arguments);
          }

          // @ts-ignore
          gtag("js", new Date());
          // @ts-ignore
          gtag("config", "UA-27168379-1");
        }}
      />

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
      <Infomap toast={toast} />
      <Documentation />
      <Footer />
    </div>
  );
};

export default Home;
