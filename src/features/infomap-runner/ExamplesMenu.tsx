// @ts-nocheck
import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import * as exampleNetworks from "../../data/networks";
import useStore from "../../store";

export default function ExamplesMenu({ disabled }) {
  const store = useStore();

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
      label: "Multilayer with intra-layer links",
      value: exampleNetworks.multilayerIntra,
      args: {
        "--directed": false,
        "--two-level": true,
      },
    },
    {
      name: "multilayerIntraInter",
      label: "Multilayer with intra and inter-layer links",
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
      label: "State network representation of multilayer network",
      value: exampleNetworks.states,
      args: {
        "--directed": false,
        "--two-level": true,
      },
    },
    {
      name: "karate",
      label: "Zachary's karate club",
      value: exampleNetworks.karate,
      args: {
        "--directed": false,
        "--two-level": true,
      },
    },
    {
      name: "modular_w",
      label: "Modular network with weighted links",
      value: exampleNetworks.modular_w,
      args: {
        "--directed": false,
        "--two-level": true,
      },
    },
    {
      name: "modular_wd",
      label: "Modular network with weighted directed links",
      value: exampleNetworks.modular_wd,
      args: {
        "--directed": true,
        "--two-level": true,
      },
    },
  ];

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          disabled={disabled}
          colorPalette="blue"
          aria-label="Choose example network"
          borderLeftRadius={0}
          size="sm"
        >
          <FiChevronDown />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {networks.map((network) => (
              <Menu.Item
                key={network.name}
                value={network.name}
                onClick={() => {
                  store.setNetwork(network);
                  Object.entries(network.args).forEach(([key, value]) => {
                    const p = store.params.getParam(key);
                    if (p.active !== value) {
                      store.params.toggle(p);
                    }
                  });
                }}
              >
                {network.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
