import { useState, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { getAdjustedPosition, adjustArrowStyle, PopoverPosition, DropdownPosition } from './dimensions';
import PopoverArrow from './arrow';

type PopoverContainerProps = {
	align: 'left' | 'right' | 'centre';
	valign: 'top' | 'bottom';
	hasArrow?: boolean;
	popoverPosition: PopoverPosition | DropdownPosition | null;
	position: DropdownPosition | null;
	children: ReactNode;
	style?: CSSProperties | null;
};

function PopoverContainer( props: PopoverContainerProps ) {
	const { position, children, popoverPosition, align, valign, hasArrow } = props;
	const [ style, setStyle ] = useState< any >( {
		arrow: {},
		content: { visibility: 'hidden', ...position },
	} );
	const popoverRef = useCallback(
		( node: HTMLElement | null ) => {
			if ( node ) {
				const content = getAdjustedPosition( position, popoverPosition, align, valign, node, !! hasArrow );

				setStyle( {
					content,
					arrow: adjustArrowStyle( content, node ),
				} );
			}
		},
		[ position, popoverPosition, align, valign, hasArrow ]
	);

	return (
		<>
			{ hasArrow && <PopoverArrow style={ style.arrow as CSSProperties } align={ align } /> }

			<div
				className="wpl-popover__content"
				style={ {
					...style.content,
					visibility: position && ( position as DropdownPosition ).left ? 'visible' : 'hidden',
					...( props.style !== null ? props.style : {} ),
				} }
				ref={ popoverRef }
			>
				{ children }
			</div>
		</>
	);
}

export default PopoverContainer;
