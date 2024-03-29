import { Container } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Container
      as="footer"
      maxW="120ch"
      textAlign="center"
      p="40px 0"
      mt="180px"
    >
      &copy; {new Date().getFullYear()} mapequation.org &ndash;{" "}
      <a href="//www.mapequation.org/about.html#Terms">Terms</a>
    </Container>
  );
}
