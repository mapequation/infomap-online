import { Box, chakra } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function Console({ placeholder, children }) {
  const ref = useRef();

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const { scrollHeight, clientHeight } = currentRef;
    currentRef.scrollTop = scrollHeight - clientHeight;
  }, [children]);

  return (
    <Box
      bg="white"
      h="60ch"
      px="1rem"
      py="0.5rem"
      fontSize="sm"
      overflow="auto"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="md"
      ref={ref}
    >
      {children ? (
        <chakra.code fontSize="0.6rem" border="none" bg="none">
          {children}
        </chakra.code>
      ) : (
        <Box color="gray.400">{placeholder}</Box>
      )}
    </Box>
  );
}
