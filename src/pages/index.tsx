import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
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
} from "@chakra-ui/react";
import Contents from "../components/Documentation/Contents";
import Footer from "../components/Footer";

const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Infomap = dynamic(() => import("../components/Infomap"), { ssr: false });
const Documentation = dynamic(() => import("../components/Documentation"), { ssr: false });

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Head>
        <title>Infomap - Network community detection using the Map Equation framework</title>
        <meta name="description" content="Generated by create next app" />
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
        variant="ghost"
        onClick={onOpen}
        pos="fixed"
        top={15}
        left={15}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        blockScrollOnMount={false}
      >
        <DrawerOverlay bg="transparent" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Contents</DrawerHeader>
          <DrawerBody>
            <Contents />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Header />
      <Infomap />
      <Documentation />
      <Footer />
    </div>
  );
};

export default Home;
