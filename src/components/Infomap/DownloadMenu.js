

import React from "react";
import { Dropdown } from "semantic-ui-react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import store from "../../store";

const onDownloadClick = (format) => () => {
  const { name } = store.network;
  const getFilename = (name, format) => {
    if (format === "states_as_physical" || format === "states") {
      return `${name}_${format}.net`;
    }
    if (/_states/.test(format)) {
      return `${name}_states.${format.replace("_states", "")}`;
    }
    return `${name}.${format}`;
  };
  const filename = getFilename(name, format);
  const content = store.output.activeContent;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
  store.output.setDownloaded();
};

const onDownloadZipClick = (outputOptions) => () => {
  const { name } = store.network;
  const zip = new JSZip();
  for (let format of outputOptions) {
    const content = store.output[format];
    zip.file(`${name}.${format}`, content);
  }
  zip.generateAsync({ type: "blob" })
    .then(blob => saveAs(blob, `${name}.zip`));
};

export default ({ disabled }) => {

  const outputOptions = [
    ...store.output.physicalOptions,
    ...store.output.statesOptions,
  ];

  return (
    <Dropdown
      disabled={disabled || outputOptions.length === 0}
      className="button icon active"
      trigger={<React.Fragment/>}
    >
      <Dropdown.Menu>
        {outputOptions.map((format, key) =>
          <Dropdown.Item
            key={key}
            icon="download"
            onClick={onDownloadClick(format)}
            content={`Download ${format}`}
          />,
        )}
        {outputOptions.length > 1 &&
        <Dropdown.Item
          icon="download"
          onClick={onDownloadZipClick(outputOptions)}
          content="Download all"
        />}
      </Dropdown.Menu>
    </Dropdown>
  )
}