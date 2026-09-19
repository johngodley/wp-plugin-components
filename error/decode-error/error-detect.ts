import type { ApiError, MaybeError } from '../types';

export function isSecurityPlugin( error: MaybeError ) {
	const { request, code } = ( error ?? {} ) as ApiError;

	if ( request && request.status && code ) {
		return (
			( [ 400, 401, 403, 405 ].indexOf( request.status ) !== -1 || code === 'rest_no_route' ) &&
			parseInt( String( code ), 10 ) === 0
		);
	}

	return false;
}

export function isServerError( error: MaybeError ) {
	return [ 500, 502, 503 ].indexOf( ( error as ApiError )?.request?.apiFetch?.status ?? 0 ) !== -1;
}

export function isNonceError( error: MaybeError ) {
	return ( error as ApiError )?.code === 'rest_cookie_invalid_nonce';
}

export function isEmptyResponse( error: MaybeError ) {
	return ( error as ApiError )?.code === 0;
}

export function is404( error: MaybeError ) {
	return ( error as ApiError )?.request?.apiFetch?.status === 404;
}

export function isTooBig( error: MaybeError ) {
	return ( error as ApiError )?.request?.apiFetch?.status === 413;
}

export function isRESTDisabled( error: MaybeError ) {
	const code = ( error as ApiError )?.code;
	return code === 'disabled' || code === 'rest_disabled';
}

export function isUnknownError( error: MaybeError ) {
	return typeof ( error as ApiError )?.message === 'undefined';
}

export function isRedirectedAPI( error: MaybeError ) {
	return ( error as ApiError )?.code === 'rest_api_redirected';
}

export function isOriginMismatch( error: MaybeError ) {
	return ( error as ApiError )?.code === 'rest_api_cors_mismatch';
}

export function isParseError( error: MaybeError ) {
	return ( error as ApiError )?.code === 'SyntaxError';
}

export function isFailedFetch( error: MaybeError ) {
	const message = ( error as ApiError )?.message?.toString().toLowerCase();

	if ( message ) {
		return (
			message === 'failed to fetch' ||
			message === 'not allowed to request resource' ||
			message.indexOf( 'networkerror' ) !== -1
		);
	}

	return false;
}

export function isCachedApi( error: MaybeError ) {
	const { headers } = ( error as ApiError )?.request ?? {};

	if ( headers && Symbol.iterator in Object( headers ) ) {
		for ( const [ key ] of headers as any ) {
			if ( key.toLowerCase().indexOf( 'cf-' ) !== -1 ) {
				return true;
			}
		}
	}

	return false;
}

export function isDeprecatedApi( error: MaybeError ) {
	const data = ( error as ApiError )?.data;
	return typeof data === 'string' && data.indexOf( '<b>Deprecated</b>:  Directive' ) !== -1;
}
