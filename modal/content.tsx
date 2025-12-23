/**
 * External dependencies
 */

import type { ReactNode } from 'react';
import ClickOutside from '../click-outside';
import clsx from 'clsx';

/**
 * onClose callback.
 *
 * @callback requestCallback
 * @param {Object} ev Event handler object
 */

/**
 * The modal content.
 *
 * @param {{onClose: requestCallback}} props - Provide the URL and child components
 */
type ModalContentProps = {
	onClose: () => void;
	children: ReactNode;
	className?: string;
};

function ModalContent( { onClose, children, className }: ModalContentProps ) {
	const onOutside = ( ev: MouseEvent | KeyboardEvent ) => {
		if ( ev.target instanceof HTMLElement && ev.target.classList.contains( 'wpl-modal_main' ) ) {
			onClose();
		}
	};

	return (
		<ClickOutside className="wpl-click-outside" onOutside={ onOutside }>
			<div className={ clsx( 'wpl-modal_content', className ) }>
				<div className="wpl-modal_close">
					<button type="button" onClick={ onClose }>
						&#x2716;
					</button>
				</div>

				{ children }
			</div>
		</ClickOutside>
	);
}

export default ModalContent;
