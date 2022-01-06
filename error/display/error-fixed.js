/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import ErrorDebug from '../debug';

function DisplayFixedError( props ) {
	const { title, children } = props;

	return (
		<>
			<h2>{ title || __( 'Something went wrong 🙁' ) }</h2>

			{ children }

			<ErrorDebug { ...props } noParse />
		</>
	);
}

export default DisplayFixedError;
