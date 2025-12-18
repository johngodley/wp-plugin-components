import { useEffect } from 'react';
import classnames from 'classnames';
import ModalContent from './content';
import type { ModalProps } from './index';

const CLASS = 'wpl-modal_shown';

type ModalWrapperProps = ModalProps;

function ModalWrapper( { padding = true, ...rest }: ModalWrapperProps ) {
	useEffect( () => {
		document.body.classList.add( CLASS );

		return () => {
			document.body.classList.remove( CLASS );
		};
	}, [] );

	const classes = classnames( {
		'wpl-modal_wrapper': true,
		'wpl-modal_wrapper-padding': padding,
	} );

	return (
		<div className={ classes }>
			<div className="wpl-modal_backdrop"></div>

			<div className="wpl-modal_main">
				<ModalContent { ...rest } />
			</div>
		</div>
	);
}

export default ModalWrapper;
