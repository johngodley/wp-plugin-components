export default function extractPhpError( raw: string ) {
	const last = raw.lastIndexOf( '}' );

	if ( last !== raw.length ) {
		return raw.substring( last + 1 ).trim();
	}

	const parts = raw.split( '<br />' ).filter( ( item ) => item );
	return parts
		.slice( 0, parts.length - 1 )
		.join( ' ' )
		.trim();
}
