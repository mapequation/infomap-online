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
import Documentation from "./components/Documentation";
import Contents from "./components/Documentation/Contents";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Infomap from "./components/Infomap";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
    </>
  );
}

export default App;
