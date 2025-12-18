type OutsideEvent = MouseEvent | KeyboardEvent;

export default function isOutside( ev: OutsideEvent, containerRef: HTMLElement | null ): boolean {
	if ( ! containerRef ) {
		return false;
	}

	const target = ev.target as HTMLElement | null;

	if ( target && containerRef.contains( target ) ) {
		return false;
	}

	if ( ev.type === 'keydown' ) {
		return false;
	}

	if ( target && ( target.closest( '.wpl-dropdowntext__suggestions' ) || target.closest( '.wpl-multioption' ) ) ) {
		return false;
	}

	return true;
}
