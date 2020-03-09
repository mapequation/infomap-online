import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Icon, Ref } from "semantic-ui-react";


export default ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Button
        fluid
        primary
        className="topButton"
        {...rootProps}
      >
        <Icon name="file"/>Load network
        <input {...getInputProps()} style={{ display: "none" }}/>
      </Button>
    </Ref>
  );
}
