import { changelog as infomapChangelog } from "@mapequation/infomap";
import { useState } from "react";
import { Divider, Header, Icon, List } from "semantic-ui-react";
import { Heading } from "./Contents";

const Change = ({ change }) => {
  const { scope, subject, references } = change;
  const Scope = scope ? <strong>{scope} </strong> : null;
  const Subject = (
    <span style={{ whiteSpace: "pre" }}>
      {subject.replace(/ \(#\d+\)$/, "").replace(/\.\s/g, ".\n")}
    </span>
  );
  const Reference =
    (references || []).length > 0 ? (
      <a href={`https://github.com/mapequation/infomap/issues/${references[0].issue}`}>
        {" "}
        (#{references[0].issue})
      </a>
    ) : null;
  return (
    <List.Item className="changelogItem">
      <span>
        {Scope}
        {Subject}
        {Reference}
      </span>
    </List.Item>
  );
};

const Changes = ({ heading, changes }) => {
  if (changes.length === 0) return null;
  return (
    <>
      <h4>{heading}</h4>
      <List bulleted>
        {changes.map((change, i) => (
          <Change key={i} change={change} />
        ))}
      </List>
    </>
  );
};

const Breaking = (props) => <Changes heading="BREAKING CHANGES" {...props} />;
const Features = (props) => <Changes heading="Features" {...props} />;
const Fixes = (props) => <Changes heading="Fixes" {...props} />;

const Release = ({ changes }) => {
  const features = [];
  const fixes = [];
  const breaking = [];

  changes.forEach((change) => {
    const { type, notes, scope } = change;

    const breakingNote = notes.find((note) => note.title === "BREAKING CHANGE");
    if (breakingNote) {
      breaking.push({ subject: breakingNote.text, scope });
    }

    if (type === "feat") {
      features.push(change);
    } else if (type === "fix") {
      fixes.push(change);
    }
  });

  const release = changes[0];

  return (
    <div style={{ marginBottom: 2 }}>
      <a href={`https://github.com/mapequation/infomap/releases/tag/v${release.subject}`}>
        <h3 style={{ marginBottom: 2 }} id={release.subject}>
          {release.subject}
          <span
            style={{
              color: "#999",
              fontWeight: 300,
              marginLeft: 6,
              fontSize: "0.8em",
            }}
          >
            ({release.date.slice(0, 10)})
          </span>
        </h3>
      </a>

      <div
        style={{
          marginBottom: 0,
          marginLeft: 19,
          padding: "10px 0 10px 10px",
          borderLeft: "1px solid #ccc",
        }}
      >
        {breaking.length > 0 && <Breaking changes={breaking} />}
        {features.length > 0 && <Features changes={features} />}
        {fixes.length > 0 && <Fixes changes={fixes} />}
      </div>
    </div>
  );
};

export default function Changelog() {
  const changes = infomapChangelog;
  const [expanded, setExpanded] = useState(false);

  if (changes.length === 0) {
    return null;
  }

  const releaseIndices = [];
  changes.forEach((change, i) => {
    if (change.scope === "release") {
      releaseIndices.push(i);
    }
  });

  const maxVisible = 15;
  let visible = 0;
  let lastVisibleIndex = 0;

  for (let i = 0; i < changes.length && visible <= maxVisible; ++i) {
    const change = changes[i];
    if (change.type === "feat" || change.type === "fix") {
      lastVisibleIndex = i;
      ++visible;
    }
  }

  const lastIndex = expanded ? changes.length - 1 : lastVisibleIndex;

  const releases = [];
  releaseIndices.forEach((releaseIndex, i) => {
    let nextReleaseIndexOrEnd =
      i < releaseIndices.length - 1 ? releaseIndices[i + 1] : changes.length - 1;
    nextReleaseIndexOrEnd = Math.min(nextReleaseIndexOrEnd, lastIndex);
    if (releaseIndex < lastIndex - 2)
      releases.push(changes.slice(releaseIndex, nextReleaseIndexOrEnd));
  });

  return (
    <>
      <Heading id="Changelog" />
      {releases.map((changes, i) => (
        <Release key={i} changes={changes} />
      ))}
      {!expanded && (
        <Icon
          style={{ color: "rgb(204, 204, 204)", margin: "1em 0 0 1.85em" }}
          name="ellipsis vertical"
        />
      )}
      <Divider horizontal onClick={() => setExpanded(!expanded)}>
        <Header as="h5">
          <Icon name={expanded ? "angle up" : "angle down"} />
          {expanded ? "Show less" : "Show more"}
        </Header>
      </Divider>
    </>
  );
}
