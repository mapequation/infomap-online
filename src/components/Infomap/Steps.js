import React from "react";
import { Step, Image, Responsive } from "semantic-ui-react";
import './Steps.css';
import Step1 from "../../images/step1.png";
import Step2 from "../../images/step2.png";
import Step3 from "../../images/step3.png";

export default (props) => {
  const {
    firstCompleted, firstActive,
    secondCompleted, secondActive,
    thirdCompleted, thirdActive
  } = props;

  const breakpoint = 1200;

  return (
    <Step.Group stackable>
      <Step completed={firstCompleted} active={firstActive}>
        <Responsive minWidth={breakpoint}>
          <Image size="tiny" src={Step1}/>
        </Responsive>
        <Responsive maxWidth={breakpoint - 1}>
          <Image size="mini" src={Step1}/>
        </Responsive>
        <Step.Content>
          <Step.Title>Load network</Step.Title>
          <Step.Description>
            Edit input field or upload file
        </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={secondCompleted} active={secondActive}>
        <Responsive minWidth={breakpoint}>
          <Image size="tiny" src={Step2}/>
        </Responsive>
        <Responsive maxWidth={breakpoint - 1}>
          <Image size="mini" src={Step2}/>
        </Responsive>
        <Step.Content>
          <Step.Title>Run Infomap</Step.Title>
          <Step.Description>
            Toggle options or add command line arguments
        </Step.Description>
        </Step.Content>
      </Step>

      <Step completed={thirdCompleted} active={thirdActive}>
        <Responsive minWidth={breakpoint}>
          <Image size="tiny" src={Step3}/>
        </Responsive>
        <Responsive maxWidth={breakpoint - 1}>
          <Image size="mini" src={Step3}/>
        </Responsive>
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