import { createInterpolateElement as coreInterpolate } from '@wordpress/element';

/**
 * A back-compat wrapper over the WordPress createInterpolateElement function that supports {{code}} instead of <code>
 * @param {string} text       Text.
 * @param {Object} components Components
 * @return React.ReactElement|React.ReactNode|WPElement
 */
export default function createInterpolateElement(
	text: string,
	components: Record< string, React.ReactElement >
): React.ReactElement< any, string | React.JSXElementConstructor< any > > | string {
	try {
		return coreInterpolate( text.replace( /\{\{/g, '<' ).replace( /\}\}/g, '>' ), components );
	} catch ( e ) {
		return text;
	}
}
