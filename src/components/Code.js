import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Collapse } from "@chakra-ui/react";
import React, { useState } from "react";
import Highlight from "./Highlight";

export default function Code({
  highlight,
  startingHeight,
  labelProps,
  children,
}) {
  const [show, setShow] = useState(false);

  const inner = highlight ? <Highlight content={children} /> : children;

  const code = (
    <chakra.code fontSize="sm" p={4}>
      {inner}
    </chakra.code>
  );

  return (
    <Box
      my={6}
      lineHeight="1.2em"
      boxShadow="sm"
      bg="whiteAlpha.900"
      borderRadius="md"
      borderWidth={2}
      borderColor="blackAlpha.300"
      overflow="none"
    >
      {labelProps && (
        <Button
          size="sm"
          isFullWidth
          borderBottomRadius="none"
          {...labelProps}
        />
      )}

      {startingHeight && (
        <Collapse startingHeight={startingHeight} in={show}>
          {code}
        </Collapse>
      )}
      {!startingHeight && code}

      {startingHeight && (
        <Button
          size="xs"
          isFullWidth
          borderTopRadius="none"
          variant="outline"
          onClick={() => setShow(!show)}
          rightIcon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {show ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
}
