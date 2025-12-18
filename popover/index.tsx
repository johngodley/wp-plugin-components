import type { CSSProperties, ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';
import PopoverContainer from './container';
import ClickOutside from '../click-outside';
import { getPosition, PopoverPosition } from './dimensions';
import { DROPDOWN_PORTAL, WORDPRESS_WRAP } from '../constant';
import getPortal from '../../wp-plugin-lib/portal';
import isOutside from '../click-outside/is-outside';
import './style.scss';

export type { PopoverPosition } from './dimensions';

type PopoverProps = {
	className?: string;
	align?: 'left' | 'right' | 'centre';
	valign?: 'top' | 'bottom';
	hasArrow?: boolean;
	focusLock?: boolean;
	onClose: () => void;
	children: ReactNode;
	popoverPosition: PopoverPosition | null;
	style?: CSSProperties | null;
};

function Popover( props: PopoverProps ) {
	const {
		children,
		className,
		align = 'left',
		valign = 'bottom',
		onClose,
		hasArrow = false,
		popoverPosition,
		style = null,
		focusLock = true,
	} = props;

	const onOutside = ( ev: MouseEvent | KeyboardEvent ) => {
		if (
			popoverPosition &&
			isOutside( ev, popoverPosition.ref ) === false &&
			( ev as KeyboardEvent ).key !== 'Escape'
		) {
			return;
		}

		onClose();
	};

	useEffect( () => {
		window.addEventListener( 'resize', onClose );

		return () => {
			window.removeEventListener( 'resize', onClose );
		};
	}, [ onClose ] );

	return createPortal(
		<ClickOutside className={ classnames( 'wpl-popover', className ) } onOutside={ onOutside }>
			<FocusLock returnFocus disabled={ ! focusLock }>
				<PopoverContainer
					position={ getPosition( popoverPosition ) }
					popoverPosition={ popoverPosition }
					align={ align }
					hasArrow={ hasArrow }
					valign={ valign }
					style={ style }
				>
					{ children }
				</PopoverContainer>
			</FocusLock>
		</ClickOutside>,
		getPortal( DROPDOWN_PORTAL ) || document.body
	);
}

export function getPopoverPosition(
	ref: HTMLElement | null,
	verticalAlign: 'top' | 'bottom' = 'bottom'
): PopoverPosition | null {
	const parentNode = document.getElementById( WORDPRESS_WRAP );
	if ( ref === null || parentNode === null ) {
		return null;
	}

	const parentRect = parentNode.getBoundingClientRect();
	const { height, width, left, top } = ref.getBoundingClientRect();

	return {
		left: verticalAlign === 'bottom' ? left - parentRect.left : left + width / 2 - parentRect.left - 7,
		top: top - parentRect.top + 1,
		width,
		height,
		parentWidth: parentRect.width,
		parentHeight: parentRect.height,
		ref,
	};
}

export default Popover;
