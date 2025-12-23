import { MouseEvent, KeyboardEvent } from 'react';
import Highlighter from 'react-highlight-words';
import type { SelectOption } from './types';

type DropdownSuggestionsProps = {
	options: SelectOption[];
	value: string;
	onSelect: ( option: SelectOption ) => void;
	onClose: () => void;
};

function DropdownSuggestions( { options, value, onSelect, onClose }: DropdownSuggestionsProps ) {
	function onClick( ev: MouseEvent< HTMLButtonElement >, item: SelectOption ) {
		ev.preventDefault();
		onSelect( item );
		onClose();
	}

	function onKeyDown( ev: KeyboardEvent< HTMLButtonElement >, item: SelectOption ) {
		if ( ev.key === 'Enter' || ev.key === ' ' ) {
			ev.preventDefault();
			onSelect( item );
			onClose();
		}
	}

	return (
		<ul>
			{ options.map( ( item, pos ) => (
				<li key={ pos }>
					<button
						type="button"
						onClick={ ( ev ) => onClick( ev, item ) }
						onKeyDown={ ( ev ) => onKeyDown( ev, item ) }
					>
						<Highlighter searchWords={ [ value ] } textToHighlight={ item.title } autoEscape />
					</button>
				</li>
			) ) }
		</ul>
	);
}

export default DropdownSuggestions;
