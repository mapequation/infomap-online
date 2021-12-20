import { Fragment } from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import store from "../../store";


const FileItem = ({ file }) => (
  <Dropdown.Item onClick={() => store.output.downloadFile(file.key)}>
    <Icon name="download" color="blue" />
    <span style={{ color: "#555" }}>{file.filename}</span>
  </Dropdown.Item>
);

export default function DownloadMenu({ disabled }) {
  const { files, physicalFiles, stateFiles } = store.output;

  const DownloadAll = (
    <>
      <Dropdown.Divider />
      <Dropdown.Item onClick={store.output.downloadAll}>
        <Icon name="file archive" color="blue" />
        <span style={{ color: "#555" }}>Download all</span>
      </Dropdown.Item>
    </>
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
      trigger={<Fragment />}
    >
      {DropdownMenu}
    </Dropdown>
  );
}
