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

function DisplayDefaultError( props ) {
	const { title, children, error, links } = props;
	const showInfo = shouldShowInformation( errors );
	const hideDebug = shouldHideDebug( errors );

	return (
		<>
			<h2>{ title || __( 'Something went wrong 🙁' ) }</h2>

			<div className="wpl-error__title">
				<DecodeError error={ error } links={ links } />
			</div>

			{ showInfo && children }

			<ErrorDebug { ...props } { ...( hideDebug ? { mini: true } : {} ) } />
		</>
	);
}

export default DisplayDefaultError;
