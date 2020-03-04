import React from "react";
import { Header } from "semantic-ui-react";


const tocSource = {
  Infomap: {
    heading: "Infomap",
    children: ["Install", "Prerequisites"],
  },
  InfomapOnline: {
    heading: "Infomap Online",
  },
  Install: {
    heading: "Install",
    children: ["UsingPip", "CompilingFromSource"],
  },
  UsingPip: {
    heading: "Using pip",
  },
  CompilingFromSource: {
    heading: "Compiling from source",
    children: ["Download", "Git"],
  },
  Download: {
    heading: "Download source code",
  },
  Git: {
    heading: "Clone the git repository",
  },
  Prerequisites: {
    heading: "Prerequisites",
    children: ["Linux", "macOS", "Windows"],
  },
  Linux: {
    heading: "Linux",
  },
  macOS: {
    heading: "macOS",
  },
  Windows: {
    heading: "Windows",
  },
  Running: {
    heading: "Running",
    children: ["Input", "Output", "Parameters"],
  },
  Input: {
    heading: "Input formats",
    children: ["InputLinkList", "InputPajek", "InputBipartite", "InputMultilayer", "InputStates"],
  },
  InputLinkList: {
    heading: "Link-list",
  },
  InputPajek: {
    heading: "Pajek",
  },
  InputBipartite: {
    heading: "Bipartite",
  },
  InputMultilayer: {
    heading: "Multilayer",
  },
  InputStates: {
    heading: "States",
  },
  Output: {
    heading: "Output formats",
    children: ["OutputTree", "OutputFtree", "OutputClu"]
  },
  OutputTree: {
    heading: "Tree"
  },
  OutputFtree: {
    heading: "FTree"
  },
  OutputClu: {
    heading: "Clu",
  },
  Parameters: {
    heading: "Parameters",
    children: ["ParamsAbout", "ParamsInput", "ParamsOutput", "ParamsAlgorithm", "ParamsAccuracy"],
  },
  ParamsAbout: {
    heading: "About",
  },
  ParamsInput: {
    heading: "Input",
  },
  ParamsOutput: {
    heading: "Output",
  },
  ParamsAlgorithm: {
    heading: "Algorithm",
  },
  ParamsAccuracy: {
    heading: "Accuracy",
  },
  Changelog: {
    heading: "Changelog",
  },
  Features: {
    heading: "Features",
  },
  Algorithm: {
    heading: "Algorithm",
    children: ["TwolevelAlgorithm", "MultilevelAlgorithm"],
  },
  TwolevelAlgorithm: {
    heading: "Two-level Algorithm",
  },
  MultilevelAlgorithm: {
    heading: "Multi-level Algorithm",
  },
  Feedback: {
    heading: "Feedback",
  },
  References: {
    heading: "References",
  },
};

const toc = (function (tocSource) {
  const ids = Object.keys(tocSource);
  const tree = tocSource;

  // set parents and child id
  ids.forEach(id => {
    const item = tree[id];
    (item.children || []).forEach((childId, i) => {
      const child = tree[childId];
      child.parent = id;
      child.childId = i + 1;
    });
  });

  // set levels
  ids.forEach(id => {
    const item = tree[id];
    item.level = 1;
    let parent = item.parent;
    while (parent) {
      parent = tree[parent].parent;
      item.level += 1;
    }
  });

  // set child ids of top nodes
  ids.filter(id => tree[id].level === 1)
    .forEach((id, i) => tree[id].childId = i + 1);

  // set tree ids
  ids.forEach(id => {
    const item = tree[id];
    const childIds = [item.childId];
    let parent = item.parent;
    while (parent) {
      const parentItem = tree[parent];
      childIds.unshift(parentItem.childId);
      parent = parentItem.parent;
    }
    item.treeId = childIds.join(".");
  });

  return tree;
})(tocSource);

export const Heading = ({ id }) => {
  const { level, heading } = toc[id];
  return (
    <Header as={`h${level}`} id={id}>
      <a href={`#${id}`}>{heading}</a>
    </Header>
  );
};

const Item = ({ id, toc, level, maxLevel }) => {
  const item = toc[id];
  if (item.hideInToc || (maxLevel && item.level > maxLevel)) {
    return null;
  }

  return (
    <li className="tocItem" id={item.treeId} style={{ marginTop: (3 - level) * 6, marginBottom: 0 }}>
      <Header as={`h${level + 2}`} className="liHeader" style={{ marginBottom: 0 }}>
        <span style={{ fontWeight: 300, marginRight: "0.25em" }}>{item.treeId}</span>
        <a href={`#${id}`}>{item.heading}</a>
      </Header>
      <Items ids={item.children} toc={toc} level={level + 1} maxLevel={maxLevel}/>
    </li>
  );
};

const Items = ({ ids, toc, level = 1, maxLevel }) => {
  if (!ids) return null;
  return (
    <ol className={`tocList tocList${level}`}>
      {ids.map(id => (
        <Item key={id} id={id} toc={toc} level={level} maxLevel={maxLevel}/>
      ))}
    </ol>
  );
};

export default () => {
  const topLevelIds = Object.keys(toc)
    .filter(id => toc[id].level === 1);
  return (
    <Items ids={topLevelIds} toc={toc} maxLevel={3}/>
  );
};
