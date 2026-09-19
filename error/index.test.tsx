import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Error from './index';

const links = {
	url: 'https://example.com/url',
	http: 'https://example.com/http',
	api: 'https://example.com/api',
	rootUrl: 'https://example.com/wp-json/',
	siteHealth: 'https://example.com/site-health',
};

// jsdom doesn't implement scrollTo, and the error is scrolled into view when displayed
window.scrollTo = jest.fn();

function renderError( errors: any ) {
	return render( <Error errors={ errors } links={ links } locale="test" /> );
}

describe( 'Error', () => {
	it( 'renders nothing when there are no errors', () => {
		const { container } = renderError( [] );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'renders nothing when the errors are missing', () => {
		const { container } = renderError( undefined );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'ignores empty entries in the error list', () => {
		renderError( [ null, { message: 'Real error' }, undefined ] );

		expect( screen.getByText( 'Real error' ) ).toBeInTheDocument();
	} );

	it( 'pages between errors', () => {
		renderError( [ { message: 'First error' }, { message: 'Second error' } ] );

		expect( screen.getByText( '1/2' ) ).toBeInTheDocument();

		fireEvent.click( screen.getByText( '→' ) );

		expect( screen.getByText( 'Second error' ) ).toBeInTheDocument();
	} );

	it( 'returns to the first error when a new set of errors arrives', () => {
		const { rerender } = renderError( [ { message: 'First error' }, { message: 'Second error' } ] );

		fireEvent.click( screen.getByText( '→' ) );

		rerender(
			<Error
				errors={ [ { message: 'New error' }, { message: 'Another error' } ] }
				links={ links }
				locale="test"
			/>
		);

		expect( screen.getByText( '1/2' ) ).toBeInTheDocument();
		expect( screen.getByText( 'New error' ) ).toBeInTheDocument();
	} );

	it( 'shows the last error when the error list shrinks after paging', () => {
		const { rerender } = renderError( [ { message: 'First error' }, { message: 'Second error' } ] );

		fireEvent.click( screen.getByText( '→' ) );

		rerender( <Error errors={ [ { message: 'Only error' } ] } links={ links } locale="test" /> );

		expect( screen.getByText( 'Only error' ) ).toBeInTheDocument();
	} );
} );
