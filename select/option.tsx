import { SelectOption } from './types';

type OptionProps = {
	value: SelectOption[ 'value' ];
	label: SelectOption[ 'label' ];
	disabled?: boolean;
};

const Option = ( { value, label, disabled = false }: OptionProps ) => {
	if ( Array.isArray( value ) ) {
		return (
			<optgroup label={ String( label ) } disabled={ disabled }>
				{ value.map( ( item, pos ) => (
					<Option label={ item.label } value={ item.value } disabled={ item.disabled || false } key={ pos } />
				) ) }
			</optgroup>
		);
	}

	return (
		<option value={ value as string } disabled={ disabled }>
			{ label }
		</option>
	);
};

export default Option;
