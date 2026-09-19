import {
	isSecurityPlugin,
	isServerError,
	isNonceError,
	isEmptyResponse,
	is404,
	isTooBig,
	isRESTDisabled,
	isUnknownError,
	isRedirectedAPI,
	isOriginMismatch,
	isParseError,
	isFailedFetch,
	isCachedApi,
	isDeprecatedApi,
} from './error-detect';

const detectors = {
	isSecurityPlugin,
	isServerError,
	isNonceError,
	isEmptyResponse,
	is404,
	isTooBig,
	isRESTDisabled,
	isRedirectedAPI,
	isOriginMismatch,
	isParseError,
	isFailedFetch,
	isCachedApi,
	isDeprecatedApi,
};

describe( 'error-detect', () => {
	describe.each( Object.entries( detectors ) )( '%s', ( _name, detector ) => {
		it( 'returns false for a missing error', () => {
			expect( detector( undefined ) ).toBe( false );
			expect( detector( null ) ).toBe( false );
		} );
	} );

	describe( 'isUnknownError', () => {
		it( 'returns true for a missing error', () => {
			expect( isUnknownError( undefined ) ).toBe( true );
			expect( isUnknownError( null ) ).toBe( true );
		} );
	} );
} );
