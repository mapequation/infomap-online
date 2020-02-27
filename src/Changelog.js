import React from "react";
import PropTypes from "prop-types";
import { List } from "semantic-ui-react";

const Change = ({ change }) => {
  const { scope, subject, references } = change;
  const Scope = scope ? <strong>{scope} </strong> : null;
  const Reference =
    (references || []).length > 0 ? (
      <a
        href={`https://github.com/mapequation/infomap/issues/${references[0].issue}`}
      >
        {" "}
        (#{references[0].issue})
      </a>
    ) : null;
  return (
    <List.Item>
      <span>
        {Scope}
        {subject.replace(/ \(#\d+\)$/, "")}
        {Reference}
      </span>
    </List.Item>
  );
};

const Changes = ({ heading, changes }) => {
  if (changes.length === 0) return null;
  return (
    <React.Fragment>
      <h4>{heading}</h4>
      <List bulleted>
        {changes.map((change, i) => (
          <Change key={i} change={change} />
        ))}
      </List>
    </React.Fragment>
  );
};

const Release = ({ changes }) => {
  const features = [];
  const fixes = [];
  const breaking = [];
  changes.forEach(change => {
    const { type } = change;
    const breakingNote = change.notes.find(
      note => note.title === "BREAKING CHANGE"
    );
    if (breakingNote) {
      breaking.push({ subject: breakingNote.text, scope: change.scope });
    }
    if (type === "feat") {
      features.push(change);
    } else if (type === "fix") {
      fixes.push(change);
    }
  });

  const releaseChange = changes[0];

  return (
    <div>
      <h3>{releaseChange.subject}</h3>

      {breaking.length > 0 ? (
        <Changes heading="BREAKING CHANGES" changes={breaking} />
      ) : null}

      {features.length > 0 ? (
        <Changes heading="Features" changes={features} />
      ) : null}

      {fixes.length > 0 ? <Changes heading="Fixes" changes={fixes} /> : null}
    </div>
  );
};

const Changelog = ({ changes }) => {
  if (changes.length === 0) {
    return null;
  }
  const releaseIndices = [];
  changes.forEach((change, i) => {
    if (change.scope === "release") {
      releaseIndices.push(i);
    }
  });
  const releases = [];
  releaseIndices.forEach((releaseIndex, i) => {
    const nextReleaseIndexOrEnd =
      i === releaseIndices.length - 1
        ? changes.length - 1
        : releaseIndices[i + 1];
    releases.push(changes.slice(releaseIndex, nextReleaseIndexOrEnd));
  });

  return (
    <div>
      {releases.map((changes, i) => (
        <Release key={i} changes={changes} />
      ))}
    </div>
  );
};

Changelog.propTypes = {
  changes: PropTypes.array.isRequired,
};

export default Changelog;
