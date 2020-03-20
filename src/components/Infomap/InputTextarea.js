import React from "react";
import { useDropzone } from "react-dropzone";
import { Form } from "semantic-ui-react";


export default ({ value, placeholder, onChange, onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Form loading={loading} {...rootProps}>
        <Form.TextArea
          {...getInputProps()}
          {...props}
        />
        <Message
          attached="bottom"
          size="mini"
          content="Load network by dragging & dropping"
        />
      </Form>
    </Ref>
  );
}
