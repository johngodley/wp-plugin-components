import { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import ModalContent from './content';
import type { ModalProps } from './index';

const CLASS = 'wpl-modal_shown';

type ModalWrapperProps = ModalProps;

function ModalWrapper( { padding = true, onClose, ...rest }: ModalWrapperProps ) {
	const handleKeyDown = useCallback(
		( event: KeyboardEvent ) => {
			if ( event.key === 'Escape' ) {
				onClose();
			}
		},
		[ onClose ]
	);

	useEffect( () => {
		document.body.classList.add( CLASS );
		document.addEventListener( 'keydown', handleKeyDown );

		return () => {
			document.body.classList.remove( CLASS );
			document.removeEventListener( 'keydown', handleKeyDown );
		};
	}, [ handleKeyDown ] );

	const classes = clsx( {
		'wpl-modal_wrapper': true,
		'wpl-modal_wrapper-padding': padding,
	} );

	return (
		<div className={ classes }>
			<div className="wpl-modal_backdrop"></div>

			<div className="wpl-modal_main">
				<ModalContent onClose={ onClose } { ...rest } />
			</div>
		</div>
	);
}

export default ModalWrapper;
