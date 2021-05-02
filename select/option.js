/**
 * External dependencies
 */

import React from 'react';

/**
* @typedef SelectOption
* @type {object}
* @property {string} label - a descriptive label.
* @property {string|SelectOption[]} value - value for the option, or an array of SelectOption
* @property {boolean} [disabled=false] - is the option disabled
*/

/**
 * Select option value.
 *
 * @param {Object} props - Component props
 * @param {SelectOption[]|String} props.value - Either another value/label array for a select with subgroup, or a value.
 * @param {String|i18nCalypso.TranslateResult} props.label - Value label
 * @param {boolean} [props.disabled=false] - Is the option disabled?
 */
const Option = ( props ) => {
	const { value, label, disabled = false } = props;

	if ( typeof value === 'object' ) {
		return (
			<optgroup label={ label } disabled={ disabled }>
				{ value.map( ( item, pos ) => <Option label={ item.label } value={ item.value } disabled={ item.disabled || false } key={ pos } /> ) }
			</optgroup>
		);
	}

	return (
		<option value={ value } disabled={ disabled }>{ label }</option>
	);
};

export default Option;
