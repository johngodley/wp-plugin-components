import { ReactNode, useEffect, useRef, useCallback } from 'react';
import isOutside from './is-outside';

type ClickOutsideProps = {
	children: ReactNode;
	className?: string;
	onOutside: ( ev: MouseEvent | KeyboardEvent ) => void;
};

export default function ClickOutside( props: ClickOutsideProps ) {
	const containerRef = useRef< HTMLDivElement | null >( null );
	const { children, onOutside, className } = props;

	const outside = useCallback(
		( ev: MouseEvent | KeyboardEvent ) => {
			if ( isOutside( ev, containerRef.current ) || ( 'key' in ev && ev.key === 'Escape' ) ) {
				onOutside( ev );
			}
		},
		[ onOutside ]
	);

	useEffect( () => {
		addEventListener( 'mousedown', outside );
		addEventListener( 'keydown', outside );

		return () => {
			removeEventListener( 'mousedown', outside );
			removeEventListener( 'keydown', outside );
		};
	}, [ outside ] );

	return (
		<div className={ className } ref={ containerRef }>
			{ children }
		</div>
	);
}
