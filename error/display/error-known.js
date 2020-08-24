/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import ErrorDebug from '../debug';
import DecodeError from '../decode-error';

/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} props.mini
 */
function DisplayKnownError( props ) {
	const { title, children, error, links } = props;

	return (
		<>
			<h2>{ title || __( 'Something went wrong 🙁' ) }</h2>

			<div className="wpl-error__detail">
				<DecodeError error={ error } links={ links } />
			</div>

			{ children }

			<ErrorDebug { ...props } />
		</>
	);
}

export default DisplayKnownError;
