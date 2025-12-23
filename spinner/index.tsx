import clsx from 'clsx';
import './style.scss';

type SpinnerProps = {
	size?: 'small' | '';
};

const Spinner = ( { size = '' }: SpinnerProps ) => {
	const classes = clsx( 'wpl-spinner__container', size && ' spinner-' + size );

	return (
		<div className={ classes }>
			<span className="wpl-spinner__item" />
		</div>
	);
};

export default Spinner;
