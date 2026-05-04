import { Alert } from "@chakra-ui/react";
import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (previousProps.children !== this.props.children && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <Alert.Root status="error" my={4}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Something went wrong.</Alert.Title>
              <Alert.Description>
                Reload the page and try again.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )
      );
    }

    return this.props.children;
  }
}
