import React, { type PropsWithChildren } from "react";
import ErrorFallback from "@components/ErrorFallback";

interface State {
   hasError: boolean
}

class ErrorBoundary extends React.Component<PropsWithChildren,State> {

    constructor(props: PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }
    handleReset = () => {
         window.history.back();
         // Small delay to ensure the URL changed before we attempt to re-render
         setTimeout(() => this.setState({ hasError: false }), 100);
    }
    // Update state
    static getDerivedStateFromError(_: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    // Report the error
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error,errorInfo);
    }
    render(): React.ReactNode {
        if(this.state.hasError) {
            return <ErrorFallback handleReset={this.handleReset} />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;