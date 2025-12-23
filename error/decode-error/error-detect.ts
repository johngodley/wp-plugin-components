import type { ApiError, ErrorLike } from '../types';

export function isSecurityPlugin( error: ErrorLike ) {
	const apiError = error as ApiError;
	const { request, code } = apiError;

	if ( request && request.status && code ) {
		return (
			( [ 400, 401, 403, 405 ].indexOf( request.status ) !== -1 || code === 'rest_no_route' ) &&
			parseInt( String( code ), 10 ) === 0
		);
	}

	return false;
}

export function isServerError( error: ErrorLike ) {
	return [ 500, 502, 503 ].indexOf( ( error as ApiError )?.request?.apiFetch?.status ?? 0 ) !== -1;
}

export function isNonceError( error: ErrorLike ) {
	return ( error as ApiError ).code === 'rest_cookie_invalid_nonce';
}

export function isEmptyResponse( error: ErrorLike ) {
	return typeof ( error as ApiError ).code !== 'undefined' && ( error as ApiError ).code === 0;
}

export function is404( error: ErrorLike ) {
	return ( error as ApiError )?.request?.apiFetch?.status === 404;
}

export function isTooBig( error: ErrorLike ) {
	return ( error as ApiError )?.request?.apiFetch?.status === 413;
}

export function isRESTDisabled( error: ErrorLike ) {
	const code = ( error as ApiError ).code;
	return code === 'disabled' || code === 'rest_disabled';
}

export function isUnknownError( error: ErrorLike ) {
	return typeof ( error as ApiError ).message === 'undefined';
}

export function isRedirectedAPI( error: ErrorLike ) {
	return ( error as ApiError )?.code === 'rest_api_redirected';
}

export function isParseError( error: ErrorLike ) {
	return ( error as ApiError ).code === 'SyntaxError';
}

export function isFailedFetch( error: ErrorLike ) {
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

export function isCachedApi( error: ErrorLike ) {
	const { headers } = ( error as ApiError ).request ?? {};

	if ( headers && Symbol.iterator in Object( headers ) ) {
		for ( const [ key ] of headers as any ) {
			if ( key.toLowerCase().indexOf( 'cf-' ) !== -1 ) {
				return true;
			}
		}
	}

	return false;
}

export function isDeprecatedApi( error: ErrorLike ) {
	const data = ( error as ApiError ).data;
	return typeof data === 'string' && data.indexOf( '<b>Deprecated</b>:  Directive' ) !== -1;
}
