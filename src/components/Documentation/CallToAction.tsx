import {
  Box,
  Button,
  Heading,
  Container,
  Grid,
  Text,
  Link,
} from "@chakra-ui/react";
import Code from "../Code";
import ExternalLink from "../ExternalLink";

export default function CallToAction() {
  return (
    <Grid
      as={Container}
      maxW="container.xl"
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      mx="auto"
      p={14}
      //p="1rem"
      gap={{ base: 0, lg: "4rem" }}
      lineHeight="1.6em"
      textShadow="rgba(255, 255, 255, 0.746094) 0 1px 0"
    >
      <Box
        height="100%"
        py={8}
        px={10}
        borderWidth={1}
        borderColor="blackAlpha.300"
        rounded="md"
        backgroundColor="whiteAlpha.700"
        boxShadow="sm"
        _hover={{
          backgroundColor: "whiteAlpha.900",
          boxShadow: "base",
        }}
        transition="all 0.3s"
      >
        <Heading fontSize="xl">Get Infomap</Heading>
        <Text mb={-5} mt={6} ml={1} fontSize="sm" color="gray.800">
          Python 3:
        </Text>
        {/* @ts-ignore */}
        <Code>pip install infomap</Code>
        <Text>
          For other alternatives, see <Link href="#Install">below</Link>.
        </Text>
      </Box>
      <Box
        height="100%"
        py={8}
        px={10}
        mt={{ sm: 10, lg: 0 }}
        borderWidth={1}
        borderColor="blackAlpha.300"
        rounded="md"
        backgroundColor="whiteAlpha.500"
        boxShadow="sm"
        _hover={{
          backgroundColor: "whiteAlpha.900",
          boxShadow: "base",
        }}
        transition="all 0.3s"
      >
        <Heading fontSize="xl" color="blackAlpha.700">
          Get Help
        </Heading>
        <Text mt={6} color="blackAlpha.700">
          We answer questions on Github discussions.
        </Text>
        <ExternalLink href="http://github.com/mapequation/infomap/discussions">
          Github Discussions
        </ExternalLink>
      </Box>
    </Grid>
  );
}
