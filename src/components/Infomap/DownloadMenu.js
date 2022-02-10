import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import store from "../../store";

const FileItem = ({ file }) => (
  <MenuItem icon={<DownloadIcon />} onClick={() => store.output.downloadFile(file.key)}>
    {file.filename}
  </MenuItem>
);

export default function DownloadMenu({ disabled }) {
  const { files, physicalFiles, stateFiles } = store.output;

  return (
    <Menu>
      <MenuButton
        disabled={disabled || files.length === 0}
        colorScheme="blue"
        as={IconButton}
        icon={<ChevronDownIcon />}
        borderLeftRadius={0}
      />
      <MenuList>
        {stateFiles.length === 0 ? (
          physicalFiles.map((file) => <FileItem key={file.key} file={file} />)
        ) : (
          <>
            <MenuGroup>Physical nodes</MenuGroup>
            {physicalFiles.map((file) => (
              <FileItem key={file.key} file={file} />
            ))}
            <MenuGroup>State nodes</MenuGroup>
            {stateFiles.map((file) => (
              <FileItem key={file.key} file={file} />
            ))}
          </>
        )}
        {files.length > 1 && (
          <>
            <MenuDivider />
            <MenuItem onClick={store.output.downloadAll}>Download all</MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
