import { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import DisplayNonceError from './display/error-nonce';
import DisplayDefaultError from './display/error-default';
import DisplayKnownError from './display/error-known';
import DisplayFixedError from './display/error-fixed';
import DisplayApiError from './display/error-api';
import './style.scss';
import type { ErrorLike, MaybeError } from './types';

type ErrorComponentProps = {
	mini?: boolean;
	locale: string;
	errors: MaybeError[] | MaybeError;
	details?: string[];
	onClear?: () => void;
	children?: React.ReactNode;
	title?: string | React.ReactNode;
	type?: 'error' | 'fixed' | '';
	renderDebug?: ( debug: string ) => React.ReactNode;
	links?: any;
	context?: string | null;
	versions?: any;
};

function ErrorPaging( {
	current,
	change,
	total,
}: {
	current: number;
	change: ( index: number ) => void;
	total: number;
} ) {
	const handlePrevious = () => change( current - 1 );
	const handleNext = () => change( current + 1 );
	const handlePreviousKeyDown = ( e: React.KeyboardEvent ) => {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			change( current - 1 );
		}
	};
	const handleNextKeyDown = ( e: React.KeyboardEvent ) => {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			change( current + 1 );
		}
	};

	return (
		<div className="wpl-error__page">
			{ current > 0 && (
				<span onClick={ handlePrevious } onKeyDown={ handlePreviousKeyDown } role="button" tabIndex={ 0 }>
					←
				</span>
			) }

			{ `${ current + 1 }/${ total }` }

			{ current + 1 < total && (
				<span onClick={ handleNext } onKeyDown={ handleNextKeyDown } role="button" tabIndex={ 0 }>
					→
				</span>
			) }
		</div>
	);
}

function getErrorType( error: MaybeError, type?: string ) {
	const current = error as any;
	if ( current?.code === 'rest_cookie_invalid_nonce' ) {
		return DisplayNonceError;
	}

	if ( current?.jsonData?.status === 400 ) {
		return DisplayApiError;
	}

	if ( type === 'error' ) {
		return DisplayKnownError;
	}

	if ( type === 'fixed' ) {
		return DisplayFixedError;
	}

	return DisplayDefaultError;
}

function Error( props: ErrorComponentProps ) {
	const { onClear, mini = false, type = '' } = props;
	const errors = useMemo( () => {
		const list = Array.isArray( props.errors ) ? props.errors : [ props.errors ];

		// Note an error can be an empty string, which is displayed as a generic error
		return list.filter( ( error ): error is ErrorLike => error !== undefined && error !== null );
	}, [ props.errors ] );
	const [ currentError, setCurrentError ] = useState( 0 );

	useEffect( () => {
		// A new set of errors always starts at the first one
		setCurrentError( 0 );

		if ( ! mini && errors.length > 0 ) {
			window.scrollTo( 0, 0 );
		}
	}, [ errors, mini ] );

	const handleClear = ( e: React.MouseEvent | React.KeyboardEvent ) => {
		if (
			e.type === 'click' ||
			( e.type === 'keydown' &&
				( ( e as React.KeyboardEvent ).key === 'Enter' || ( e as React.KeyboardEvent ).key === ' ' ) )
		) {
			if ( e.type === 'keydown' ) {
				e.preventDefault();
			}
			if ( onClear ) {
				onClear();
			}
		}
	};

	if ( errors.length === 0 ) {
		return null;
	}

	// The error list can shrink between renders, and the effect that resets this runs after the render
	const currentIndex = Math.min( currentError, errors.length - 1 );
	const ErrorComponent = getErrorType( errors[ currentIndex ], type );
	return (
		<div className={ clsx( 'wpl-error', { 'wpl-error__mini': mini } ) }>
			{ onClear && (
				<div className="closer" onClick={ handleClear } onKeyDown={ handleClear } role="button" tabIndex={ 0 }>
					<span className="dashicons dashicons-no-alt" />
				</div>
			) }

			{ errors.length > 1 && (
				<ErrorPaging current={ currentIndex } change={ setCurrentError } total={ errors.length } />
			) }

			<ErrorComponent error={ errors[ currentIndex ] } { ...( props as any ) } />
		</div>
	);
}

export default Error;
