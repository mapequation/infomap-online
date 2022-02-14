import {
  Button,
  FormControl,
  Input,
  InputGroup,
  Tooltip,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import store from "../../store";

export default observer(({ loading, onClick, ...props }) => {
  const { args, setArgs, argsError, hasArgsError } = store.params;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <FormControl isInvalid={hasArgsError} {...props}>
        <InputGroup>
          <Tooltip
            isOpen={hasArgsError}
            placement="top"
            hasArrow
            label={argsError}
          >
            <Input
              placeholder="Parameters"
              value={args}
              errorBorderColor="red.600"
              focusBorderColor={hasArgsError ? "red.600" : undefined}
              onChange={(event) => setArgs(event.target.value)}
              borderLeftRadius="md"
              borderRightRadius={0}
              size="sm"
              bg="white"
            />
          </Tooltip>
          <Button
            colorScheme="blue"
            disabled={hasArgsError || loading}
            isLoading={loading}
            onClick={onClick}
            px={10}
            borderLeftRadius={0}
            size="sm"
          >
            Run Infomap
          </Button>
        </InputGroup>
      </FormControl>
    </form>
  );
});
