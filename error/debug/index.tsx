/* eslint-disable @wordpress/i18n-text-domain */
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { __ } from '@wordpress/i18n';
import type { ErrorLike } from '../types';

function getErrorDetails( error: ErrorLike ) {
	if ( typeof error === 'string' ) {
		return error;
	}

	const err = error as any;

	if ( err.code === 0 ) {
		return err.message;
	}

	if ( err.data && err.data.wpdb ) {
		return `${ err.message } (${ err.code }): ${ err.data.wpdb }`;
	}

	if ( err.code ) {
		return `${ err.message } (${ err.code })`;
	}

	return err.message;
}

function getDebug( error: any, versions?: string, context?: string ) {
	const message = versions ? [ versions ] : [];
	const { request = false, data } = error;

	message.push( '' );

	const { apiFetch } = request || {};
	if ( apiFetch && apiFetch.status && apiFetch.statusText ) {
		message.push( 'Action: ' + apiFetch.action );

		if ( apiFetch.body && apiFetch.body !== '{}' ) {
			message.push( 'Params: ' + apiFetch.body );
		}

		message.push( 'Code: ' + apiFetch.status + ' ' + apiFetch.statusText );
		message.push( '' );
	}

	message.push( 'Error: ' + getErrorDetails( error ) );

	if ( data ) {
		message.push( 'Raw: ' + data );
	}

	if ( context ) {
		message.push( '' );
		message.push( 'Context:' );
		message.push( context );
	}

	return message;
}

type ErrorDebugProps = {
	error: ErrorLike;
	mini?: boolean;
	context?: string;
	renderDebug?: ( debug: string ) => React.ReactNode;
	versions?: string;
	noParse?: boolean;
	details?: string[];
	locale: string;
};

function ErrorDebug( props: ErrorDebugProps ) {
	const { error, mini, context, renderDebug, versions, noParse = false, details = [], locale } = props;
	const [ showDebug, setShowDebug ] = useState( ! mini );

	if ( ! showDebug ) {
		return (
			<p>
				<button className="button button-secondary" type="button" onClick={ () => setShowDebug( true ) }>
					{ __( 'Show debug', locale ) }
				</button>
			</p>
		);
	}

	const debug = noParse ? [ error ] : ( getDebug( error, versions, context ) as any );

	return (
		<>
			<h3>{ __( 'Debug Information', locale ) }</h3>

			{ renderDebug && renderDebug( details.concat( debug as any ).join( '\n' ) ) }

			<p>
				<TextareaAutosize
					readOnly
					cols={ 120 }
					value={ details.concat( debug ).join( '\n' ) }
					maxRows={ 40 }
					spellCheck={ false }
				/>
			</p>
		</>
	);
}

export default ErrorDebug;
