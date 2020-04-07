import React from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import store from "../../store";

const FileItem = ({ file }) => (
  <Dropdown.Item onClick={() => store.output.downloadFile(file.key)}>
    <Icon name="download" color="blue" />
    <span style={{ color: "#555" }}>{file.filename}</span>
  </Dropdown.Item>
);

export default ({ disabled }) => {
  const { files, physicalFiles, stateFiles } = store.output;

  const DownloadAll = (
    <React.Fragment>
      <Dropdown.Divider />
      <Dropdown.Item onClick={store.output.downloadAll}>
        <Icon name="file archive" color="blue" />
        <span style={{ color: "#555" }}>Download all</span>
      </Dropdown.Item>
    </React.Fragment>
  );

  const DropdownMenu =
    stateFiles.length === 0 ? (
      <Dropdown.Menu>
        {physicalFiles.map(file => (
          <FileItem key={file.key} file={file} />
        ))}
        {DownloadAll}
      </Dropdown.Menu>
    ) : (
      <Dropdown.Menu>
        <Dropdown.Header>Physical nodes</Dropdown.Header>
        {physicalFiles.map(file => (
          <FileItem key={file.key} file={file} />
        ))}
        <Dropdown.Header>State nodes</Dropdown.Header>
        {stateFiles.map(file => (
          <FileItem key={file.key} file={file} />
        ))}
        {DownloadAll}
      </Dropdown.Menu>
    );

  return (
    <Dropdown
      disabled={disabled || files.length === 0}
      className="button icon active"
      trigger={<React.Fragment />}
    >
      {DropdownMenu}
    </Dropdown>
  );
};
