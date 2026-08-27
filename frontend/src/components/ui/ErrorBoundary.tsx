import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-800/40 mb-4">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Something went wrong</h2>
          <p className="text-zinc-400 max-w-md mb-6 text-sm">
            {this.state.error?.message || 'An unexpected rendering error occurred in the application context.'}
          </p>
          <Button
            onClick={this.handleReset}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            variant="primary"
          >
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
