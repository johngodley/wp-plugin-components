import type React from 'react';
import classnames from 'classnames';
import type { DropzoneState } from 'react-dropzone';

type UploaderContentProps = {
	hover: boolean;
	dropzone: DropzoneState;
	renderUnselected: ( open: () => void ) => React.ReactNode;
	file: File | null;
	clearFile: () => void;
	onUpload: ( file: File ) => void;
	isUploading?: boolean;
	isUploaded?: boolean;
	renderSelected: ( file: File ) => React.ReactNode;
	renderUploaded: ( clearFile: () => void ) => React.ReactNode;
	renderUploading: ( file: File ) => React.ReactNode;
	disabled?: boolean;
	addFileText: string;
	uploadText: string;
	cancelText: string;
};

function UploaderContent( props: UploaderContentProps ) {
	const {
		hover,
		dropzone,
		renderUnselected,
		file,
		clearFile,
		onUpload,
		isUploading,
		isUploaded,
		renderSelected,
		renderUploaded,
		renderUploading,
		disabled,
		addFileText,
		uploadText,
		cancelText,
	} = props;
	const { getRootProps, getInputProps, open } = dropzone;
	const className = classnames( 'wpl-dropzone', { 'wpl-dropzone__hover': hover } );
	const rootProps = getRootProps( {
		onClick: ( event ) => event.stopPropagation(),
		onKeyDown: ( event ) => {
			if ( event.keyCode === 32 || event.keyCode === 13 ) {
				event.stopPropagation();
			}
		},
	} );

	return (
		<div { ...rootProps } className={ className }>
			<input { ...getInputProps() } />

			{ ( file === null || ( disabled && ! isUploading ) ) && (
				<>
					{ renderUnselected( open ) }

					<button type="button" className="button-secondary" onClick={ open } disabled={ disabled }>
						{ addFileText }
					</button>
				</>
			) }

			{ file !== null && ! isUploading && ! isUploaded && (
				<>
					{ renderSelected( file ) }
					<button className="button-primary" onClick={ () => onUpload( file ) }>
						{ uploadText }
					</button>{ ' ' }
					<button className="button-secondary" onClick={ clearFile }>
						{ cancelText }
					</button>
				</>
			) }

			{ file !== null && isUploading && renderUploading( file ) }

			{ file !== null && isUploaded && renderUploaded( clearFile ) }
		</div>
	);
}

export default UploaderContent;
