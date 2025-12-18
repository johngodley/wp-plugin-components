export interface MultiOptionItemType {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface MultiOptionValueType {
	label: string;
	value?: string;
	options?: MultiOptionItemType[];
	optionsType?: string;
	disabled?: boolean;
	badge?: string;
}
