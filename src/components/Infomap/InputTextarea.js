import { useDropzone } from "react-dropzone";
import { Form, Ref } from "semantic-ui-react";

export default function InputTextarea({ onDrop, accept, loading, children, ...props }) {
  const { getRootProps } = useDropzone({ onDrop, multiple: false, accept });
  const { ref, ...rootProps } = getRootProps();

  return (
    <Ref innerRef={ref}>
      <Form loading={loading} {...rootProps}>
        <Form.TextArea {...props} />
        {children}
      </Form>
    </Ref>
  );
}
