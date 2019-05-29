import React from 'react';
import PropTypes from 'prop-types';
import './Console.css';

class Console extends React.Component {

  keepScrolling = true;

  onMountStdoutContainer = el => {
    this.stdoutContainer = el;
  };

  componentDidUpdate() {
    if (this.props.autoScroll && this.keepScrolling) {
      this.scrollConsoleToBottom();
    }
  }

  onScroll = () => {
    this.keepScrolling = this.isAtBottom();
  }

  isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = this.stdoutContainer;
    const diff = scrollHeight - clientHeight;
    const scrollIsAtBottom = scrollTop === diff;
    return scrollIsAtBottom;
  };

  scrollConsoleToBottom = () => {
    const { scrollHeight, clientHeight } = this.stdoutContainer;
    const diff = scrollHeight - clientHeight;
    this.stdoutContainer.scrollTop = diff;
  };

  render() {
    const { value } = this.props;
    return (
      <div
        className="Console stdoutContainer"
        ref={this.onMountStdoutContainer}
        onScroll={this.onScroll}
      >
        <div>
          { !value ? <div className="console-placeholder">{this.props.placeholder}</div> : null }
          <code className="code">{value}</code>
        </div>
      </div>
    );
  }
}

Console.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  autoScroll: PropTypes.bool.isRequired,
};

Console.defaultProps = {
  className: "",
  style: {},
  autoScroll: true,
}

export default Console;
