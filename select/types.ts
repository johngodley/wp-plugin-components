export type SelectOption = {
	label: string;
	value: string | SelectOption[];
	disabled?: boolean;
};
