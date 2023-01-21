/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * External dependencies
 */

import './style.scss';

/**
 * @callback Click
 * @param {object} ev
 */

/**
 * Button component
 *
 * @param {object} props - Component props
 * @param {boolean} [props.isPrimary=false] - Primary button
 * @param {boolean} [props.isSecondary=true] - Secondary button
 * @param {boolean} [props.isSubmit=false] - Submit button
 * @param {boolean} [props.isDestructive=false]
 * @param {string} [props.className] - Class name
 * @param {string} [props.name] - Button `name`
 * @param {boolean} [props.disabled=false]
 * @param {Click} [props.onClick] - Click callback
 * @param {string|object} props.children - Button contents
 */
function Button( props ) {
	const {
		isPrimary = false,
		isSecondary = true,
		isSubmit = false,
		isSaving = false,
		className,
		children,
		disabled = false,
		isDestructive = false,
		...extra
	} = props;
	const classes = classnames( 'button', className, {
		'button-primary': isPrimary,
		'button-secondary': isSecondary,
		'button-delete': isDestructive,
		'wpl-spinner': isSaving,
	} );

	return (
		<button className={ classes } disabled={ disabled } type={ isSubmit ? 'submit' : 'button' } { ...extra }>
			{ isSaving && <svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={ 1.5 }
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg> }
			{ children }
		</button>
	);
}

export default Button;
