import { MouseEvent } from 'react';
import clsx from 'clsx';
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react';
import DropdownIcon from '../icons/dropdown';
import './style.scss';

interface DropdownButtonItem {
	value: string;
	label: string;
	description?: string;
}

/**
 * A dropdown button
 */
interface DropdownProps {
	options: DropdownButtonItem[];
	disabled?: boolean;
	title: string;
	onSelect: ( name: string ) => void;
	selected?: string;
}

export default function DropdownButton( props: DropdownProps ) {
	const { options, disabled = false, title, selected } = props;

	function onSelect( ev: MouseEvent< HTMLButtonElement >, name: string, close: () => void ) {
		ev.preventDefault();
		ev.stopPropagation();
		close();

		props.onSelect( name );
	}

	function handleMainButtonClick( ev: MouseEvent< HTMLButtonElement > ) {
		ev.preventDefault();
		const current = selected || options[ 0 ]?.value;
		if ( current ) {
			props.onSelect( current );
		}
	}

	return (
		<Popover className={ clsx( 'wpl-dropdownbutton', options.length <= 1 ? 'wpl-dropdownbutton__single' : null ) }>
			<button
				onClick={ handleMainButtonClick }
				type="button"
				className={ clsx( 'wpl-dropdownbutton__main', disabled && 'wpl-dropdownbutton__disabled' ) }
			>
				<h5>{ title }</h5>
			</button>

			{ options.length > 1 && (
				<>
					<PopoverButton
						disabled={ disabled }
						className={ clsx(
							'wpl-dropdownbutton',
							'wpl-popover__toggle',
							disabled && 'wpl-dropdownbutton__disabled'
						) }
					>
						<DropdownIcon />
					</PopoverButton>
					<PopoverPanel
						anchor="bottom start"
						className="wpl-dropdownbutton__popover wpl-popover wpl-popover__content"
					>
						{ ( { close } ) => (
							<ul>
								{ options.map( ( { label, value, description }: DropdownButtonItem ) => (
									<li
										key={ value }
										className={ clsx( {
											'wpl-dropdownbutton__item': true,
											[ 'wpl-dropdownbutton__' + value ]: true,
											'wpl-dropdownbutton__selected': selected === value,
										} ) }
									>
										{ selected === value ? (
											<span className="wpl-dropdownbutton__selected-icon">✓</span>
										) : (
											<span className="wpl-dropdownbutton__selected-icon"></span>
										) }
										<CloseButton
											as="button"
											className="button"
											onClick={ ( ev: MouseEvent< HTMLButtonElement > ) =>
												onSelect( ev, value, close )
											}
										>
											{ label }

											{ description && <span>{ description }</span> }
										</CloseButton>
									</li>
								) ) }
							</ul>
						) }
					</PopoverPanel>
				</>
			) }
		</Popover>
	);
}
