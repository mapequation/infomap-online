import { Component, ErrorInfo, PropsWithChildren } from "react";

export default class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  { hasError: boolean }
> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return "Something went wrong.";
    }

    return this.props.children;
  }
}
