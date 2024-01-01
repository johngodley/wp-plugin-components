/* eslint-disable @wordpress/i18n-text-domain */
import { __ } from '@wordpress/i18n';
import ExternalLink from '../../external-link';
import {
	isServerError,
	isEmptyResponse,
	isSecurityPlugin,
	is404,
	isTooBig,
	isRESTDisabled,
	isUnknownError,
	isParseError,
	isFailedFetch,
	isRedirectedAPI,
	isCachedApi,
	isDeprecatedApi,
	isRemoveChildError,
} from './error-detect';
import getErrorDetails from './error-details';
import extractPhpError from './php-details';
import createInterpolateElement from '../../interpolate';
import type { ErrorLike } from '../types';

export function shouldShowInformation( error: ErrorLike ) {
	if ( is404( error ) ) {
		return false;
	}

	if ( isRedirectedAPI( error ) ) {
		return false;
	}

	if ( isRESTDisabled( error ) ) {
		return false;
	}

	return true;
}

export function shouldHideDebug( error: ErrorLike ) {
	if ( is404( error ) ) {
		return true;
	}

	if ( isRedirectedAPI( error ) ) {
		return true;
	}

	if ( isRESTDisabled( error ) ) {
		return true;
	}

	return false;
}

type DecodeErrorProps = {
	error: ErrorLike;
	links: { url: string; http: string; api: string; rootUrl: string; siteHealth: string };
	locale: string;
};

const DecodeError = ( { error, links, locale }: DecodeErrorProps ) => {
	if ( typeof error === 'string' ) {
		return <p>{ error }</p>;
	}

	if ( isEmptyResponse( error ) ) {
		return (
			<p>
				{ __(
					'WordPress did not return a response. This could mean an error occurred or that the request was blocked. Please check your server error_log.',
					locale
				) }
			</p>
		);
	}

	if ( isSecurityPlugin( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'Your REST API is probably being blocked by a security plugin. Please disable this, or configure it to allow REST API requests.',
						locale
					) }
				</p>
				<p>
					<ExternalLink url={ links.api }>
						{ __( 'Read this REST API guide for more information.', locale ) }
					</ExternalLink>
				</p>
			</>
		);
	}

	if ( is404( error ) ) {
		return (
			<>
				<p>
					{ __(
						'Your WordPress REST API is returning a 404 page. This is almost certainly an external plugin or server configuration issue.',
						locale
					) }
				</p>
				<p className="wpl-error__highlight">
					<strong>
						{ __(
							'You will will need to fix this on your site. Redirection is not causing the error.',
							locale
						) }
					</strong>
				</p>
				<ul>
					<li>
						{ createInterpolateElement(
							__( 'Can you access your {{api}}REST API{{/api}} without it redirecting?', locale ),
							{
								api: <ExternalLink url={ links.rootUrl }>{ links.rootUrl }</ExternalLink>,
							}
						) }
					</li>
					<li>
						{ createInterpolateElement(
							__( 'Check your {{link}}Site Health{{/link}} and fix any issues.', locale ),
							{
								link: <ExternalLink url={ links.siteHealth }>{ links.siteHealth }</ExternalLink>,
							}
						) }
					</li>
					<li>{ __( 'Your server configuration is blocking access to the REST API.', locale ) }</li>
					<li>
						{ __(
							'A security plugin or firewall is blocking access. You will need to whitelist the REST API.',
							locale
						) }
					</li>
				</ul>
				<p>
					<ExternalLink url={ links.api }>
						{ __( 'Read this REST API guide for more information.', locale ) }
					</ExternalLink>
				</p>
			</>
		);
	}

	if ( isRedirectedAPI( error ) ) {
		return <p>{ __( 'Your REST API is being redirected. Please remove the redirection for the API.', locale ) }</p>;
	}

	if ( isTooBig( error ) ) {
		return (
			<p>
				{ __(
					'Your server has rejected the request for being too big. You will need to reconfigure it to continue.',
					locale
				) }
			</p>
		);
	}

	if ( isUnknownError( error ) ) {
		return <p>{ __( 'An unknown error occurred.', locale ) }</p>;
	}

	if ( isDeprecatedApi( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>{ __( 'Your REST API is showing a deprecated PHP error. Please fix this error.', locale ) }</p>
			</>
		);
	}

	if ( isServerError( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'This could be a security plugin, or your server is out of memory or has an external error. Please check your server error log',
						locale
					) }
				</p>
				<p>
					<ExternalLink url={ links.http }>
						{ __( 'Read this REST API guide for more information.', locale ) }
					</ExternalLink>
				</p>
			</>
		);
	}

	if ( isRESTDisabled( error ) ) {
		return (
			<p>
				{ __( 'Your WordPress REST API has been disabled. You will need to enable it to continue.', locale ) }
			</p>
		);
	}

	if ( isParseError( error ) ) {
		const php = extractPhpError( ( error as any )?.request?.apiFetch?.body || '' );

		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'WordPress returned an unexpected message. This could be a PHP error from another plugin, or data inserted by your theme.',
						locale
					) }
				</p>
				{ php.length > 1 && (
					<p>
						<strong>{ __( 'Possible cause', locale ) }:</strong> <code>{ php.substr( 0, 1000 ) }</code>
					</p>
				) }
			</>
		);
	}

	if ( isFailedFetch( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'Unable to make request due to browser security. This is typically because your WordPress and Site URL settings are inconsistent, or the request was blocked by your site CORS policy.',
						locale
					) }
				</p>
				<p>
					<ExternalLink url={ links.url }>
						{ __( 'Read this REST API guide for more information.', locale ) }
					</ExternalLink>
				</p>
			</>
		);
	}

	if ( isCachedApi( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'Your REST API appears to be cached and this will cause problems. Please exclude your REST API from your caching system.',
						locale
					) }
				</p>
			</>
		);
	}

	if ( isRemoveChildError( error ) ) {
		return (
			<>
				<p>{ getErrorDetails( error ) }</p>
				<p>
					{ __(
						'You are running a plugin or a browser extension that is modifying the page and breaking Redirection.', locale
					) }
				</p>
			</>
		);
	}

	return <p>{ getErrorDetails( error ) }</p>;
};

export default DecodeError;
