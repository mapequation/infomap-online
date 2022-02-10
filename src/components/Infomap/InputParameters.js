import { Button, FormControl, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { Form } from "semantic-ui-react";
import store from "../../store";

export default observer(({ loading, onClick }) => {
  const { args, setArgs, argsError, hasArgsError } = store.params;

  return (
    <FormControl isLoading={loading} error={hasArgsError}>
      <InputGroup>
        <Input
          placeholder="Parameters"
          value={args}
          isInvalid={hasArgsError}
          errorBorderColor="red.600"
          focusBorderColor={hasArgsError ? "red.600" : undefined}
          onChange={(event) => setArgs(event.target.value)}
          borderRightRadius={0}
        />
        <Button
          colorScheme="blue"
          disabled={hasArgsError || loading}
          isLoading={loading}
          onClick={onClick}
          px={10}
          borderLeftRadius={0}
        >
          Run Infomap
        </Button>
      </InputGroup>
    </FormControl>
  );
});
