import { useState } from 'react';
import type React from 'react';
import Dropzone, { DropzoneState } from 'react-dropzone';
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
	const [ hover, setHover ] = useState( false );
	const [ file, setFile ] = useState< File | null >( null );

	function onDrop( accepted: File[] ) {
		setHover( false );
		setFile( accepted[ 0 ] );
	}

	return (
		<Dropzone
			multiple={ false }
			onDrop={ onDrop }
			onDragLeave={ () => setHover( false ) }
			onDragEnter={ () => setHover( true ) }
		>
			{ ( upload: DropzoneState ) => (
				<UploaderContent
					dropzone={ upload }
					hover={ hover }
					file={ file }
					clearFile={ () => setFile( null ) }
					{ ...props }
				/>
			) }
		</Dropzone>
	);
}

export default Uploader;
