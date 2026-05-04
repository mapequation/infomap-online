import { Box, chakra } from "@chakra-ui/react";
import React from "react";
import Highlight from "./Highlight";

export default function Code({ highlight, children }) {
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
      <chakra.code border={0} bg="none" p={4}>
        {highlight ? <Highlight content={children} /> : children}
      </chakra.code>
    </Box>
  );
}
