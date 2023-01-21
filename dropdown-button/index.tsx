/**
 * External dependencies
 */

import { useState } from 'react';
import classnames from 'classnames';
import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';

/**
 * Internal dependencies
 */

import DropdownIcon from '../icons/dropdown';
import Button from '../button';
import './style.scss';

/**
 * A menu item.
 *
 * @typedef {{name: string, title: string}} ButtonOption
 */

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
	align?: string;
}

export default function DropdownButton( props: DropdownProps ) {
	const [ referenceElement, setReferenceElement ] = useState();
	const [ popperElement, setPopperElement ] = useState();
	const { options, disabled = false, title, align = 'bottom-start' } = props;
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

	function onSelect( ev, name: string, toggle ) {
		ev.preventDefault();
		ev.stopPropagation();
		toggle();

		props.onSelect( name );
	}

	return (
		<Popover
			className={ classnames( 'wpl-dropdownbutton', options.length <= 1 ? 'wpl-dropdownbutton__single' : null ) }
		>
			<Popover.Button
				ref={ setReferenceElement }
				disabled={ disabled }
				className={ classnames(
					'button',
					'button-secondary',
					'wpl-popover__toggle',
					disabled && 'wpl-dropdownbutton__disabled'
				) }
			>
				<h5>{ title }</h5>

				<DropdownIcon />
			</Popover.Button>

			<Popover.Panel
				ref={ setPopperElement }
				style={ styles.popper }
				{ ...attributes.popper }
				className="wpl-popover"
			>
				{ ( { close } ) => (
					<ul>
						{ options.map( ( { label, value, description }: DropdownButtonItem ) => (
							<li
								key={ value }
								className={ classnames( {
									[ 'wpl-dropdownbutton__' + value ]: true,
								} ) }
							>
								<Button onClick={ ( ev ) => onSelect( ev, value, close ) }>
									{ label }

									{ description && <span>{ description }</span> }
								</Button>
							</li>
						) ) }
					</ul>
				) }
			</Popover.Panel>
		</Popover>
	);
}
