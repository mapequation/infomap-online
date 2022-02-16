import {
  Button,
  FormControl,
  Input,
  InputGroup,
  Tooltip,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../../store";

export default observer(function InputParameters({
  loading,
  onClick,
  ...props
}) {
  const store = useStore();
  const { args, setArgs, argsError, hasArgsError } = store.params;
  const [args_, setArgs_] = useState(args);

  useEffect(() => {
    const timer = setTimeout(() => setArgs(args_), 500);
    return () => clearTimeout(timer);
  }, [args_, setArgs]);

  useEffect(() => setArgs_(args), [args]);

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
              value={args_}
              errorBorderColor="red.600"
              focusBorderColor={hasArgsError ? "red.600" : undefined}
              onChange={(event) => setArgs_(event.target.value)}
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
