import React from "react";
import { Image, Step } from "semantic-ui-react";
import Step1 from "../../images/step1.png";
import Step2 from "../../images/step2.png";
import Step3 from "../../images/step3.png";

export default (props) => {
  const {
    firstCompleted, firstActive,
    secondCompleted, secondActive,
    thirdCompleted, thirdActive
  } = props;

  return (
    <Step.Group stackable="tablet" fluid widths={3}>
      <Step completed={firstCompleted} active={firstActive}>
        <Image size="mini" src={Step1}/>
        <Step.Content>
          <Step.Title>Load network</Step.Title>
          <Step.Description>
            Edit input or load file
          </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={secondCompleted} active={secondActive}>
        <Image size="mini" src={Step2}/>
        <Step.Content>
          <Step.Title>Run Infomap</Step.Title>
          <Step.Description>
            Toggle parameters or add arguments
          </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={thirdCompleted} active={thirdActive}>
        <Image size="mini" src={Step3}/>
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
