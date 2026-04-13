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
import type { ReactNode } from "react";
import Contents from "../../components/Contents";
import styles from "../../styles/Drawer.module.css";

export default function ContentsDrawer({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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

      {children}
    </>
  );
}
