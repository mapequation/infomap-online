import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Icon,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { changelog as infomapChangelog } from "@mapequation/infomap";
import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { Heading } from "../Contents";

const Change = ({ change }) => {
  const { scope, subject, references } = change;
  const Scope = scope ? <strong>{scope} </strong> : null;
  const Subject = (
    <chakra.span whiteSpace="pre">
      {subject.replace(/ \(#\d+\)$/, "").replace(/\.\s/g, ".\n")}
    </chakra.span>
  );
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
    <ListItem sx={{ "::marker": { color: "blackAlpha.400" } }}>
      <chakra.span wordBreak="break-all">
        {Scope}
        {Subject}
        {Reference}
      </chakra.span>
    </ListItem>
  );
};

const Changes = ({ heading, changes }) => {
  if (changes.length === 0) return null;
  return (
    <>
      <h4>{heading}</h4>
      <UnorderedList>
        {changes.map((change, i) => (
          <Change key={i} change={change} />
        ))}
      </UnorderedList>
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
      <a
        href={`https://github.com/mapequation/infomap/releases/tag/v${release.subject}`}
      >
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
  let numVisible = 0;
  let lastVisibleIndex = 0;

  for (let i = 0; i < changes.length && numVisible <= maxVisible; ++i) {
    const change = changes[i];
    if (change.type === "feat" || change.type === "fix") {
      lastVisibleIndex = i;
      ++numVisible;
    }
  }

  const lastIndex = expanded ? changes.length - 1 : lastVisibleIndex;
  const releases = [];

  releaseIndices.forEach((releaseIndex, i) => {
    let nextReleaseIndexOrEnd =
      i < releaseIndices.length - 1
        ? releaseIndices[i + 1]
        : changes.length - 1;
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
      {!expanded && <Icon as={IoEllipsisVertical} my="1em" ml="0.8em" />}
      <Button
        size="sm"
        isFullWidth
        variant="ghost"
        leftIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </>
  );
}
