import React from "react";
import PropTypes from "prop-types";
import { List } from "semantic-ui-react";
import { infomapChangelog } from "@mapequation/infomap";
import { Heading } from './TOC';

const Change = ({ change }) => {
  const { scope, subject, references } = change;
  const Scope = scope ? <strong>{scope} </strong> : null;
  const Subject = <span style={{ whiteSpace: 'pre' }}>{subject.replace(/ \(#\d+\)$/, "").replace(/\.\s/g, ".\n")}</span>;
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
    <div style={{ marginBottom: 2 }}>
      <h3 style={{ marginBottom: 2 }}>
        {releaseChange.subject}
        <span style={{ color: '#999', fontWeight: 300, marginLeft: 6, fontSize: '0.8em' }}>({releaseChange.date.slice(0,10)})</span>
      </h3>
    
      <div style={{ marginBottom: 0, marginLeft: 19, padding: '10px 0 10px 10px', borderLeft: '1px solid #ccc' }}>
        {breaking.length > 0 ? (
          <Changes heading="BREAKING CHANGES" changes={breaking} />
        ) : null}
  
        {features.length > 0 ? (
          <Changes heading="Features" changes={features} />
        ) : null}
  
        {fixes.length > 0 ? <Changes heading="Fixes" changes={fixes} /> : null}
      </div>
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
    <>
      <Heading id="Changelog" />
      {releases.map((changes, i) => (
        <Release key={i} changes={changes} />
      ))}
    </>
  );
};

Changelog.propTypes = {
  changes: PropTypes.array.isRequired,
};

export default () => <Changelog changes={infomapChangelog} />;
