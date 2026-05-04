// @ts-nocheck
import { Field, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useStore from "../../store";

export default function InputParameters({ loading, onClick, ...props }) {
  const store = useStore();
  const { args, setArgs, argsError, hasArgsError } = store.params;
  const [args_, setArgs_] = useState(args);

  useEffect(() => {
    const timer = setTimeout(() => setArgs(args_), 200);
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
      <Field.Root invalid={hasArgsError} {...props}>
        <Input
          placeholder="Parameters"
          value={args_}
          borderColor={hasArgsError ? "red.600" : undefined}
          focusBorderColor={hasArgsError ? "red.600" : undefined}
          onChange={(event) => setArgs_(event.target.value)}
          borderLeftRadius="md"
          borderRightRadius={0}
          size="sm"
          bg="white"
        />
        {hasArgsError && (
          <Text color="red.600" fontSize="xs" mt={1}>
            {argsError}
          </Text>
        )}
      </Field.Root>
    </form>
  );
}
