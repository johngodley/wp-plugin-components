/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import ErrorDebug from '../debug';
import DecodeError, { shouldHideDebug, shouldShowInformation } from '../decode-error';
import { is404 } from '../decode-error/error-detect';

function getTitle( error, title ) {
	if ( is404( error ) ) {
		return __( 'REST API 404');
	}

	return title || __( 'Something went wrong 🙁' )
}

function DisplayDefaultError( props ) {
	const { title, children, error, links } = props;
	const showInfo = shouldShowInformation( error );
	const hideDebug = shouldHideDebug( error );
	const showSupport = ! is404( error );

	return (
		<>
			<h2>{ getTitle( error, title ) }</h2>

			<div className="wpl-error__title">
				<DecodeError error={ error } links={ links } />
			</div>

			{ showInfo && children }

			<ErrorDebug { ...props } { ...( hideDebug ? { mini: true } : {} ) } renderDebug={ showSupport ? null : props.renderDebug } />
		</>
	);
}

export default DisplayDefaultError;
