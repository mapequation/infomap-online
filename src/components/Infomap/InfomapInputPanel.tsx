import {
  Box,
  ButtonGroup,
  GridItem,
  List,
  ListItem,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import type { InputName } from "../../store/types";
import ExamplesMenu from "./ExamplesMenu";
import InputTextarea from "./InputTextarea";
import LoadButton from "./LoadButton";

export default function InfomapInputPanel({
  activeInput,
  inputAccept,
  inputValue,
  isRunning,
  onLoad,
  onSelectInput,
  onTextChange,
}: {
  activeInput: InputName;
  inputAccept: Record<InputName, string[] | undefined>;
  inputValue: string;
  isRunning: boolean;
  onLoad: (activeInput: InputName) => (files: File[]) => void | Promise<void>;
  onSelectInput: (name: InputName) => void;
  onTextChange: (value: string) => void;
}) {
  return (
    <>
      <GridItem area="input" className="network">
        <ButtonGroup isAttached w="100%" mb="1rem" isDisabled={isRunning}>
          <LoadButton
            width="full"
            size="sm"
            onDrop={onLoad(activeInput)}
            accept={inputAccept[activeInput]}
          >
            Load {activeInput}
          </LoadButton>
          <ExamplesMenu disabled={isRunning} />
        </ButtonGroup>

        <InputTextarea
          onDrop={onLoad(activeInput)}
          accept={inputAccept[activeInput]}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onTextChange(event.target.value)
          }
          value={inputValue}
          placeholder={`Input ${activeInput} here`}
          spellCheck={false}
          wrap="off"
          overflow="auto"
          resize="none"
          h="60ch"
          pb={15}
          variant="outline"
          bg="white"
          fontSize="sm"
        >
          <Box
            pos="absolute"
            w="calc(100% - 8px)"
            p="0.5rem"
            mb="1px"
            mx="1px"
            fontSize="xs"
            bg="whiteAlpha.900"
            bottom={0}
            left={0}
            borderBottomRadius="lg"
            borderTopColor="gray.200"
            borderTopWidth={2}
            borderTopStyle="dashed"
            zIndex={1000}
          >
            Load {activeInput} by dragging & dropping.
            <br />
            <a href="#Input">Supported formats.</a>
          </Box>
        </InputTextarea>
      </GridItem>

      <GridItem area="inputMenu" pt={{ base: 0, xl: "3em" }}>
        <List fontSize="sm" textAlign={{ base: "left", xl: "right" }}>
          {(["network", "cluster data", "meta data"] as InputName[]).map((option) => (
            <ListItem
              key={option}
              onClick={() => onSelectInput(option)}
              color={option === activeInput ? "gray.900" : "blackAlpha.600"}
              mb={1}
              cursor="pointer"
              textTransform="capitalize"
            >
              {option}
            </ListItem>
          ))}
        </List>
      </GridItem>
    </>
  );
}
