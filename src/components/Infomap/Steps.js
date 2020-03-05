import React from "react";
import { Step } from "semantic-ui-react";

export default (props) => {
  const {
    firstCompleted, firstActive,
    secondCompleted, secondActive,
    thirdCompleted, thirdActive
  } = props;

  return (
    <Step.Group ordered>
      <Step completed={firstCompleted} active={firstActive}>
        <Step.Content>
          <Step.Title>Load network</Step.Title>
          <Step.Description>
            Edit input field or upload file
        </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={secondCompleted} active={secondActive}>
        <Step.Content>
          <Step.Title>Run Infomap</Step.Title>
          <Step.Description>
            Toggle options or add command line arguments
        </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={thirdCompleted} active={thirdActive}>
        <Step.Content>
          <Step.Title>Explore map!</Step.Title>
          <Step.Description>
            Save result or open in{" "}
            <span className="brand brand-nn">Network Navigator</span>
          </Step.Description>
        </Step.Content>
      </Step>
    </Step.Group>
  )
}