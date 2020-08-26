/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import ErrorDebug from '../debug';

function DisplayDefaultError( props ) {
	return (
		<>
			<h2>{ __( 'Bad data' ) }</h2>

			<p>{ __( 'There was a problem making a request to your site. This could indicate you provided data that did not match requirements, or that the plugin sent a bad request.' ) }</p>
			<p>{ __( 'Plrease review your data and try again.' ) }</p>

			<ErrorDebug { ...props } mini />
		</>
	);
}

export default DisplayDefaultError;
