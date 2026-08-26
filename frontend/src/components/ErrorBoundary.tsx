import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches errors thrown during render anywhere in the tree below it and
 * shows a recovery UI instead of an unstyled crash / blank white screen.
 * Does NOT catch errors in event handlers, async code, or server-side
 * rendering — those are handled at the call site (e.g. React Query's
 * `error` state, try/catch in submit handlers).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="text-xl font-bold text-neutral-900">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-neutral-600">
            This page hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
