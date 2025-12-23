const OFFSET_MAX = 20;
const OFFSET_ARROW = 5;

export type DropdownPosition = {
	left: number;
	top: number;
	width?: number;
	height?: number;
	visibility?: string;
};

export type PopoverPosition = {
	parentWidth: number;
	parentHeight: number;
	left: number;
	top: number;
	width: number;
	height: number;
	ref: HTMLElement;
};

function adjustForAlignment( toggleLeftPos: number, toggleWidth: number, popoverWidth: number, align: string ) {
	if ( align === 'right' ) {
		return toggleLeftPos + toggleWidth - popoverWidth;
	}

	if ( align === 'centre' ) {
		return toggleLeftPos - popoverWidth / 2;
	}

	return toggleLeftPos;
}

export function getAdjustedPosition(
	position: DropdownPosition | null,
	togglePosition: PopoverPosition | DropdownPosition | any,
	align: string,
	_valign: string,
	popoverRef: HTMLElement | null,
	hasArrow: boolean
) {
	if ( position === null || togglePosition === null ) {
		return {};
	}

	if ( ! popoverRef ) {
		return {
			...position,
			visibility: 'hidden',
		};
	}

	const width = position.width ? position.width : popoverRef.getBoundingClientRect().width;
	const minLeftPos = togglePosition.parentWidth - width - OFFSET_MAX;
	const adjustedLeft = adjustForAlignment(
		togglePosition.left,
		togglePosition.width,
		position.width ? position.width : width,
		align
	);

	return {
		...position,
		left: Math.min( minLeftPos, adjustedLeft ),
		top: hasArrow ? position.top + OFFSET_ARROW : position.top,
	};
}

export function getPosition( togglePosition: PopoverPosition | DOMRect | null ): DropdownPosition | null {
	if ( togglePosition === null ) {
		return null;
	}

	const { left, top, height } = togglePosition;
	const position: DropdownPosition = {
		left,
		top: top + height,
	};

	return position;
}

export function adjustArrowStyle( style: Record< string, unknown >, ref: HTMLElement | null ) {
	if ( ref ) {
		return {
			...style,
			width: ref.getBoundingClientRect().width,
		};
	}

	return style;
}
