import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { List, ListItem } from "@chakra-ui/react";
import { observer } from "mobx-react";
import store from "../../store";


const DocIcon = (
  <a href="#PhysicalAndStateOutput">
    <QuestionOutlineIcon />
  </a>
);

export default observer(function OutputMenu(props) {
  const { activeKey, setActiveKey, physicalFiles, stateFiles } = store.output;

  const getMenuItem = ({ key, name }) => (
    <ListItem
      key={key}
      mb={1}
      color={activeKey === key ? "gray.900" : "gray.500"}
      onClick={() => setActiveKey(key)}
      cursor="pointer"
    >
      {name}
    </ListItem>
  );

  if (!stateFiles.length) {
    return physicalFiles.length < 2 ? null : (
      <List {...props}>
        {physicalFiles.map(getMenuItem)}
      </List>
    );
  }

  const items = [
    { header: <>Physical level {DocIcon}</>, files: physicalFiles },
    { header: <>State level {DocIcon}</>, files: stateFiles },
  ];

  return (
    <List {...props}>
      {items.map(({ header, files }, key) => (
        <>
          <ListItem key={key} mb={1} fontWeight={500}>
            {header}
          </ListItem>
          <List ml={4} mb={2}>
            {files.map(getMenuItem)}
          </List>
        </>
      ))}
    </List>
  );
});
