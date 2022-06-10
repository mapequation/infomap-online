import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import * as exampleNetworks from "../../examples/networks";
import useStore from "../../store";

export default observer(function ExamplesMenu({ disabled }) {
  const store = useStore();

  const networks = [
    {
      name: "twoTriangles",
      label: "Two triangles",
      value: exampleNetworks.twoTriangles,
    },
    {
      name: "nineTriangles",
      label: "Nine triangles",
      value: exampleNetworks.nineTriangles,
    },
    {
      name: "bipartite",
      label: "Bipartite",
      value: exampleNetworks.bipartite,
    },
    {
      name: "multilayerIntra",
      label: "Multilayer with intra-layer links",
      value: exampleNetworks.multilayerIntra,
    },
    {
      name: "multilayerIntraInter",
      label: "Multilayer with intra and inter-layer links",
      value: exampleNetworks.multilayerIntraInter,
    },
    {
      name: "multilayer",
      label: "Full multilayer",
      value: exampleNetworks.multilayer,
    },
    {
      name: "states",
      label: "State network representation of multilayer network",
      value: exampleNetworks.states,
    },
    {
      name: "karate",
      label: "Zachary's karate club",
      value: exampleNetworks.karate,
    },
  ];

  return (
    <Menu>
      <MenuButton
        disabled={disabled}
        colorScheme="blue"
        as={IconButton}
        icon={<ChevronDownIcon />}
        borderLeftRadius={0}
        size="sm"
      />
      <MenuList>
        {networks.map((network) => (
          <MenuItem
            key={network.name}
            onClick={() => store.setNetwork(network)}
          >
            {network.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});
