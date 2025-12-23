import { MouseEvent, KeyboardEvent, MouseEventHandler, ReactNode } from 'react';
import clsx from 'clsx';
import './style.scss';

type BadgeProps = {
	children: ReactNode;
	className?: string;
	onClick?: MouseEventHandler< HTMLDivElement >;
	onCancel?: MouseEventHandler< HTMLDivElement >;
	title?: string;
	disabled?: boolean;
	small?: boolean;
};

const Badge = ( props: BadgeProps ) => {
	const { children, className, onClick, title = '', onCancel, disabled = false, small = false } = props;
	const extra = {
		title,
		onClick,
	};

	const cancel = ( ev: MouseEvent< HTMLDivElement > ) => {
		ev.preventDefault();
		if ( ! disabled && onCancel ) {
			onCancel( ev );
		}
	};

	const handleCancelKeyDown = ( ev: KeyboardEvent< HTMLDivElement > ) => {
		if ( ev.key === 'Enter' || ev.key === ' ' ) {
			ev.preventDefault();
			if ( ! disabled && onCancel ) {
				onCancel( ev as unknown as MouseEvent< HTMLDivElement > );
			}
		}
	};

	return (
		<div
			className={ clsx( 'wpl-badge', className, {
				'wpl-badge__click': onClick,
				'wpl-badge__small': small,
				'wpl-badge__disabled': disabled,
			} ) }
			{ ...extra }
		>
			<div className="wpl-badge__content">{ children }</div>
			{ onCancel && (
				<div
					className="wpl-badge__close dashicons dashicons-no-alt"
					onClick={ cancel }
					onKeyDown={ handleCancelKeyDown }
					role="button"
					tabIndex={ 0 }
				/>
			) }
		</div>
	);
};

export default Badge;
