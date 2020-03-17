import React from "react";
import { useDropzone } from "react-dropzone";
import { Form } from "semantic-ui-react";


export default ({ value, placeholder, onChange, onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  return (
    <div {...getRootProps()}>
      <Form.TextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...getInputProps}
      />
    </div>
  );
}
