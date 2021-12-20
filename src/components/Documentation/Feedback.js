import { Icon } from "semantic-ui-react";
import { Heading } from "./Contents";


export default function Feedback() {
  return <>
    <Heading id="Feedback" />
    <p>
      If you have any questions, suggestions or issues regarding the software, please add them to{" "}
      <a href="//github.com/mapequation/infomap/issues">
        <Icon name="github" />GitHub issues
      </a>
      .
    </p>
  </>;
}
