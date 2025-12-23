import type { ErrorLike } from '../types';

export default function getErrorDetails( error: ErrorLike ) {
	const err = error as any;

	if ( err.code === 0 ) {
		return err.message;
	}

	if ( err.data && err.data.wpdb ) {
		return (
			<span>
				{ `${ err.message } (${ err.code })` }: <code>{ err.data.wpdb }</code>
			</span>
		);
	}

	if ( err.code ) {
		return (
			<>
				{ err.message } (<code>{ err.code }</code>)
			</>
		);
	}

	return err.message;
}
