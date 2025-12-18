import { useEffect, useState } from 'react';
import classnames from 'classnames';
import './style.scss';

const SHRINK_TIME = 5000;
let timer: ReturnType< typeof setTimeout > | false = false;

type SnackbarProps = {
	notices: string[];
	snackBarViewText: string;
	onClear: () => void;
};

function SnackbarNotice( { notices }: Pick< SnackbarProps, 'notices' > ) {
	return <>{ notices[ notices.length - 1 ] + ( notices.length > 1 ? ' (' + notices.length + ')' : '' ) }</>;
}

function Snackbar( { notices, onClear, snackBarViewText }: SnackbarProps ) {
	const [ shrunk, setShrunk ] = useState( false );

	useEffect( () => {
		if ( notices.length > 0 ) {
			if ( timer ) {
				clearTimeout( timer );
			}

			if ( shrunk ) {
				setShrunk( false );
			} else {
				timer = setTimeout( () => setShrunk( true ), SHRINK_TIME );
			}
		}

		return () => {
			if ( timer ) {
				clearTimeout( timer );
			}
		};
	}, [ notices, shrunk ] );

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

	const classes = classnames( 'notice', 'notice-info', 'wpl-notice', shrunk && 'wpl-notice_shrunk' );
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
