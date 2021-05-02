/** @const {number} */
const OFFSET_MAX = 20;

/** @const {number} */
const OFFSET_ARROW = 5;

/**
 * @typedef DropdownPosition
 * @type
 * @property {number} left - Left offset
 * @property {number} top - Top offset
 * @property {number} [width] - Optional width
 */

/**
 * @typedef PopoverPosition
 * @type
 * @property {number} parentWidth - Width of the parent
 * @property {number} left - Left offset
 * @property {number} width - Width
 */

/**
 * Adjust the dropdown position based on the alignment.
 *
 * @param {number} toggleLeftPos - left position.
 * @param {number} toggleWidth - width of toggle button.
 * @param {number} popoverWidth - width of popover.
 * @param {string} align - alignment.
 */
function adjustForAlignment( toggleLeftPos, toggleWidth, popoverWidth, align ) {
	if ( align === 'right' ) {
		return toggleLeftPos + toggleWidth - popoverWidth;
	}

	if ( align === 'centre' ) {
		return toggleLeftPos - ( popoverWidth / 2 );
	}

	return toggleLeftPos;
}

/**
 * This is left aligned by default. Adjust to fit the alignment and screen size
 *
 * @param {DropdownPosition|null} position - The position.
 * @param {TogglePosition|null} togglePosition - The toggle position.
 * @param {string} align - Popover alignment.
 * @param {HTMLElement|null} popoverRef - Our node.
 * @param {boolean} hasArrow - Show an arrow?
 */
export function getAdjustedPosition( position, togglePosition, align, valign, popoverRef, hasArrow ) {
	if ( position === null || togglePosition === null ) {
		return {};
	}

	if ( ! popoverRef ) {
		return {
			...position,
			visibility: 'hidden', // Hide until ready otherwise we get a flicker
		};
	}

	const width = position.width ? position.width : popoverRef.getBoundingClientRect().width;
	const minLeftPos = togglePosition.parentWidth - width - OFFSET_MAX;
	const adjustedLeft = adjustForAlignment( togglePosition.left, togglePosition.width, position.width ? position.width : width, align );

	return {
		...position,
		left: Math.min( minLeftPos, adjustedLeft ),
		top: hasArrow ? position.top + OFFSET_ARROW : position.top,
	};
}

/**
 * Get the dropdown position.
 *
 * @param {ClientRect|null} togglePosition - Toggle client rect.
 * @returns {DropdownPosition|null} Position
 */
export function getPosition( togglePosition ) {
	if ( togglePosition === null ) {
		return null;
	}

	const { left, top, height } = togglePosition;
	/** @type DropdownPosition */
	const position = {
		left: left,
		top: top + height,
	};

	return position;
}

/**
 * Adjust the arrow style.
 *
 * @param {object} style - Style object.
 * @param {HTMLElement|null} ref - DOM node.
 */
export function adjustArrowStyle( style, ref ) {
	if ( ref ) {
		return {
			...style,
			width: ref.getBoundingClientRect().width,
		};
	}

	return style;
}
