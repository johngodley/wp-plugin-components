/* eslint-disable @wordpress/i18n-text-domain */
import { __ } from '@wordpress/i18n';
import ErrorDebug from '../debug';

type DisplayApiErrorProps = {
	locale: string;
	error?: any;
};

function DisplayApiError( props: DisplayApiErrorProps ) {
	const { locale } = props;

	return (
		<>
			<h2>{ __( 'Bad data', locale ) }</h2>

			<p>
				{ __(
					'There was a problem making a request to your site. This could indicate you provided data that did not match requirements, or that the plugin sent a bad request.',
					locale
				) }
			</p>
			<p>{ __( 'Please review your data and try again.', locale ) }</p>

			<ErrorDebug { ...props } error={ props.error || {} } mini />
		</>
	);
}

export default DisplayApiError;
