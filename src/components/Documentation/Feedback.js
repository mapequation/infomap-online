import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

export default function Feedback() {
  return (
    <>
      <Heading id="Feedback" />
      <p>
        If you have questions or suggestions about the software, please post
        them in{" "}
        <ExternalLink href="//github.com/mapequation/infomap/discussions">
          GitHub Discussions
        </ExternalLink>
        .
      </p>
      <p>
        Bugs and installation problems can be reported in{" "}
        <ExternalLink href="//github.com/mapequation/infomap/issues">
          GitHub Issues
        </ExternalLink>
        .
      </p>
    </>
  );
}
