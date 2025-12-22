/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * External dependencies
 */

import clsx from 'clsx';

/**
 * Internal dependencies
 */

import Dropdown from '../dropdown';
import MultiOption from './multi-option';
import Title from './title';
import DropdownIcon from '../icons/dropdown';
import { MultiOptionValueType } from './types';
import './style.scss';

type SelectedMap = Record< string, string | boolean | undefined >;
type SelectedValue = string[] | SelectedMap;

interface MultiOptionDropdownProps {
	options: MultiOptionValueType[];
	selected: SelectedValue;
	onChange: ( newFlags: SelectedValue ) => void;
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
			const selectedMap = selected as SelectedMap;
			if ( name === value ) {
				return Boolean( selectedMap[ value ] );
			}
			return selectedMap[ name ] === value;
		}

		const selectedList = selected as string[];
		return selectedList.indexOf( value ) !== -1;
	}

	function changeValue( name: string, value: string, isChecked: boolean ) {
		if ( asObject ) {
			const selectedMap = selected as SelectedMap;
			onChange( {
				...selectedMap,
				[ name ]: name === value ? isChecked : value,
			} );
		} else {
			const selectedList = selected as string[];
			const toChange = name === value ? name : value;

			onChange(
				isChecked ? [ ...selectedList, toChange ] : selectedList.filter( ( item ) => item !== toChange )
			);
		}
	}

	return (
		<Dropdown
			renderToggle={ ( isOpen, toggle ) => (
				<div
					className={ clsx(
						'button',
						'action',
						'wpl-multioption__button',
						disabled && 'wpl-multioption__disabled',
						isOpen ? 'wpl-multioption__button_enabled' : null
					) }
					onClick={ toggle as any }
					tabIndex={ 0 }
					aria-label={ title || '' }
				>
					<Title
						selected={ selected }
						title={ title }
						showBadges={ badges }
						options={ options }
						disabled={ disabled }
						onChange={ changeValue as any }
					/>
					<DropdownIcon />
				</div>
			) }
			disabled={ disabled }
			align="right"
			matchMinimum
			renderContent={ () => (
				<div className={ clsx( 'wpl-multioption', className ) }>
					{ options.map( ( option, key ) => (
						<MultiOption
							option={ option }
							key={ key }
							isSelected={ isSelected }
							onChange={ changeValue as any }
						/>
					) ) }
				</div>
			) }
		/>
	);
}

export default MultiOptionDropdown;
