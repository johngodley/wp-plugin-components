import { useCallback, useRef, useState } from 'react';

export interface DropzoneState {
	getRootProps: ( props?: {
		onClick?: ( event: React.MouseEvent ) => void;
		onKeyDown?: ( event: React.KeyboardEvent ) => void;
	} ) => {
		onDragEnter: ( event: React.DragEvent ) => void;
		onDragOver: ( event: React.DragEvent ) => void;
		onDragLeave: ( event: React.DragEvent ) => void;
		onDrop: ( event: React.DragEvent ) => void;
		onClick?: ( event: React.MouseEvent ) => void;
		onKeyDown?: ( event: React.KeyboardEvent ) => void;
	};
	getInputProps: () => {
		type: string;
		style: { display: string };
		onChange: ( event: React.ChangeEvent< HTMLInputElement > ) => void;
		ref: React.RefObject< HTMLInputElement | null >;
		multiple?: boolean;
	};
	open: () => void;
	isDragActive: boolean;
}

interface UseDropzoneOptions {
	onDrop: ( files: File[] ) => void;
	multiple?: boolean;
	onDragEnter?: () => void;
	onDragLeave?: () => void;
}

/**
 * Native HTML5 drag and drop hook - replacement for react-dropzone
 * Provides the same API for easy migration
 * @param options
 */
export function useDropzone( options: UseDropzoneOptions ): DropzoneState {
	const { onDrop, multiple = false, onDragEnter, onDragLeave } = options;
	const [ isDragActive, setIsDragActive ] = useState( false );
	const inputRef = useRef< HTMLInputElement >( null );
	const dragCounterRef = useRef( 0 );

	const handleDragEnter = useCallback(
		( event: React.DragEvent ) => {
			event.preventDefault();
			event.stopPropagation();
			dragCounterRef.current += 1;

			if ( event.dataTransfer.types.includes( 'Files' ) ) {
				setIsDragActive( true );
				onDragEnter?.();
			}
		},
		[ onDragEnter ]
	);

	const handleDragOver = useCallback( ( event: React.DragEvent ) => {
		event.preventDefault();
		event.stopPropagation();
	}, [] );

	const handleDragLeave = useCallback(
		( event: React.DragEvent ) => {
			event.preventDefault();
			event.stopPropagation();
			dragCounterRef.current -= 1;

			if ( dragCounterRef.current === 0 ) {
				setIsDragActive( false );
				onDragLeave?.();
			}
		},
		[ onDragLeave ]
	);

	const handleDrop = useCallback(
		( event: React.DragEvent ) => {
			event.preventDefault();
			event.stopPropagation();
			dragCounterRef.current = 0;
			setIsDragActive( false );

			const files = Array.from( event.dataTransfer.files );
			if ( files.length > 0 ) {
				const fileArray = multiple ? files : [ files[ 0 ] ];
				onDrop( fileArray.filter( ( f ): f is File => f !== undefined ) );
			}
		},
		[ onDrop, multiple ]
	);

	const handleFileInputChange = useCallback(
		( event: React.ChangeEvent< HTMLInputElement > ) => {
			const files = Array.from( event.target.files || [] );
			if ( files.length > 0 ) {
				const fileArray = multiple ? files : [ files[ 0 ] ];
				onDrop( fileArray.filter( ( f ): f is File => f !== undefined ) );
			}
			// Reset input so same file can be selected again
			if ( inputRef.current ) {
				inputRef.current.value = '';
			}
		},
		[ onDrop, multiple ]
	);

	const open = useCallback( () => {
		inputRef.current?.click();
	}, [] );

	const getRootProps = useCallback(
		( props?: {
			onClick?: ( event: React.MouseEvent ) => void;
			onKeyDown?: ( event: React.KeyboardEvent ) => void;
		} ) => {
			return {
				onDragEnter: handleDragEnter,
				onDragOver: handleDragOver,
				onDragLeave: handleDragLeave,
				onDrop: handleDrop,
				...( props?.onClick && { onClick: props.onClick } ),
				...( props?.onKeyDown && { onKeyDown: props.onKeyDown } ),
			};
		},
		[ handleDragEnter, handleDragOver, handleDragLeave, handleDrop ]
	);

	const getInputProps = useCallback( () => {
		return {
			type: 'file' as const,
			style: { display: 'none' },
			onChange: handleFileInputChange,
			ref: inputRef,
			...( ! multiple && { multiple: false } ),
		};
	}, [ handleFileInputChange, multiple ] );

	return {
		getRootProps,
		getInputProps,
		open,
		isDragActive,
	};
}
