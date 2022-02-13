import { Button, FormControl, Input, InputGroup } from "@chakra-ui/react";
import { observer } from "mobx-react";
import store from "../../store";

export default observer(({ loading, onClick, ...props }) => {
  const { args, setArgs, argsError, hasArgsError } = store.params;

  return (
    <FormControl
      //isLoading={loading}
      //error={hasArgsError}
      {...props}
    >
      <InputGroup>
        <Input
          placeholder="Parameters"
          value={args}
          isInvalid={hasArgsError}
          errorBorderColor="red.600"
          focusBorderColor={hasArgsError ? "red.600" : undefined}
          onChange={(event) => setArgs(event.target.value)}
          borderLeftRadius="md"
          borderRightRadius={0}
          size="sm"
          variant="solid"
        />
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
  );
});
