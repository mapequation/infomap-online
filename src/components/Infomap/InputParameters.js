import React from "react";
import { observer } from "mobx-react";
import { Form } from "semantic-ui-react";
import store from "../../store";


export default observer(({ loading, onClick }) => {
  const { args, setArgs, argsError, hasArgsError } = store;

  return (
    <Form error={hasArgsError}>
      <Form.Group widths="equal" className="inputParameters">
        <Form.Input
          placeholder="Parameters"
          value={args}
          error={hasArgsError ? { content: argsError, pointing: "below" } : false}
          onChange={(e, { value }) => setArgs(value)}
          action={<Form.Button
            primary
            disabled={hasArgsError || loading}
            loading={loading}
            onClick={onClick}
            content="Run Infomap"
          />}
        />
      </Form.Group>
    </Form>
  );
});