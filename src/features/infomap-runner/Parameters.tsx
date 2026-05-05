import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import type { LabelHTMLAttributes, MouseEvent, Ref } from "react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuMinus, LuPlus, LuSearch } from "react-icons/lu";
import useStore from "../../state";
import type { InfomapParameter } from "../../state/types";

const parameterGroups = ["Input", "Output", "Algorithm", "Accuracy", "About"];

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const parameterMatches = (param: InfomapParameter, query: string) => {
  if (!query) return true;

  return [
    param.long,
    param.short,
    param.longString,
    param.shortString,
    param.description,
    param.longType,
    ...(param.options ?? []),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
};

function ToggleSwitch({
  id,
  checked,
  onChange,
  ariaLabel,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <label
      htmlFor={id}
      style={{
        alignItems: "center",
        cursor: "pointer",
        display: "inline-flex",
        justifyContent: "center",
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
        }}
      />
      <Box
        aria-hidden="true"
        bg={checked ? "blue.500" : "gray.300"}
        borderRadius="full"
        boxShadow="inset 0 0 0 1px rgba(0, 0, 0, 0.08)"
        h="1.125rem"
        p="0.125rem"
        position="relative"
        transition="background 120ms ease"
        w="2rem"
      >
        <Box
          bg="white"
          borderRadius="full"
          boxShadow="0 1px 2px rgba(0, 0, 0, 0.2)"
          h="0.875rem"
          transform={checked ? "translateX(0.875rem)" : "translateX(0)"}
          transition="transform 120ms ease"
          w="0.875rem"
        />
      </Box>
    </label>
  );
}

const DropdownParameter = ({ param }) => {
  const store = useStore();

  const selectStyle = {
    container: (provided) => ({ ...provided, minW: "10rem" }),
    control: (provided) => ({
      ...provided,
      bg: "white",
      fontSize: "0.75rem",
      minH: "1.875rem",
    }),
    dropdownIndicator: (provided) => ({ ...provided, p: 1 }),
    valueContainer: (provided) => ({
      ...provided,
      bg: "white",
      px: 2,
      w: "100%",
    }),
  };

  const isMulti = param.longType === "list";

  const value = isMulti
    ? param.value.map((v) => ({ label: v, value: v }))
    : { label: param.value, value: param.value };

  const onChange = (value) => {
    if (!value) {
      return store.params.setOption(
        param,
        isMulti ? [] : (param.default ?? ""),
      );
    }

    return store.params.setOption(
      param,
      isMulti ? value.map((v) => v.value) : value.value,
    );
  };

  const options = param.options.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <Select
      id={param.long}
      ref={(ref) => store.params.setRef(param.long, ref)}
      chakraStyles={selectStyle}
      placeholder={param.longType}
      isMulti={isMulti}
      isClearable={param.clearable}
      closeMenuOnSelect={!isMulti}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

const InputParameter = ({ param }) => {
  const store = useStore();

  return (
    <Input
      id={param.long}
      //maxW="50%"
      w="5.5rem"
      bg="white"
      borderColor={param.active ? "blue.300" : "gray.300"}
      borderWidth="1px"
      _hover={{ bg: "white", borderColor: "gray.400" }}
      _focus={{ bg: "white", borderColor: "blue.500", boxShadow: "outline" }}
      fontSize="xs"
      h="1.875rem"
      variant="outline"
      placeholder={param.default}
      value={param.value}
      onChange={(e) => store.params.setInput(param, e.target.value)}
    />
  );
};

const FileInputParameter = ({ param }) => {
  const store = useStore();

  const onDrop = (files) => {
    if (files.length < 1) return;

    const file = files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      if (!value || !param.tabName) return;
      store.setActiveInput(param.tabName);
      store.params.setFileParam(param, {
        name: file.name,
        value,
      });
    };

    reader.readAsText(file, "utf-8");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/plain": param.accept },
    noClick: true, // Turn off default click trigger to prevent double file requests
  });

  const { ref, ...rootProps } = getRootProps();

  return (
    <Button variant="outline" size="xs" asChild>
      <label
        ref={ref as Ref<HTMLLabelElement>}
        htmlFor={param.long}
        {...rootProps}
      >
        Load file
        <input id={param.long} {...getInputProps()} />
      </label>
    </Button>
  );
};

const ToggleParameter = ({ param }) => {
  const store = useStore();

  return (
    <ToggleSwitch
      id={param.long}
      checked={param.active}
      ariaLabel={param.longString}
      onChange={() => store.params.toggle(param)}
    />
  );
};

const IncrementalParameter = ({ param }) => {
  const store = useStore();
  const { value, maxValue, stringValue } = param;

  const setValue = (value) => store.params.setIncremental(param, value);

  return (
    <ButtonGroup variant="outline" attached size="xs" id={param.long}>
      <IconButton
        aria-label="minus"
        disabled={value === 0}
        onClick={() => setValue(value - 1)}
      >
        <LuMinus />
      </IconButton>
      <Button disabled={value === 0}>{stringValue(value)}</Button>
      <IconButton
        aria-label="plus"
        disabled={value === maxValue}
        onClick={() => setValue(value + 1)}
      >
        <LuPlus />
      </IconButton>
    </ButtonGroup>
  );
};

const ParameterControl = ({ param }) => {
  if (param.dropdown) return <DropdownParameter param={param} />;
  if (param.input) return <InputParameter param={param} />;
  if (param.incremental) return <IncrementalParameter param={param} />;
  if (param.file) return <FileInputParameter param={param} />;

  return <ToggleParameter param={param} />;
};

function ParamName({
  param,
  short = false,
}: {
  param: InfomapParameter;
  short?: boolean;
}) {
  const name = short && param.short ? param.shortString : param.longString;

  return (
    <code
      style={{
        borderWidth: param.active ? "1px" : 0,
        paddingBlock: param.active ? "0.1em" : 0,
        paddingInline: param.active ? "0.35em" : 0,
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.75rem",
        fontWeight: param.active ? 600 : 500,
        lineHeight: 1.4,
        userSelect: "none",
        color: param.active ? "hsl(206, 73%, 25%)" : "rgb(45, 55, 72)",
        backgroundColor: param.active ? "hsl(206, 80%, 90%)" : "transparent",
        borderColor: param.active ? "hsl(206, 80%, 80%)" : "transparent",
      }}
    >
      {name}
    </code>
  );
}

const ParameterGroup = ({
  group,
  advanced,
  query,
}: {
  group: string;
  advanced: boolean;
  query: string;
}) => {
  const store = useStore();

  const getHeaderProps = (
    param: InfomapParameter,
  ): LabelHTMLAttributes<HTMLLabelElement> => {
    const { active, long, dropdown, input, file, incremental, value } = param;

    if (dropdown) {
      return {
        onClick: (event: MouseEvent<HTMLLabelElement>) => {
          if (active) {
            event.preventDefault();
            const defaultValue =
              typeof param.default === "string" || Array.isArray(param.default)
                ? param.default
                : "";
            return store.params.setOption(param, defaultValue);
          }
        },
      };
    }

    const labelProps = { htmlFor: long };

    if (incremental) {
      return {
        onClick: () =>
          store.params.setIncremental(param, Number(value) > 0 ? 0 : 1),
        ...labelProps,
      };
    }

    if (input || file) {
      return {
        onClick: (event: MouseEvent<HTMLLabelElement>) => {
          if (!active) return;
          if (file) {
            event.preventDefault();
            return store.params.resetFileParam(param);
          }
          store.params.setInput(param, "");
        },
        ...labelProps,
      };
    }

    return labelProps;
  };

  const params = store.params
    .getParamsForGroup(group)
    .filter((param) => !param.advanced || advanced)
    .filter((param) => parameterMatches(param, query))
    .sort((a, b) => (a.advanced === b.advanced ? 0 : a.advanced ? 1 : -1));

  const id = `Params${group}`;

  if (params.length === 0) return null;

  return (
    <>
      <Text
        id={id}
        color="gray.500"
        fontFamily="monospace"
        fontSize="0.68rem"
        fontWeight={700}
        letterSpacing="0.12em"
        textTransform="uppercase"
        mt={5}
        mb={2}
      >
        {group}
      </Text>
      <Box borderTopWidth="1px" borderTopColor="gray.200">
        {params.map((param, key) => (
          <HStack
            key={key}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2.5}
            py={2.5}
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            _last={{ borderBottomWidth: 0 }}
          >
            <Box flex="1 1 14rem" minW={0}>
              <HStack lineHeight={1.35}>
                <Box asChild fontSize="xs">
                  <label {...getHeaderProps(param)} htmlFor={param.long}>
                    {param.short && (
                      <>
                        <ParamName param={param} short />
                        {", "}
                      </>
                    )}
                    <ParamName param={param} />
                  </label>
                </Box>
              </HStack>
              <Box color="gray.500" fontSize="xs" lineHeight={1.45} mt={1}>
                {param.description}
              </Box>
            </Box>
            <Box
              flex="0 0 auto"
              maxW="100%"
              minW="4rem"
              display="flex"
              justifyContent="flex-end"
            >
              <ParameterControl param={param} />
            </Box>
          </HStack>
        ))}
      </Box>
    </>
  );
};

export default function Parameters() {
  const store = useStore();
  const [advanced, setAdvanced] = useState(false);
  const [search, setSearch] = useState("");
  const query = normalizeSearch(search);

  useEffect(() => {
    if (!window.location.hash) return;

    const hash = window.location.hash.slice(1);
    const param = store.params.getParam(hash);

    if (param?.advanced) {
      setAdvanced(true);
    }
  }, [store.params.getParam]);

  useEffect(() => {
    if (!query) return;

    const hasAdvancedMatch = parameterGroups.some((group) =>
      store.params
        .getParamsForGroup(group)
        .some((param) => param.advanced && parameterMatches(param, query)),
    );

    if (hasAdvancedMatch) {
      setAdvanced(true);
    }
  }, [query, store.params.getParamsForGroup]);

  const hasResults = parameterGroups.some((group) =>
    store.params
      .getParamsForGroup(group)
      .some(
        (param) =>
          (!param.advanced || advanced) && parameterMatches(param, query),
      ),
  );

  return (
    <>
      <Box position="relative" mb={3}>
        <Box
          position="absolute"
          left={3}
          top="50%"
          transform="translateY(-50%)"
          color="gray.500"
          pointerEvents="none"
          zIndex={1}
        >
          <LuSearch size={16} />
        </Box>
        <Input
          aria-label="Search parameters"
          placeholder="Search parameters"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          pl={9}
          size="sm"
          bg="white"
        />
      </Box>

      <HStack
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        py={3}
        mb={2}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
      >
        <Box minW={0}>
          <Text color="gray.800" fontSize="xs" fontWeight={700} mb={1}>
            Advanced parameters
          </Text>
          <Text color="gray.500" fontSize="xs" lineHeight={1.4} mb={0}>
            Show less common options in each group.
          </Text>
        </Box>
        <ToggleSwitch
          id="show-advanced"
          checked={advanced}
          ariaLabel="Show advanced parameters"
          onChange={() => setAdvanced(!advanced)}
        />
      </HStack>

      {hasResults ? (
        parameterGroups.map((group) => (
          <ParameterGroup
            key={group}
            group={group}
            advanced={advanced}
            query={query}
          />
        ))
      ) : (
        <Text color="gray.500" fontSize="xs" mt={4}>
          No parameters match "{search}".
        </Text>
      )}
    </>
  );
}
