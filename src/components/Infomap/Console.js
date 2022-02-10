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
    const { content, placeholder, ...props } = this.props;

    return (
      <div ref={(el) => (this.container = el)} onScroll={this.onScroll}>
        {content ? <code>{content}</code> : <div>{placeholder}</div>}
      </div>
    );
  }
}
