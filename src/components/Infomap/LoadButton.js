import { useDropzone } from "react-dropzone";
import { Button, Ref } from "semantic-ui-react";


export default function LoadButton({ onDrop, accept, children, ...props }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Button {...rootProps} {...props}>
        {children}
        <input {...getInputProps()} />
      </Button>
    </Ref>
  );
}
