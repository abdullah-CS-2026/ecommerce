import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error("Error Info:", errorInfo);

    // In production, you could send the error to Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-4xl font-bold text-red-600">
            Something went wrong
          </h1>

          <p className="mt-4 text-gray-600">
            An unexpected error occurred.
          </p>

          <button
            onClick={this.handleReload}
            className="mt-6 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;