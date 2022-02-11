import { Box, Text } from "@chakra-ui/react";


export default function Message({ header, children, ...props }) {
  return <Box fontSize="sm" bg="whiteAlpha.700" borderRadius="md" borderColor="blackAlpha.300" borderWidth={1} p={4}
              my={4} {...props}>
    {header && <Text mb={2} fontWeight={600}>{header}</Text>}
    <Text mb={0}>{children}</Text>
  </Box>;
}
