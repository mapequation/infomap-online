import { Fragment } from "react";
import "../styles/Highlight.module.css";

const parseLine = (line) => {
  const buff = [{ className: null, content: "" }];
  let isString = false;

  for (let char of line) {
    let curr = buff[buff.length - 1];

    switch (char) {
      case '"':
        if (isString) {
          curr.content += char;
          isString = false;
          break;
        } else if (curr.className == null || curr.className !== "highlight-string") {
          isString = true;
          curr.className = "highlight-string";
          curr.content = char;
          break;
        }
        break;

      case " ":
        if (!isString) {
          curr = { className: null, content: "" };
          buff.push(curr);
          break;
        }
      // eslist-disable-line no-fallthrough
      default:
        if (curr.className == null) {
          curr.className = "highlight-number";
        }
        curr.content += char;
        break;
    }
  }

  return buff;
};

export default function Highlight({ content }) {
  if (!content) return null;

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    if (line.startsWith("#")) {
      lines[i] = <span className="highlight-comment">{line}</span>;
    } else if (line.startsWith("*")) {
      lines[i] = <span className="highlight-heading">{line}</span>;
    } else {
      lines[i] = parseLine(line).map(({ className, content }, i) => (
        <Fragment key={i}>
          <span className={className}>{content}</span>{" "}
        </Fragment>
      ));
    }
  }

  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          <br />
        </Fragment>
      ))}
    </>
  );
}
