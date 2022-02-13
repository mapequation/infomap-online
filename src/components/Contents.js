import { Heading as CkHeading } from "@chakra-ui/react";
import styles from "../styles/Contents.module.css";

const tocSource = {
  Infomap: {
    heading: "Infomap",
    children: ["InfomapOnline", "Install"],
  },
  InfomapOnline: {
    heading: "Infomap Online",
  },
  Install: {
    heading: "Install",
    children: ["DownloadBinary", "CompilingFromSource"],
  },
  DownloadBinary: {
    heading: "Download binary",
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
  Running: {
    heading: "Running",
    children: ["Input", "Output", "Parameters"],
  },
  Input: {
    heading: "Input formats",
    children: [
      "InputLinkList",
      "InputPajek",
      "InputBipartite",
      "InputMultilayer",
      "InputStates",
    ],
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
    children: [
      "InputMultilayerFull",
      "InputMultilayerIntraInter",
      "InputMultilayerIntra",
    ],
  },
  InputMultilayerFull: {
    heading: "With multilayer links",
  },
  InputMultilayerIntraInter: {
    heading: "With inter-layer links",
  },
  InputMultilayerIntra: {
    heading: "Without inter-layer links",
  },
  InputStates: {
    heading: "States",
  },
  Output: {
    heading: "Output formats",
    children: [
      "PhysicalAndStateOutput",
      "OutputTree",
      "OutputFtree",
      "OutputClu",
      "OutputNewick",
      "OutputJson",
    ],
  },
  PhysicalAndStateOutput: {
    heading: "Physical and state-level output",
  },
  OutputTree: {
    heading: "Tree",
  },
  OutputFtree: {
    heading: "FTree",
  },
  OutputClu: {
    heading: "Clu",
  },
  OutputNewick: {
    heading: "Newick",
  },
  OutputJson: {
    heading: "JSON",
  },
  Parameters: {
    heading: "Parameters",
    children: [
      "ParamsInput",
      "ParamsOutput",
      "ParamsAlgorithm",
      "ParamsAccuracy",
      "ParamsAbout",
    ],
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
  MapEquation: {
    heading: "The Map Equation",
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
  ids.forEach((id) => {
    const item = tree[id];
    (item.children || []).forEach((childId, i) => {
      const child = tree[childId];
      child.parent = id;
      child.childId = i + 1;
    });
  });

  // set levels
  ids.forEach((id) => {
    const item = tree[id];
    item.level = 1;
    let parent = item.parent;
    while (parent) {
      parent = tree[parent].parent;
      item.level += 1;
    }
  });

  // set child ids of top nodes
  ids
    .filter((id) => tree[id].level === 1)
    .forEach((id, i) => (tree[id].childId = i + 1));

  // set tree ids
  ids.forEach((id) => {
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

export const Heading = ({ id, ...props }) => {
  const { level, heading } = toc[id];
  const sizes = "lg md sm xs".split(" ");
  const mt = [8, 8, 6, 4];
  const mb = [6, 6, 4, 2];
  return (
    <CkHeading
      as={`h${level}`}
      size={sizes[level - 1]}
      mt={mt[level - 1]}
      mb={mb[level - 1]}
      id={id}
      _hover={{
        _after: {
          content: '"#"',
          color: "gray.300",
          fontSize: "0.8em",
          ml: "0.2em",
        },
      }}
      {...props}
    >
      <a href={`#${id}`}>{heading}</a>
    </CkHeading>
  );
};

const Item = ({ id, toc, level, maxLevel }) => {
  const item = toc[id];
  if (maxLevel && item.level > maxLevel) {
    return null;
  }

  const sizes = "md sm xs".split(" ");

  return (
    <li
      id={item.treeId}
      style={{ marginTop: (3 - level) * 6, marginBottom: 0 }}
    >
      <CkHeading
        as={`h${level + 2}`}
        size={sizes[level - 1]}
        className={styles.liHeader}
        style={{ marginBottom: 0 }}
      >
        <a href={`#${id}`}>{item.heading}</a>
      </CkHeading>
      <Items
        ids={item.children}
        toc={toc}
        level={level + 1}
        maxLevel={maxLevel}
      />
    </li>
  );
};

const Items = ({ ids, toc, level = 1, maxLevel }) => {
  if (!ids) return null;

  const classNames =
    level === 1 ? `${styles.tocList} ${styles.tocList1}` : styles.tocList;

  return (
    <ol className={classNames}>
      {ids.map((id) => (
        <Item key={id} id={id} toc={toc} level={level} maxLevel={maxLevel} />
      ))}
    </ol>
  );
};

export default function Contents() {
  const topLevelIds = Object.keys(toc).filter((id) => toc[id].level === 1);
  return <Items ids={topLevelIds} toc={toc} maxLevel={3} />;
}
