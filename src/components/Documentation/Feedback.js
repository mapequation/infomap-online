import { Heading } from "../Contents";

export default function Feedback() {
  return (
    <>
      <Heading id="Feedback" />
      <p>
        If you have any questions or suggestions regarding the software, please
        add them to{" "}
        <a href="//github.com/mapequation/infomap/discussions">
          GitHub Discussions
        </a>
        .
      </p>
      <p>
        Bugs and installation problems can be reported in{" "}
        <a href="//github.com/mapequation/infomap/issues">GitHub Issues</a>.
      </p>
    </>
  );
}
