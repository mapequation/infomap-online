import { Heading } from "../Contents";
import ExternalLink from "../ExternalLink";

export default function References() {
  return (
    <>
      <Heading id="References" />
      <p>
        If you are using the software at mapequation.org in one of your research
        articles or otherwise want to refer to it, please cite{" "}
        <ExternalLink href="//www.mapequation.org/publications.html">
          relevant publication
        </ExternalLink>{" "}
        or use the following format:
      </p>
      <p>
        D. Edler, A. Eriksson and M. Rosvall, The MapEquation software package,
        available online at <a href="//www.mapequation.org">mapequation.org</a>.
      </p>
    </>
  );
}
