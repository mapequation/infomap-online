import { Container, Grid, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Grid as={Container} placeItems="center" maxW="container.xl" h="20em">
      <Spinner size="xl" />
    </Grid>
  );
}
