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
import { observer } from "mobx-react";
import useStore from "../../store";

function FileItem({ label, onClick }) {
  return (
    <MenuItem icon={<DownloadIcon />} onClick={onClick}>
      {label}
    </MenuItem>
  );
}

export default observer(function DownloadMenu({ disabled }) {
  const store = useStore();
  const { files, physicalFiles, stateFiles } = store.output;

  return (
    <Menu>
      <MenuButton
        disabled={files.length === 0 || disabled}
        colorScheme="blue"
        as={IconButton}
        icon={<ChevronDownIcon />}
        borderLeftRadius={0}
        size="sm"
      />
      <MenuList>
        {stateFiles.length === 0 ? (
          physicalFiles.map((file) => (
            <FileItem
              key={file.key}
              label={file.filename}
              onClick={() => store.output.downloadFile(file.key)}
            />
          ))
        ) : (
          <>
            <MenuGroup>Physical nodes</MenuGroup>
            {physicalFiles.map((file) => (
              <FileItem
                key={file.key}
                label={file.filename}
                onClick={() => store.output.downloadFile(file.key)}
              />
            ))}
            <MenuGroup>State nodes</MenuGroup>
            {stateFiles.map((file) => (
              <FileItem
                key={file.key}
                label={file.filename}
                onClick={() => store.output.downloadFile(file.key)}
              />
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
});
