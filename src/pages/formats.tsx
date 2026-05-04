import { Container, Grid, GridItem } from "@chakra-ui/react";
import type { NextPage } from "next";
import Input from "../features/documentation/Input";
import Output from "../features/documentation/Output";

const FormatsPage: NextPage = () => {
  return (
    <Grid
      as={Container}
      maxW="container.xl"
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      mx="auto"
      p="1rem"
      gap={{ base: 0, lg: "4rem" }}
      lineHeight="1.6em"
      textShadow="rgba(255, 255, 255, 0.746094) 0 1px 0"
    >
      <GridItem>
        <Input />
      </GridItem>
      <GridItem>
        <Output />
      </GridItem>
    </Grid>
  );
};

export default FormatsPage;
