import {
  Button,
  ButtonGroup,
  FormControl,
  GridItem,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import type Store from "../../store/Store";
import DownloadMenu from "./DownloadMenu";
import OutputMenu from "./OutputMenu";

export default function InfomapOutputPanel({
  hasInfomapError,
  isCompleted,
  isRunning,
  onCopyClusters,
  store,
}: {
  hasInfomapError: boolean;
  isCompleted: boolean;
  isRunning: boolean;
  onCopyClusters: () => void;
  store: Store;
}) {
  const { network, output } = store;

  return (
    <>
      <GridItem area="output" className="output">
        <ButtonGroup isAttached w="100%" mb="1rem" isDisabled={isRunning}>
          <Tooltip
            visibility={
              isCompleted && !hasInfomapError && !output.ftree
                ? "visible"
                : "hidden"
            }
            placement="top"
            size="sm"
            hasArrow
            label="Network Navigator requires ftree output."
          >
            <Button
              width="full"
              colorScheme="blue"
              as="a"
              _hover={{ color: "white", bg: "blue.600" }}
              target="_blank"
              rel="noopener noreferrer"
              href={`//www.mapequation.org/navigator?infomap=${network.name}.ftree`}
              disabled={!output.ftree}
              borderRightRadius={0}
              size="sm"
            >
              Open in Navigator
            </Button>
          </Tooltip>
          <DownloadMenu disabled={isRunning} />
        </ButtonGroup>

        <FormControl>
          <Textarea
            readOnly
            onCopy={onCopyClusters}
            value={output.activeContent}
            placeholder="Cluster output will be printed here"
            spellCheck={false}
            wrap="off"
            overflow="auto"
            resize="none"
            h="60ch"
            variant="outline"
            bg="white"
            fontSize="sm"
          />
        </FormControl>
      </GridItem>

      <GridItem area="outputMenu" pt={{ base: 0, xl: "3em" }}>
        <OutputMenu fontSize="sm" />
      </GridItem>
    </>
  );
}
