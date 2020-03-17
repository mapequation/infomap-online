import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Ref } from "semantic-ui-react";


export default ({ onDrop, children, ...props }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Button
        {...rootProps}
        {...props}
      >
        {children}
        <input {...getInputProps()} style={{ display: "none" }}/>
      </Button>
    </Ref>
  );
}
