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

		if ( option.value === optionValue || optionValue === parseInt( option.value, 10 ) ) {
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

function badgeOption( option, parent ) {
	if ( ! option ) {
		return null;
	}

	return {
		title: option.badge || option.label,
		default: option?.default ?? false,
		onRemove: ( onChange ) => {
			if ( option.value === parent.value ) {
				return onChange( option.value, option.value, false );
			}

			const defaultItem = parent.options.find( ( item ) => item.default );

			onChange( parent.value, parent.value, defaultItem ? defaultItem.value : '' );
		},
	};
}

function getArrayList( selected, options ) {
	return selected
		.map( ( key: string ) => {
			const parent = findOption( options, key );

			return badgeOption( parent, parent );
		} )
		.filter( Boolean );
}

function getObjectList( selected, options ) {
	// Go through selected list and see which one is true or not the default
	return Object.keys( selected )
		.map( ( key ) => {
			const parent = findOption( options, key );

			if ( typeof selected[ key ] === 'string' ) {
				return badgeOption( findOption( options, selected[ key ] ), parent );
			}

			return selected[ key ] ? badgeOption( parent, parent ) : null;
		} )
		.filter( Boolean )
		.filter( ( item ) => ! item.default );
}

export default function Title( { selected, title, options, showBadges, onChange, disabled }: BadgeListProps ) {
	const badges = Array.isArray( selected ) ? getArrayList( selected, options ) : getObjectList( selected, options );

	function removeBadge( ev, badge ) {
		ev.preventDefault();
		ev.stopPropagation();

		// Signal that the option was removed
		badge.onRemove( onChange );
	}

	if ( badges.length > 0 && showBadges ) {
		return badges
			.slice( 0, MAX_BADGES )
			.map( ( badge, pos: number ) => {
				return (
					<Badge key={ pos } small onCancel={ ( ev ) => removeBadge( ev, badge ) } disabled={ disabled }>
						{ badge.title }
					</Badge>
				);
			} )
			.concat( [ badges.length > MAX_BADGES ? <span key="end">...</span> : null ] );
	}

	if ( badges.length === 0 && title.length > 0 ) {
		return <h5>{ title }</h5>;
	}

	return null;
}
