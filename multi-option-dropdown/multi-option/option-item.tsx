import { MultiOptionItemType } from '../types';

interface MultiOptionItemProps {
	option: MultiOptionItemType;
	onChange: ( name: string, value: string, isChecked: boolean ) => void;
	isSelected: ( name: string, value: string ) => boolean;
	optionsType: 'checkbox' | 'radio' | string;
	name: string;
}

export default function MultiOptionItem( {
	option,
	onChange,
	isSelected,
	optionsType = 'checkbox',
	name,
}: MultiOptionItemProps ) {
	const { value, disabled = false, label } = option;
	const id = optionsType === 'radio' ? `multi_${ value }` : `multi_${ name }_${ value }`;

	return (
		<p>
			<input
				id={ id }
				type={ optionsType }
				name={ name ? name : value }
				value={ value }
				onChange={ ( ev ) => onChange( name, value, optionsType === 'checkbox' ? ev.target.checked : true ) }
				checked={ isSelected( name, value ) }
				disabled={ disabled }
				tabIndex={ 0 }
			/>

			<label aria-label={ option.label } htmlFor={ id }>
				{ label }
			</label>
		</p>
	);
}
