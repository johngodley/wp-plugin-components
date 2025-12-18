/**
 * External dependencies
 */

import MultiOptionItem from './option-item';
import MultiOptionGroup from './option-group';
import { MultiOptionValueType } from '../types';

interface MultiOptionProps {
	option: MultiOptionValueType;
	isSelected: ( name: string, value: string ) => boolean;
	onChange: ( name: string, value: string | boolean, isChecked?: boolean ) => void;
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

	return (
		<MultiOptionItem
			option={ option as any }
			isSelected={ isSelected }
			onChange={ onChange as any }
			optionsType="checkbox"
			name={ option?.value || '' }
		/>
	);
}

export default MultiOption;
