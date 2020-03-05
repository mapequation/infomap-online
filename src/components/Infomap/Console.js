import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from "semantic-ui-react";
import './Console.css';

class Console extends React.Component {
  keepScrolling = true;

  onMountContainer = el => this.container = el;

  componentDidUpdate() {
    if (this.props.autoScroll && this.keepScrolling) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    const { scrollHeight, clientHeight } = this.container;
    this.container.scrollTop = scrollHeight - clientHeight;
  };

  onScroll = () => this.keepScrolling = this.isAtBottom();

  isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    const diff = scrollHeight - clientHeight;
    return scrollTop === diff;
  };

  render() {
    const { content } = this.props;

    return (
      <Segment padded style={{ boxShadow: "none" }} className="console">
        <div
          className="container"
          ref={this.onMountContainer}
          onScroll={this.onScroll}
        >
          <div>
            {!content ? <div className="placeholder">{this.props.placeholder}</div> : null}
            <code>{content}</code>
          </div>
        </div>
      </Segment>
    );
  }
}

Console.propTypes = {
  content: PropTypes.string,
  placeholder: PropTypes.string,
  autoScroll: PropTypes.bool.isRequired,
};

Console.defaultProps = {
  autoScroll: true,
}

export default Console;
