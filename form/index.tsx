import { FormEvent, ReactNode } from 'react';

type FormProps = {
	className?: string;
	children: ReactNode;
	onSubmit: () => void;
};

const Form = ( { className, children, onSubmit }: FormProps ) => {
	function save( ev: FormEvent< HTMLFormElement > ) {
		ev.preventDefault();
		onSubmit();
	}

	return (
		<form className={ className } onSubmit={ save }>
			{ children }
		</form>
	);
};

export default Form;
