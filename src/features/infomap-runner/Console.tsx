import { Box, chakra } from "@chakra-ui/react";
import { type ComponentProps, type ReactNode, useEffect, useRef } from "react";

type ConsoleProps = ComponentProps<typeof Box> & {
  placeholder: string;
  children?: ReactNode;
};

export default function Console({
  placeholder,
  children,
  ...props
}: ConsoleProps) {
  const ref = useRef<HTMLDivElement | null>(null);

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
      {...props}
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
