import { Box } from "@chakra-ui/react";
import { Component } from "react";


export default class Console extends Component {
  keepScrolling = true;
  onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    const diff = scrollHeight - clientHeight;
    const isAtBottom = scrollTop === diff;
    return (this.keepScrolling = isAtBottom);
  };

  componentDidUpdate() {
    if (this.keepScrolling) {
      const { scrollHeight, clientHeight } = this.container;
      this.container.scrollTop = scrollHeight - clientHeight;
    }
  }

  render() {
    const { placeholder, children, ...props } = this.props;

    return (
      <Box
        bg="white"
        h="60ch"
        px="1rem"
        py="0.5rem"
        fontSize="sm"
        overflow="auto"
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="md"
        ref={(el) => (this.container = el)}
        onScroll={this.onScroll}
      >
        {children ? (
          <code style={{ fontSize: "0.55rem" }}>{children}</code>
        ) : (
          <Box color="gray.400">{placeholder}</Box>
        )}
      </Box>
    );
  }
}
