import { Container } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Container as="footer" maxW="120ch" textAlign="center" p="40px 0" mt="180px">
      &copy; 2020 mapequation.org &ndash;{" "}
      <a href="https://www.mapequation.org/about.html#Terms">Terms</a>
    </Container>
  );
}
