// @ts-nocheck
import { Button } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FaFile } from "react-icons/fa";

export default function LoadButton({ onDrop, accept, children, ...props }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Button ref={ref} colorPalette="blue" {...rootProps} {...props}>
      <FaFile />
      {children}
      <input {...getInputProps()} />
    </Button>
  );
}
