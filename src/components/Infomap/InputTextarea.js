import { FormControl, Textarea } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

export default function InputTextarea({ onDrop, accept, loading, ...props }) {
  const { getRootProps } = useDropzone({ onDrop, multiple: false, accept });

  return (
    <FormControl {...getRootProps()} isLoading={loading}>
      <Textarea {...props} />
    </FormControl>
  );
}
