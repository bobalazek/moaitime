import { Component, ReactNode } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

import { Alert, AlertDescription, AlertTitle, Button } from '@myzenbuddy/web-ui';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // TODO: send to reporting service once we have that set up
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full flex-col items-center justify-center p-4">
            <Alert>
              <FaExclamationTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {this.state.error?.message ||
                  'Typical developer, am I right? Develops some functionality that has bugs in it and does not even bother providing a fallback. We have notified them and then will be punished, do not worry about that!'}
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={() => window.location.reload()} size="sm">
                  Reload
                </Button>
              </div>
            </Alert>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
