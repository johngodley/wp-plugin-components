import { useEffect, useState } from 'react';
import clsx from 'clsx';
import './style.scss';

const SHRINK_TIME = 5000;
let timer: ReturnType< typeof setTimeout > | false = false;

interface Notice {
	message: string;
}

type SnackbarProps = {
	notices: Notice[];
	snackBarViewText: string;
	onClear: () => void;
};

function SnackbarNotice( { notices }: Pick< SnackbarProps, 'notices' > ) {
	const lastNotice = notices[ notices.length - 1 ];
	const message = lastNotice?.message ?? '';
	return <>{ message + ( notices.length > 1 ? ' (' + notices.length + ')' : '' ) }</>;
}

function Snackbar( { notices, onClear, snackBarViewText }: SnackbarProps ) {
	const [ shrunk, setShrunk ] = useState( false );

	// Reset shrunk state and start timer when notices change
	useEffect( () => {
		if ( notices.length > 0 ) {
			// Reset to expanded when new notices arrive
			setShrunk( false );

			if ( timer ) {
				clearTimeout( timer );
			}

			timer = setTimeout( () => setShrunk( true ), SHRINK_TIME );
		}

		return () => {
			if ( timer ) {
				clearTimeout( timer );
			}
		};
	}, [ notices ] );

	if ( notices.length === 0 ) {
		return null;
	}

	function onClick() {
		if ( shrunk ) {
			setShrunk( false );
		} else {
			onClear();
		}
	}

	function onKeyDown( e: React.KeyboardEvent ) {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			onClick();
		}
	}

	const classes = clsx( 'notice', 'notice-info', 'wpl-notice', shrunk && 'wpl-notice_shrunk' );
	return (
		<div className={ classes } onClick={ onClick } onKeyDown={ onKeyDown } role="button" tabIndex={ 0 }>
			<div className="closer">
				<span className="dashicons dashicons-yes" />
			</div>
			<p>
				{ shrunk ? (
					<span className="dashicons dashicons-warning" title={ snackBarViewText } />
				) : (
					<SnackbarNotice notices={ notices } />
				) }
			</p>
		</div>
	);
}

export default Snackbar;
