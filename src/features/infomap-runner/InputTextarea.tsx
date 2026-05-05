import { Field, Textarea } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";

type InputTextareaProps = Omit<ComponentProps<typeof Textarea>, "onDrop"> & {
  onDrop: (files: File[]) => void;
  accept?: Accept | string[];
  children?: ReactNode;
};

export default function InputTextarea({
  onDrop,
  accept,
  children,
  ...props
}: InputTextareaProps) {
  const { getRootProps } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: Array.isArray(accept) ? { "text/plain": accept } : accept,
  });

  return (
    <Field.Root {...getRootProps()} pos="relative">
      <Textarea {...props} />
      {children}
    </Field.Root>
  );
}
