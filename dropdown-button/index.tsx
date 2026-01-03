import { useState, MouseEvent } from 'react';
import clsx from 'clsx';
import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Placement } from '@popperjs/core';
import DropdownIcon from '../icons/dropdown';
import Button from '../button';
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
	align?: Placement;
	selected?: string;
}

export default function DropdownButton( props: DropdownProps ) {
	const [ referenceElement, setReferenceElement ] = useState< HTMLButtonElement | null >( null );
	const [ popperElement, setPopperElement ] = useState< HTMLElement | null >( null );
	const { options, disabled = false, title, align = 'bottom-start', selected } = props;
	const { styles, attributes } = usePopper( referenceElement, popperElement, {
		placement: align,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [ 0, 2 ],
				},
			},
		],
	} );

	function onSelect( ev: MouseEvent< HTMLButtonElement >, name: string, toggle: () => void ) {
		ev.preventDefault();
		ev.stopPropagation();
		toggle();

		props.onSelect( name );
	}

	return (
		<Popover className={ clsx( 'wpl-dropdownbutton', options.length <= 1 ? 'wpl-dropdownbutton__single' : null ) }>
			<button
				onClick={ () => options[ 0 ] && props.onSelect( options[ 0 ].value ) }
				type="button"
				className={ clsx(
					'wpl-dropdownbutton',
					'wpl-dropdownbutton__single',
					disabled && 'wpl-dropdownbutton__disabled'
				) }
			>
				<h5>{ title }</h5>
			</button>

			{ options.length > 1 && (
				<>
					<Popover.Button
						ref={ setReferenceElement }
						disabled={ disabled }
						className={ clsx( 'wpl-popover__toggle', disabled && 'wpl-dropdownbutton__disabled' ) }
					>
						<DropdownIcon />
					</Popover.Button>
					<Popover.Panel
						ref={ setPopperElement }
						style={ styles.popper }
						{ ...attributes.popper }
						className="wpl-popover wpl-popover__content"
					>
						{ ( { close } ) => (
							<ul>
								{ options.map( ( { label, value, description }: DropdownButtonItem ) => (
									<li
										key={ value }
										className={ clsx( {
											[ 'wpl-dropdownbutton__' + value ]: true,
											'wpl-dropdownbutton__selected': selected === value,
										} ) }
									>
										{ selected === value ? (
											<span className="wpl-dropdownbutton__selected-icon">✓</span>
										) : (
											<span className="wpl-dropdownbutton__selected-icon"></span>
										) }
										<Button onClick={ ( ev ) => onSelect( ev, value, close ) }>
											{ label }

											{ description && <span>{ description }</span> }
										</Button>
									</li>
								) ) }
							</ul>
						) }
					</Popover.Panel>
				</>
			) }
		</Popover>
	);
}
