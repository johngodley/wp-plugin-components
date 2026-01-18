/**
 * External dependencies
 */

import MultiOptionItem from './option-item';
import MultiOptionGroup from './option-group';
import { MultiOptionValueType } from '../types';

interface MultiOptionProps {
	option: MultiOptionValueType;
	isSelected: ( name: string, value: string ) => boolean;
	onChange: ( name: string, value: string, isChecked: boolean ) => void;
	multiple?: boolean;
}

function MultiOption( props: MultiOptionProps ) {
	const { option, isSelected, onChange } = props;

	if ( option.options ) {
		const { optionsType = 'checkbox' } = option;

		return (
			<MultiOptionGroup
				option={ option }
				optionsType={ optionsType }
				isSelected={ isSelected }
				onChange={ onChange }
			/>
		);
	}

	// For standalone options without sub-options, value is required
	const value = option.value || '';

	return (
		<MultiOptionItem
			option={ {
				label: option.label,
				value,
				disabled: option.disabled ?? false,
				default: option.default ?? false,
			} }
			isSelected={ isSelected }
			onChange={ onChange }
			optionsType="checkbox"
			name={ value }
		/>
	);
}

export default MultiOption;
