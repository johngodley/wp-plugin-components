import { ReactNode, useRef, useState } from 'react';
import classnames from 'classnames';
import './style.scss';
import Popover, { getPopoverPosition } from '../popover';

type Align = 'left' | 'right' | 'centre';
type Valign = 'top' | 'bottom';

type DropdownProps = {
	className?: string;
	align?: Align;
	valign?: Valign;
	hasArrow?: boolean;
	disabled?: boolean;
	matchMinimum?: boolean;
	onClose?: () => void;
	renderContent: ( toggle: () => void ) => ReactNode;
	renderToggle: ( isShowing: boolean, toggle: ( ev?: Event ) => void ) => ReactNode;
};

function Dropdown( props: DropdownProps ) {
	const {
		renderContent,
		className,
		renderToggle,
		align = 'left',
		valign = 'bottom',
		hasArrow = false,
		matchMinimum = false,
		disabled = false,
		onClose,
	} = props;
	const [ isShowing, setShowing ] = useState( false );
	const [ togglePosition, setTogglePosition ] = useState< ReturnType< typeof getPopoverPosition > | null >( null );
	const toggleRef = useRef< HTMLDivElement | null >( null );

	const toggleDropdown = ( ev?: Event ) => {
		if ( ! toggleRef.current ) {
			return;
		}

		const position = getPopoverPosition( toggleRef.current, valign );

		ev?.stopPropagation();

		if ( ! disabled ) {
			setTogglePosition( position );
			setShowing( ! isShowing );
		}
	};

	function close() {
		setShowing( false );

		onClose?.();
	}

	return (
		<>
			<div
				className={ classnames(
					'wpl-popover__toggle',
					className,
					disabled && 'wpl-popover__toggle__disabled'
				) }
				ref={ toggleRef }
			>
				{ renderToggle( isShowing, toggleDropdown ) }
			</div>

			{ isShowing && togglePosition && (
				<Popover
					align={ align }
					valign={ valign }
					hasArrow={ hasArrow }
					className={ className }
					onClose={ close }
					popoverPosition={ togglePosition }
					style={ matchMinimum ? { minWidth: `${ togglePosition.width }px` } : undefined }
				>
					{ renderContent( () => setShowing( false ) ) }
				</Popover>
			) }
		</>
	);
}

export default Dropdown;
