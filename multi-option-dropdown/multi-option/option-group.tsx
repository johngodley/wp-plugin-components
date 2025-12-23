/**
 * Internal dependencies
 */
import MultiOptionItem from './option-item';
import { MultiOptionValueType } from '../types';

interface MultiOptionProps {
	option: MultiOptionValueType;
	onChange: ( name: string, value: string | boolean ) => void;
	isSelected: ( name: string, value: string ) => boolean;
	optionsType: string;
}

function MultiOptionGroup( props: MultiOptionProps ) {
	const { option, optionsType, onChange, isSelected } = props;
	const { options = [], label, value } = option;

	return (
		<div className="wpl-multioption__group">
			<h5>{ label }</h5>

			{ options.map( ( groupOption, key ) => (
				<MultiOptionItem
					option={ groupOption }
					isSelected={ isSelected }
					onChange={ onChange }
					name={ value ? value : groupOption.value }
					optionsType={ optionsType }
					key={ key }
				/>
			) ) }
		</div>
	);
}

export default MultiOptionGroup;
