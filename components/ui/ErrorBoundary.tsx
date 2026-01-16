
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Standard Error Boundary component to catch rendering errors in the component tree.
 */
// Fix: Explicitly use Component from React and ensure generics are provided for props and state.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Declare and initialize state as a class property to resolve "property does not exist" errors in the constructor.
  public state: ErrorBoundaryState = {
    hasError: false
  };

  /**
   * Updates state so the next render will show the fallback UI.
   */
  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Logs error details for debugging.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    // Fix: Destructuring state and props from the inherited members of the Component class.
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#010409] flex flex-col items-center justify-center p-6 text-center">
          <div className="p-8 border border-red-500/30 bg-red-900/5 rounded-lg max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-orbitron font-bold text-white mb-2 uppercase tracking-widest">System Cascade Failure</h1>
            <p className="text-gray-400 font-mono text-sm mb-6 uppercase">Critical error detected in logic sequence. Protocol integrity compromised.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black font-orbitron py-3 rounded-sm transition-all"
            >
              <RefreshCw size={18} /> FORCE_REBOOT
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
