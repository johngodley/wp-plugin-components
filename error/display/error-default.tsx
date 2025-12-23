/* eslint-disable @wordpress/i18n-text-domain */
import { __ } from '@wordpress/i18n';
import ErrorDebug from '../debug';
import DecodeError, { shouldHideDebug, shouldShowInformation } from '../decode-error';
import { is404 } from '../decode-error/error-detect';
import type { ErrorLike } from '../types';

type DisplayDefaultErrorProps = {
	title?: string;
	children?: React.ReactNode;
	error: ErrorLike;
	links: any;
	locale: string;
	renderDebug?: ( debug: string ) => React.ReactNode | null;
	[ key: string ]: any;
};

function getTitle( error: ErrorLike, title: string | undefined, locale: string ) {
	if ( is404( error ) ) {
		return __( 'REST API 404' );
	}

	return title || __( 'Something went wrong 🙁', locale );
}

function DisplayDefaultError( props: DisplayDefaultErrorProps ) {
	const { title, children, error, links, locale } = props;
	const showInfo = shouldShowInformation( error );
	const hideDebug = shouldHideDebug( error );
	const showSupport = ! is404( error );

	return (
		<>
			<h2>{ getTitle( error, title, locale ) }</h2>

			<div className="wpl-error__title">
				<DecodeError error={ error } links={ links } locale={ locale } />
			</div>

			{ showInfo && children }

			<ErrorDebug
				error={ error }
				locale={ locale }
				{ ...( hideDebug ? { mini: true } : {} ) }
				{ ...( ! showSupport && props.renderDebug ? { renderDebug: props.renderDebug } : {} ) }
				{ ...( props.details ? { details: props.details } : {} ) }
				{ ...( props.versions ? { versions: props.versions } : {} ) }
				{ ...( props.context ? { context: props.context } : {} ) }
			/>
		</>
	);
}

export default DisplayDefaultError;
