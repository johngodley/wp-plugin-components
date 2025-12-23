import { useState } from 'react';
import type React from 'react';
import { useDropzone } from './use-dropzone';
import UploaderContent from './content';
import './style.scss';

export type UploaderProps = {
	renderUnselected: ( open: () => void ) => React.ReactNode;
	renderSelected: ( file: File ) => React.ReactNode;
	renderUploaded: ( clearFile: () => void ) => React.ReactNode;
	renderUploading: ( file: File ) => React.ReactNode;
	onUpload: ( file: File ) => void;
	isUploading?: boolean;
	isUploaded?: boolean;
	disabled?: boolean;
	addFileText: string;
	uploadText: string;
	cancelText: string;
};

function Uploader( props: UploaderProps ) {
	const [ file, setFile ] = useState< File | null >( null );

	function onDrop( accepted: File[] ) {
		const firstFile = accepted[ 0 ];
		if ( firstFile ) {
			setFile( firstFile );
		}
	}

	// ✨ Native HTML5 drag and drop - no external library needed!
	const dropzone = useDropzone( {
		multiple: false,
		onDrop,
		onDragEnter: () => {
			// Drag enter handled by hook
		},
		onDragLeave: () => {
			// Drag leave handled by hook
		},
	} );

	return (
		<UploaderContent
			dropzone={ dropzone }
			hover={ dropzone.isDragActive }
			file={ file }
			clearFile={ () => setFile( null ) }
			{ ...props }
		/>
	);
}

export default Uploader;
