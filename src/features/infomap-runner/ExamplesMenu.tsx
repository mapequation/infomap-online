import { Button, Flex, Text } from "@chakra-ui/react";
import * as exampleNetworks from "../../data/networks";
import useStore from "../../state";

const networks = [
  {
    name: "twoTriangles",
    label: "Two triangles",
    value: exampleNetworks.twoTriangles,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "nineTriangles",
    label: "Nine triangles",
    value: exampleNetworks.nineTriangles,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "bipartite",
    label: "Bipartite",
    value: exampleNetworks.bipartite,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "multilayerIntra",
    label: "Multilayer intra",
    value: exampleNetworks.multilayerIntra,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "multilayerIntraInter",
    label: "Multilayer intra/inter",
    value: exampleNetworks.multilayerIntraInter,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "multilayer",
    label: "Full multilayer",
    value: exampleNetworks.multilayer,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "states",
    label: "State network",
    value: exampleNetworks.states,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "karate",
    label: "Karate club",
    value: exampleNetworks.karate,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "modular_w",
    label: "Weighted modular",
    value: exampleNetworks.modular_w,
    args: {
      "--directed": false,
      "--two-level": true,
    },
  },
  {
    name: "modular_wd",
    label: "Weighted directed",
    value: exampleNetworks.modular_wd,
    args: {
      "--directed": true,
      "--two-level": true,
    },
  },
];

export default function ExampleNetworksList({ disabled }) {
  const store = useStore();

  return (
    <Flex pt={2} mt={2} gap={2} align="center" flexWrap="wrap" flexShrink={0}>
      <Text
        color="gray.500"
        fontFamily="monospace"
        fontSize="xs"
        letterSpacing="0.1em"
        textTransform="uppercase"
        mb={0}
        mr={1}
      >
        Examples
      </Text>
      {networks.map((network) => (
        <Button
          key={network.name}
          type="button"
          size="xs"
          variant="surface"
          disabled={disabled}
          onClick={() => {
            store.setActiveInput("network");
            store.setNetwork(network);
            Object.entries(network.args).forEach(([key, value]) => {
              const param = store.params.getParam(key);
              if (param.active !== value) {
                store.params.toggle(param);
              }
            });
          }}
        >
          {network.label}
        </Button>
      ))}
    </Flex>
  );
}
