import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Switch,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { motion } from "framer-motion";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import useStore from "../../store";
import { Heading } from "../Contents";

const DropdownParameter = observer(({ param }) => {
  const store = useStore();

  const selectStyle = {
    container: (provided) => ({ ...provided, minW: "200px" }),
    valueContainer: (provided) => ({ ...provided, bg: "white", w: "100%" }),
    control: (provided) => ({ ...provided, bg: "white" }),
  };

  const isMulti = param.longType === "list";

  const value = isMulti
    ? param.value.map((v) => ({ label: v, value: v }))
    : { label: param.value, value: param.value };

  const onChange = (value) =>
    store.params.setOption(
      param,
      isMulti ? value.map((v) => v.value) : value.value
    );

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
      closeMenuOnSelect={!isMulti}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
});

const InputParameter = observer(({ param }) => {
  const store = useStore();

  return (
    <Input
      id={param.long}
      //maxW="50%"
      w="100px"
      bg="white"
      _hover={{ bg: "white" }}
      _focus={{ bg: "white" }}
      variant="filled"
      placeholder={param.default}
      value={param.value}
      onChange={(e) => store.params.setInput(param, e.target.value)}
    />
  );
});

const FileInputParameter = observer(({ param }) => {
  const store = useStore();

  const onDrop = (files) => {
    if (files.length < 1) return;

    const file = files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result.length) return;
      store.setActiveInput(param.tabName);
      store.params.setFileParam(param, {
        name: file.name,
        value: reader.result,
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
    <Button
      variant="outline"
      ref={ref}
      as="label"
      htmlFor={param.long}
      {...rootProps}
    >
      Load file
      <input id={param.long} {...getInputProps()} />
    </Button>
  );
});

const ToggleParameter = observer(({ param }) => {
  const store = useStore();

  return (
    <Switch
      id={param.long}
      isChecked={param.active}
      onChange={() => store.params.toggle(param)}
    />
  );
});

const IncrementalParameter = observer(({ param }) => {
  const store = useStore();
  const { value, maxValue, stringValue } = param;

  const setValue = (value) => store.params.setIncremental(param, value);

  return (
    <ButtonGroup variant="outline" isAttached id={param.long}>
      <IconButton
        aria-label="minus"
        icon={<FaMinus />}
        disabled={value === 0}
        onClick={() => setValue(value - 1)}
      />
      <Button disabled={value === 0}>{stringValue(value)}</Button>
      <IconButton
        aria-label="plus"
        icon={<FaPlus />}
        disabled={value === maxValue}
        onClick={() => setValue(value + 1)}
      />
    </ButtonGroup>
  );
});

const ParameterControl = ({ param }) => {
  if (param.dropdown) return <DropdownParameter param={param} />;
  if (param.input) return <InputParameter param={param} />;
  if (param.incremental) return <IncrementalParameter param={param} />;
  if (param.file) return <FileInputParameter param={param} />;

  return <ToggleParameter param={param} />;
};

function ParamName({ param, short }) {
  const name = short && param.short ? param.shortString : param.longString;

  return (
    <motion.code
      initial={false}
      style={{
        borderWidth: "1px",
        paddingInline: "0.4em",
        borderRadius: "5px",
        cursor: "pointer",
        userSelect: "none",
      }}
      animate={{
        color: param.active ? "hsl(206, 73%, 25%)" : "rgb(45, 55, 72)",
        backgroundColor: param.active ? "hsl(206, 80%, 90%)" : "#fff",
        borderColor: param.active ? "hsl(206, 80%, 80%)" : "hsl(0, 0%, 80%)",
      }}
      transition={{ duration: 0.15 }}
    >
      {name}
    </motion.code>
  );
}

const ParameterGroup = observer(({ group, advanced }) => {
  const store = useStore();
  const [clipboardClicked, setClipboardClicked] = useState("");

  const getHeaderProps = (param) => {
    const { active, long, dropdown, input, file, incremental, value } = param;

    const props = { as: "label" };

    if (dropdown) {
      const ref = store.params.getRef(long);
      if (!ref) return props;
      return {
        onClick: () => {
          if (active) return store.params.setOption(param, param.default);
          //return (active ? store.params.setOption(param, param.default) : ref?.open()); },
        },
        ...props,
      };
    }

    const labelProps = { htmlFor: long, ...props };

    if (incremental) {
      return {
        onClick: () => store.params.setIncremental(param, value > 0 ? 0 : 1),
        ...labelProps,
      };
    }

    if (input || file) {
      return {
        onClick: (event) => {
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
    .sort((a, b) => (a.advanced === b.advanced ? 0 : a.advanced ? 1 : -1));

  const id = `Params${group}`;

  return (
    <>
      <Heading id={id} />
      <Box>
        {params.map((param, key) => (
          <HStack
            key={key}
            alignItems="flex-start"
            justifyContent="space-between"
            py="0.8em"
            borderBottomWidth="1px"
            borderBottomColor="rgba(34, 36, 38, 0.1)"
            _last={{ borderBottomWidth: 0 }}
          >
            <Box maxW="70%">
              <HStack>
                <Box fontSize="xs" {...getHeaderProps(param)}>
                  {param.short && (
                    <>
                      <ParamName param={param} short />
                      {", "}
                    </>
                  )}
                  <ParamName param={param} />
                </Box>
                <Icon
                  ml={4}
                  cursor="pointer"
                  _hover={{ color: "black", transform: "scale(1.1)" }}
                  as={
                    clipboardClicked === param.long
                      ? BsClipboardCheck
                      : BsClipboard
                  }
                  onClick={async () => {
                    await navigator?.clipboard?.writeText(param.long);
                    setClipboardClicked(param.long);
                  }}
                />
              </HStack>
              <Box fontSize="sm">{param.description}</Box>
            </Box>
            <Box>
              <ParameterControl param={param} />
            </Box>
          </HStack>
        ))}
      </Box>
    </>
  );
});

export default observer(function Parameters() {
  const store = useStore();
  const [advanced, setAdvanced] = useState(false);

  if (!advanced && window.location && window.location.hash) {
    const hash = window.location.hash.slice(1);
    const param = store.params.getParam(hash);
    if (param && param.advanced) {
      setAdvanced(true);
    }
  }

  return (
    <>
      <Heading
        id="Parameters"
        //advanced={advanced}
      />
      <FormControl display="flex" alignItems="center" gap={4}>
        <FormLabel htmlFor="show-advanced">Show advanced parameters</FormLabel>
        <Switch
          id="show-advanced"
          isChecked={advanced}
          onChange={() => setAdvanced(!advanced)}
        />
      </FormControl>
      <ParameterGroup group="Input" advanced={advanced} />
      <ParameterGroup group="Output" advanced={advanced} />
      <ParameterGroup group="Algorithm" advanced={advanced} />
      <ParameterGroup group="Accuracy" advanced={advanced} />
      <ParameterGroup group="About" advanced={advanced} />
    </>
  );
});
