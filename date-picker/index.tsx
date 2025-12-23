import { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { DayPicker } from 'react-day-picker';
import { Portal } from '@headlessui/react';
import 'react-day-picker/dist/style.css';
import './style.scss';

export interface DatePickerProps {
	selected?: Date | null;
	onChange: ( date: Date | null ) => void;
	disabled?: boolean;
	showTimeSelect?: boolean;
	dateFormat?: string;
	selectsStart?: boolean;
	selectsEnd?: boolean;
	startDate?: Date | null;
	endDate?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	withPortal?: boolean;
	placeholderText?: string;
}

/**
 * DatePicker component - replacement for react-datepicker using react-day-picker
 * Maintains similar API for easy migration
 * @param root0
 * @param root0.selected
 * @param root0.onChange
 * @param root0.disabled
 * @param root0.showTimeSelect
 * @param root0.dateFormat
 * @param root0.selectsStart
 * @param root0.selectsEnd
 * @param root0.startDate
 * @param root0.endDate
 * @param root0.minDate
 * @param root0.maxDate
 * @param root0.withPortal
 * @param root0.placeholderText
 */
export default function DatePicker( {
	selected,
	onChange,
	disabled = false,
	showTimeSelect = false,
	dateFormat,
	selectsStart,
	selectsEnd,
	startDate,
	endDate,
	minDate,
	maxDate,
	withPortal = false,
	placeholderText,
}: DatePickerProps ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ timeValue, setTimeValue ] = useState( { hours: 0, minutes: 0 } );
	const containerRef = useRef< HTMLDivElement >( null );
	const inputRef = useRef< HTMLInputElement >( null );

	// Initialize time from selected date
	useEffect( () => {
		if ( selected && showTimeSelect ) {
			setTimeValue( {
				hours: selected.getHours(),
				minutes: selected.getMinutes(),
			} );
		}
	}, [ selected, showTimeSelect ] );

	// Format date for display
	const formatDate = ( date: Date | null ): string => {
		if ( ! date ) {
			return placeholderText || '';
		}

		if ( dateFormat ) {
			// Simple date format parsing for common formats
			const monthNames = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			] as const;

			const monthIndex = date.getMonth();
			const monthName = monthNames[ monthIndex ];
			const monthShort = monthName ? monthName.substring( 0, 3 ) : '';

			let formatted = dateFormat;
			formatted = formatted.replace( /MMMM/g, monthName || '' );
			formatted = formatted.replace( /MMM/g, monthShort );
			formatted = formatted.replace( /MM/g, String( date.getMonth() + 1 ).padStart( 2, '0' ) );
			formatted = formatted.replace( /M/g, String( date.getMonth() + 1 ) );
			const weekdayLong = date.toLocaleDateString( 'en-US', { weekday: 'long' } );
			const weekdayShort = date.toLocaleDateString( 'en-US', { weekday: 'short' } );
			formatted = formatted.replace( /dddd/g, weekdayLong );
			formatted = formatted.replace( /ddd/g, weekdayShort );
			formatted = formatted.replace( /dd/g, String( date.getDate() ).padStart( 2, '0' ) );
			formatted = formatted.replace( /d/g, String( date.getDate() ) );
			formatted = formatted.replace( /yyyy/g, String( date.getFullYear() ) );
			formatted = formatted.replace( /yy/g, String( date.getFullYear() ).slice( -2 ) );
			formatted = formatted.replace( /hh/g, String( date.getHours() ).padStart( 2, '0' ) );
			formatted = formatted.replace( /h/g, String( date.getHours() ) );
			formatted = formatted.replace( /mm/g, String( date.getMinutes() ).padStart( 2, '0' ) );
			formatted = formatted.replace( /m/g, String( date.getMinutes() ) );
			formatted = formatted.replace( /ss/g, String( date.getSeconds() ).padStart( 2, '0' ) );
			formatted = formatted.replace( /s/g, String( date.getSeconds() ) );

			return formatted;
		}

		// Default format
		return date.toLocaleDateString() + ( showTimeSelect ? ' ' + date.toLocaleTimeString() : '' );
	};

	const handleDateSelect = ( date: Date | undefined ) => {
		if ( ! date ) {
			onChange( null );
			return;
		}

		// Combine date with time if time selection is enabled
		if ( showTimeSelect ) {
			const combinedDate = new Date( date );
			combinedDate.setHours( timeValue.hours );
			combinedDate.setMinutes( timeValue.minutes );
			combinedDate.setSeconds( 0 );
			combinedDate.setMilliseconds( 0 );
			onChange( combinedDate );
		} else {
			onChange( date );
		}
	};

	const handleTimeChange = ( field: 'hours' | 'minutes', value: number ) => {
		const newTime = { ...timeValue, [ field ]: value };
		setTimeValue( newTime );

		if ( selected ) {
			const updatedDate = new Date( selected );
			updatedDate.setHours( newTime.hours );
			updatedDate.setMinutes( newTime.minutes );
			updatedDate.setSeconds( 0 );
			updatedDate.setMilliseconds( 0 );
			onChange( updatedDate );
		}
	};

	// For selectsStart/selectsEnd, we use single mode but show range context
	// react-day-picker range mode is for selecting both dates in one picker
	// Here we have separate pickers for start/end, so use single mode

	// Build date constraints based on range context
	const dateConstraints: { fromDate?: Date; toDate?: Date } = {};
	if ( minDate ) {
		dateConstraints.fromDate = minDate;
	}
	if ( maxDate ) {
		dateConstraints.toDate = maxDate;
	}

	// For selectsEnd, ensure startDate is minimum
	if ( selectsEnd && startDate ) {
		dateConstraints.fromDate = startDate;
	}
	// For selectsStart, ensure endDate is maximum
	if ( selectsStart && endDate ) {
		dateConstraints.toDate = endDate;
	}

	const dayPicker = (
		<DayPicker
			mode="single"
			selected={ selected || undefined }
			onSelect={ handleDateSelect }
			disabled={ disabled }
			{ ...dateConstraints }
		/>
	);

	const timePicker = showTimeSelect ? (
		<div className="wpl-datepicker-time">
			<label htmlFor="wpl-datepicker-time-input">
				{ __( 'Time', 'search-regex' ) }
				<input
					id="wpl-datepicker-time-input"
					type="time"
					value={ `${ String( timeValue.hours ).padStart( 2, '0' ) }:${ String( timeValue.minutes ).padStart(
						2,
						'0'
					) }` }
					onChange={ ( e ) => {
						const [ hours, minutes ] = e.target.value.split( ':' ).map( Number );
						handleTimeChange( 'hours', hours || 0 );
						handleTimeChange( 'minutes', minutes || 0 );
					} }
					disabled={ disabled }
				/>
			</label>
		</div>
	) : null;

	// Close on outside click
	useEffect( () => {
		function handleClickOutside( event: MouseEvent ) {
			if ( containerRef.current && ! containerRef.current.contains( event.target as Node ) ) {
				setIsOpen( false );
			}
		}

		if ( isOpen ) {
			document.addEventListener( 'mousedown', handleClickOutside );
			return () => {
				document.removeEventListener( 'mousedown', handleClickOutside );
			};
		}

		return undefined;
	}, [ isOpen ] );

	const pickerContent = (
		<div className="wpl-datepicker-popup" ref={ containerRef }>
			{ dayPicker }
			{ timePicker }
		</div>
	);

	return (
		<div className="wpl-datepicker-wrapper">
			<input
				ref={ inputRef }
				type="text"
				value={ formatDate( selected ?? null ) }
				onClick={ () => ! disabled && setIsOpen( ! isOpen ) }
				onFocus={ () => ! disabled && setIsOpen( true ) }
				readOnly
				disabled={ disabled }
				placeholder={ placeholderText }
				className="wpl-datepicker-input"
			/>
			{ isOpen && ( withPortal ? <Portal>{ pickerContent }</Portal> : pickerContent ) }
		</div>
	);
}
