import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import LoadingDots from '../loading-dots';
import Popover, { getPopoverPosition } from '../popover';
import DropdownSuggestions from './suggestions';
import Badge from '../badge';
import { SelectOption } from './types';
import './style.scss';

const DEBOUNCE_DELAY = 450;

type DropdownTextProps = {
	fetchData?: ( value: string ) => Promise< SelectOption[] | unknown >;
	canMakeRequest?: ( value: string ) => boolean;
	onChange: ( value: any, label?: any ) => void;
	placeholder?: string;
	value: string | string[];
	name?: string;
	disabled?: boolean;
	loadOnFocus?: boolean;
	maxLength?: number;
	maxChoices?: number;
	onlyChoices?: boolean;
	onBlur?: ( value: string ) => string | number | void;
	className?: string;
	getLabel?: ( valueId: string, values: string | string[] ) => string;
	setLabel?: ( value: string, label: string | null ) => void;
};

function DropdownText( props: DropdownTextProps ) {
	const {
		placeholder = '',
		onChange,
		value,
		fetchData,
		name = 'text',
		disabled = false,
		className,
		maxChoices = -1,
		maxLength = 0,
		canMakeRequest = ( inputValue ) => inputValue.length > 0,
		onBlur,
		getLabel,
		setLabel = () => undefined,
		loadOnFocus = false,
		onlyChoices = false,
	} = props;
	const [ makingRequest, setMakingRequest ] = useState( false );
	const [ options, setOptions ] = useState< SelectOption[] >( [] );
	const [ input, setInput ] = useState( Array.isArray( value ) ? '' : value );
	const inputRef = useRef< HTMLInputElement | null >( null );
	const hideInput = maxChoices > 0 && Array.isArray( value ) && value.length >= maxChoices;
	const classes = {
		'wpl-dropdowntext__suggestion__hide': hideInput,
		'wpl-dropdowntext__suggestion': maxChoices > 1,
	};
	const debounced = useDebouncedCallback< ( value: string ) => void >( getData, DEBOUNCE_DELAY );

	useEffect( () => {
		if ( value !== input ) {
			setInput( Array.isArray( value ) ? '' : value );
		}
	}, [ value, input ] );

	function getData( currentValue: string ) {
		if ( ! fetchData ) {
			return;
		}

		setMakingRequest( true );

		// Ignore errors
		fetchData( currentValue )
			.then( ( results ) => {
				if ( inputRef.current && inputRef.current.ownerDocument.activeElement === inputRef.current ) {
					setOptions( results as SelectOption[] );
				}

				setMakingRequest( false );
			} )
			.catch( () => {
				setOptions( [] );
				setMakingRequest( false );
			} );
	}

	function changeValue( ev: ChangeEvent< HTMLInputElement > ) {
		setInput( ev.target.value );
		if ( maxChoices < 1 ) {
			onChange( ev.target.value );
		}

		if ( fetchData && debounced ) {
			if ( canMakeRequest( ev.target.value.trim() ) ) {
				debounced( ev.target.value );
			} else {
				setOptions( [] );
			}
		}
	}

	function preload() {
		const hasValue = Array.isArray( value ) ? value.length > 0 : value.length > 0;
		if ( loadOnFocus && ! hasValue ) {
			getData( '' );
		}
	}

	function blur( ev: FocusEvent< HTMLInputElement > ) {
		if ( ev.relatedTarget && ev.relatedTarget.closest( '.wpl-dropdowntext__suggestions' ) ) {
			return;
		}

		const blurValueRaw = onBlur ? onBlur( input ) : input;
		const blurValue = `${ blurValueRaw ?? '' }`;
		if ( options.length === 0 ) {
			if ( onlyChoices ) {
				// Reset input if it doesn't match a chosen value
				setInput( '' );
			} else if ( maxChoices > 0 && fetchData ) {
				// Choices + custom value
				onSelect( { value: blurValue, label: blurValue, title: blurValue } );
			} else {
				// Save the input
				onChange( blurValue );
			}
		} else if ( blurValue !== input ) {
			setInput( blurValue );
		}

		setMakingRequest( false );
	}

	function onKeyDown( ev: KeyboardEvent< HTMLInputElement > ) {
		if ( ev.code === 'Enter' ) {
			setMakingRequest( false );
			setOptions( [] );
		}
	}

	function getLabelsForValues( values: string | string[] ) {
		if ( getLabel ) {
			return valueToArray( values ).map( ( valueId ) => getLabel( valueId, values ) );
		}

		return undefined;
	}

	function onSelect( selectedItem: SelectOption ) {
		if ( maxChoices > 0 ) {
			if ( ! valueToArray( value ).find( ( item ) => item === `${ selectedItem.value }` ) ) {
				// Ensure we don't exceed the number of choices
				const newValues = [ `${ selectedItem.value }` ]
					.concat( valueToArray( value ).filter( ( item ) => item !== `${ selectedItem.value }` ) )
					.slice( 0, maxChoices );

				// Save the values
				onChange(
					maxChoices === 1 && ! onlyChoices ? newValues[ 0 ] : newValues,
					[ selectedItem.title ].concat( getLabelsForValues( newValues )?.slice( 1 ) || [] )
				);

				// Ensure we remember the text label for this choice and show that instead of the value
				setLabel( selectedItem.value, selectedItem.title );
			}

			setInput( '' );
		} else {
			// No choices, just set the input box
			setInput( selectedItem.value );
			onChange( selectedItem.value, getLabelsForValues( value ) );
		}

		// Clear choices
		setOptions( [] );
	}

	function clearSuggestion( removeValue: string ) {
		const newValues = valueToArray( value ).filter( ( item ) => item !== removeValue );

		// Remove the value from the chosen values and the current values
		setLabel( removeValue, null );

		if ( Array.isArray( value ) ) {
			onChange( maxChoices === 1 ? newValues[ 0 ] : newValues, getLabelsForValues( newValues ) );
		} else {
			onChange( '' );
		}

		// Focus back into the field
		inputRef.current?.focus();
	}

	function valueToArray( val: string | string[] ) {
		if ( Array.isArray( val ) ) {
			return val;
		}

		if ( val ) {
			return [ val ];
		}

		return [];
	}

	return (
		<div className={ clsx( 'wpl-dropdowntext', className, classes ) }>
			{ maxChoices > 0 &&
				valueToArray( value ).map( ( valueId ) => (
					<Badge
						key={ valueId }
						title={ valueId }
						onCancel={ () => clearSuggestion( valueId ) }
						disabled={ disabled }
					>
						{ getLabel ? getLabel( valueId, value ) : valueId }
					</Badge>
				) ) }

			<input
				type="text"
				className={ clsx( 'regular-text', {
					'wpl-dropdowntext__max': maxChoices >= 0 && valueToArray( value ).length >= maxChoices,
				} ) }
				name={ name }
				value={ input }
				disabled={ disabled }
				onChange={ changeValue }
				maxLength={ maxLength > 0 ? maxLength : undefined }
				placeholder={ placeholder }
				ref={ inputRef }
				onFocus={ preload }
				onBlur={ blur }
				onKeyDown={ onKeyDown }
			/>

			{ makingRequest && (
				<div className="wpl-dropdowntext__loading">
					<LoadingDots />
				</div>
			) }

			{ options.length > 0 && inputRef.current && (
				<Popover
					align="left"
					onClose={ () => setOptions( [] ) }
					popoverPosition={ getPopoverPosition( inputRef.current ) }
					className="wpl-dropdowntext__suggestions"
					focusLock={ false }
				>
					<DropdownSuggestions
						options={ options }
						value={ input }
						onSelect={ onSelect }
						onClose={ () => setOptions( [] ) }
					/>
				</Popover>
			) }
		</div>
	);
}

export default DropdownText;
