import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="136" x2="128" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="176" r="16"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="mt-6">
              <details className="cursor-pointer">
                <summary className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none">
                  Show technical details
                </summary>
                <div className="mt-3 p-4 bg-gray-100 rounded overflow-auto max-h-64 text-xs">
                  <p className="font-bold">Error: {this.state.error && this.state.error.toString()}</p>
                  <p className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </p>
                </div>
              </details>
              <button
                onClick={() => window.location.reload()}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Remove loader element when React has mounted
const hideLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease-out";
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 500);
  }
};

// Get the root element
const container = document.getElementById("root");

// Create a root
const root = createRoot(container);

// Render with error boundary
try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  // Hide the loader after successful render
  setTimeout(hideLoader, 300);
} catch (error) {
  console.error("Error during initial render:", error);
  // Show a basic error message if the error happens during render
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <h2 style="color: #e53e3e; margin-bottom: 1rem;">Failed to load application</h2>
      <p>There was a critical error loading the application. Please try again later.</p>
    </div>
  `;
  hideLoader();
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept();
}

// Global error handling for uncaught errors
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
  // Could implement error reporting service here
});

// Global promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Could implement error reporting service here
});

// Log initial render completion
console.log("Application initialization attempted");
