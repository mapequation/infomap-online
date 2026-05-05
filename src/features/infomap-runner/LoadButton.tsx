import { Button } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { LuUpload } from "react-icons/lu";

type LoadButtonProps = Omit<ComponentProps<typeof Button>, "onDrop"> & {
  onDrop: (files: File[]) => void;
  accept?: Accept | string[];
  children?: ReactNode;
};

export default function LoadButton({
  onDrop,
  accept,
  children,
  ...props
}: LoadButtonProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: Array.isArray(accept) ? { "text/plain": accept } : accept,
  });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Button ref={ref} variant="surface" {...rootProps} {...props}>
      <LuUpload />
      {children}
      <input {...getInputProps()} />
    </Button>
  );
}
