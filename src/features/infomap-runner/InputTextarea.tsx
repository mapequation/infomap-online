// @ts-nocheck
import { Field, Textarea } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

export default function InputTextarea({ onDrop, accept, children, ...props }) {
  const { getRootProps } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept,
  });

  return (
    <Field.Root {...getRootProps()} pos="relative">
      <Textarea {...props} />
      {children}
    </Field.Root>
  );
}
