/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * Internal dependencies
 */

import Dropdown from '../dropdown';
import MultiOption from './multi-option';
import Title from './title';
import DropdownIcon from '../icons/dropdown';
import { MultiOptionValueType } from './types';
import './style.scss';

interface MultiOptionDropdownProps {
	options: MultiOptionValueType[];
	selected: Object | string[];
	onChange: ( newFlags: any ) => void;
	title?: string;
	badges?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	hideTitle?: boolean;
	className?: string;
	asObject?: boolean;
}

function MultiOptionDropdown( props: MultiOptionDropdownProps ) {
	const {
		options,
		selected,
		onChange,
		title = '',
		badges = false,
		disabled = false,
		className,
		asObject = false,
	} = props;

	function isSelected( name: string, value: string ) {
		if ( asObject ) {
			if ( name === value ) {
				return selected[ value ];
			}

			return selected[ name ] === value;
		}

		return selected.indexOf( value ) !== -1;
	}

	function changeValue( name, value, isChecked ) {
		if ( asObject ) {
			onChange( {
				...selected,
				[ name ]: name === value ? isChecked : value,
			} );
		} else {
			const toChange = name === value ? name : value;

			onChange( isChecked ? [ ...selected, toChange ] : selected.filter( ( item ) => item !== toChange ) );
		}
	}

	return (
		<Dropdown
			renderToggle={ ( isOpen, toggle ) => (
				<div
					className={ classnames(
						'button',
						'action',
						'wpl-multioption__button',
						disabled && 'wpl-multioption__disabled',
						isOpen ? 'wpl-multioption__button_enabled' : null
					) }
					onClick={ toggle }
					tabIndex={ 0 }
					aria-label={ title || '' }
				>
					<Title
						selected={ selected }
						title={ title }
						showBadges={ badges }
						options={ options }
						disabled={ disabled }
						onChange={ changeValue }
					/>
					<DropdownIcon />
				</div>
			) }
			disabled={ disabled }
			align="right"
			matchMinimum
			renderContent={ () => (
				<div className={ classnames( 'wpl-multioption', className ) }>
					{ options.map( ( option, key ) => (
						<MultiOption option={ option } key={ key } isSelected={ isSelected } onChange={ changeValue } />
					) ) }
				</div>
			) }
		/>
	);
}

export default MultiOptionDropdown;
