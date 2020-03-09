import React from "react";
import { useDropzone } from "react-dropzone";
import { Form, Ref } from "semantic-ui-react";


export default ({ loading, value, placeholder, onChange, onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Form loading={loading} {...rootProps}>
        <Form.TextArea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="network"
          {...getInputProps}
        />
      </Form>
    </Ref>
  );
}
