import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Collapse,
  Container,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import * as d3 from "d3";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useStore from "../../store";
import Renderer from "./Renderer";

const zoom = d3.zoom().scaleExtent([0.1, 2000]);

export default observer(function Network() {
  const store = useStore();
  const ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) {
      return;
    }

    d3.select(currentRef)
      .call(zoom)
      .on("dblclick.zoom", null)
      .call(zoom.transform, d3.zoomIdentity);

    const zoomable = d3
      .select("#zoomable")
      .attr("transform", d3.zoomIdentity.toString());

    zoom.on("zoom", (event) => zoomable.attr("transform", event.transform));
  }, [isOpen]);

  const downloadSvg = () => {
    if (!ref.current) return;

    const svg = ref.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const filename = store.network.name + ".svg";
    saveAs(blob, filename);
  };

  const networkSize = useMemo(() => {
    if (!store.network.value) {
      return 0;
    }

    return store.network.value.split("\n").length;
  }, [store.network]);

  const maxNetworkLines = 500;

  return (
    <>
      <Container maxW="container.xl" my={10}>
        <Popover isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
          <PopoverTrigger>
            <ButtonGroup variant="ghost" size="sm" mb={2}>
              <Button
                onClick={() => {
                  if (isOpen || networkSize < maxNetworkLines) {
                    setIsOpen(!isOpen);
                  } else {
                    setIsConfirmOpen(true);
                  }
                }}
              >
                {isOpen ? "Hide network" : "Show network"}
              </Button>
              {isOpen && <Button onClick={downloadSvg}>Download SVG</Button>}
            </ButtonGroup>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>This may take a while to render.</PopoverHeader>
            <PopoverBody>
              <Button
                size="sm"
                ml="auto"
                colorScheme="blue"
                onClick={() => {
                  setIsConfirmOpen(false);
                  setIsOpen(true);
                }}
              >
                Proceed
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Collapse in={isOpen} unmountOnExit style={{ position: "relative" }}>
          <>
            <chakra.svg
              ref={ref}
              bg="white"
              borderColor="blackAlpha.300"
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              width="100%"
              height="clamp(200px, 50vw, 500px)"
              viewBox="-100 -100 200 200"
              xmlns={d3.namespaces.svg}
            >
              <g id="zoomable">
                <Renderer />
              </g>
            </chakra.svg>
            <Box
              pos="absolute"
              bottom={0}
              right={0}
              px={4}
              py={2}
              maxW="50%"
              bg="whiteAlpha.500"
              fontSize="xs"
              color="gray.500"
              borderRadius="md"
            >
              Infomap internal network representation.
              <br />
              Node and link sizes proportional to flow.
              <br />
              Colors from top-level modules (requires <tt>--clu</tt>).
            </Box>
          </>
        </Collapse>
      </Container>
    </>
  );
});
