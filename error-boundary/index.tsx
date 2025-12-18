import { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
	renderCrash: ( error: Error | null, errorInfo: ErrorInfo | null, extra?: unknown ) => ReactNode;
	children: ReactNode;
	extra?: unknown;
};

type ErrorBoundaryState = {
	error: boolean;
	stack: Error | null;
	errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends Component< ErrorBoundaryProps, ErrorBoundaryState > {
	constructor( props: ErrorBoundaryProps ) {
		super( props );
		this.state = { error: false, stack: null, errorInfo: null };
	}

	static getDerivedStateFromError( error: Error ): Partial< ErrorBoundaryState > {
		return { error: true, stack: error };
	}

	componentDidCatch( error: Error, errorInfo: ErrorInfo ) {
		this.setState( { error: true, stack: error, errorInfo } );
		// eslint-disable-next-line no-console
		console.error( error, errorInfo );
	}

	render() {
		const { error, stack, errorInfo } = this.state;
		const { renderCrash, children, extra } = this.props;

		if ( error ) {
			return renderCrash( stack, errorInfo, extra );
		}

		return children;
	}
}

export default ErrorBoundary;
