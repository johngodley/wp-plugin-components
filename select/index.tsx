import type React from 'react';
import Option from './option';
import { SelectOption } from './types';

type SelectProps = {
	items: SelectOption[];
	name: string;
	value: string;
	onChange: ( ev: React.ChangeEvent< HTMLSelectElement > ) => void;
	disabled?: boolean;
	className?: string;
};

const Select = ( { items, value, name, onChange, disabled = false, className }: SelectProps ) => {
	return (
		<select name={ name } value={ value } onChange={ onChange } disabled={ disabled } className={ className }>
			{ items.map( ( item, pos ) => (
				<Option value={ item.value } label={ item.label } disabled={ item.disabled || false } key={ pos } />
			) ) }
		</select>
	);
};

export type { SelectOption };
export default Select;
