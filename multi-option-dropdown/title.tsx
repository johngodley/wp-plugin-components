/**
 * Internal dependencies
 */

import Badge from '../badge';
import { MultiOptionValueType } from './types';

interface BadgeListProps {
	selected: any;
	onChange: ( newSelected: any ) => void;
	disabled: boolean;
	options: MultiOptionValueType[];
	title: string;
	showBadges: boolean;
}

const MAX_BADGES = 3;

function findOption( options: MultiOptionValueType[], optionValue: string ): MultiOptionValueType | null {
	for ( let index = 0; index < options.length; index++ ) {
		const option = options[ index ];

		if ( option.value === optionValue ) {
			return option;
		}

		if ( option.options ) {
			const subOption = findOption( option.options, optionValue );

			if ( subOption ) {
				return subOption;
			}
		}
	}

	return null;
}

function badgeOption( option: MultiOptionValueType | null, parent: MultiOptionValueType ) {
	if ( ! option ) {
		return null;
	}

	return {
		title: option.badge || option.label,
		default: ( option as any )?.default ?? false,
		onRemove: ( onChange: ( name: string, value: string, isChecked: boolean ) => void ) => {
			if ( option.value === parent.value ) {
				return onChange( option.value || '', option.value || '', false );
			}

			const defaultItem = ( parent.options || [] ).find( ( item: any ) => ( item as any ).default );

			onChange( parent.value || '', parent.value || '', defaultItem ? ( defaultItem as any ).value : '' );
		},
	};
}

function getArrayList( selected: string[], options: MultiOptionValueType[] ) {
	return selected
		.map( ( key: string ) => {
			const parent = findOption( options, key );

			return badgeOption( parent, parent || ( {} as MultiOptionValueType ) );
		} )
		.filter( Boolean );
}

function getObjectList( selected: Record< string, string | boolean >, options: MultiOptionValueType[] ) {
	// Go through selected list and see which one is true or not the default
	return Object.keys( selected )
		.map( ( key ) => {
			const parent = findOption( options, key );

			if ( typeof selected[ key ] === 'string' ) {
				const found = findOption( options, selected[ key ] as string );
				return badgeOption( found, parent || ( {} as MultiOptionValueType ) );
			}

			return selected[ key ] ? badgeOption( parent, parent || ( {} as MultiOptionValueType ) ) : null;
		} )
		.filter( Boolean )
		.filter( ( item ) => ( item as any ) && ( item as any ).default !== true );
}

export default function Title( { selected, title, options, showBadges, onChange, disabled }: BadgeListProps ) {
	const badges = Array.isArray( selected ) ? getArrayList( selected, options ) : getObjectList( selected, options );

	function removeBadge( ev: any, badge: any ) {
		ev.preventDefault();
		ev.stopPropagation();

		// Signal that the option was removed
		badge.onRemove( onChange );
	}

	if ( badges.length > 0 && showBadges ) {
		const displayed = badges.slice( 0, MAX_BADGES ) as any[];
		const badgeNodes = displayed.map( ( badge: any, pos: number ) => {
			if ( ! badge ) {
				return null;
			}

			return (
				<Badge key={ pos } small onCancel={ ( ev ) => removeBadge( ev, badge ) } disabled={ disabled }>
					{ badge.title }
				</Badge>
			);
		} );

		return badges.length > MAX_BADGES ? badgeNodes.concat( [ <span key="end">...</span> ] ) : badgeNodes;
	}

	if ( badges.length === 0 && title.length > 0 ) {
		return <h5>{ title }</h5>;
	}

	return null;
}
