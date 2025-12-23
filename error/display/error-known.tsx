/* eslint-disable @wordpress/i18n-text-domain */
import { __ } from '@wordpress/i18n';
import ErrorDebug from '../debug';
import DecodeError from '../decode-error';
import type { ErrorLike } from '../types';

type DisplayKnownErrorProps = {
	title?: string;
	children?: React.ReactNode;
	error: ErrorLike;
	links: any;
	locale: string;
};

function DisplayKnownError( props: DisplayKnownErrorProps ) {
	const { title, children, error, links, locale } = props;

	return (
		<>
			<h2>{ title || __( 'Something went wrong 🙁', locale ) }</h2>

			<div className="wpl-error__detail">
				<DecodeError error={ error } links={ links } locale={ locale } />
			</div>

			{ children }

			<ErrorDebug { ...props } />
		</>
	);
}

export default DisplayKnownError;
