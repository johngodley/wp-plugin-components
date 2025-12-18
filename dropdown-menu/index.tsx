import { ReactNode } from 'react';
import Dropdown from '../dropdown';
import DotMenuIcon from '../icons/dot-menu';
import './style.scss';

type DropdownMenuProps = {
	menu: ReactNode[];
	disabled?: boolean;
	align?: 'left' | 'right';
};

function DropdownMenu( { menu, align = 'right', disabled = false }: DropdownMenuProps ) {
	return (
		<Dropdown
			align={ align }
			hasArrow
			renderToggle={ ( isOpen, toggle ) => (
				<button
					type="button"
					className="wpl-dropdownmenu"
					onClick={ ( e ) => toggle( e.nativeEvent ) }
					disabled={ disabled }
				>
					<DotMenuIcon isOpen={ isOpen } />
				</button>
			) }
			renderContent={ ( toggle ) => {
				const handleKeyDown = ( e: React.KeyboardEvent ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						toggle();
					}
				};

				return (
					<ul
						className="wpl-dropdownmenu__menu"
						role="menu"
						tabIndex={ -1 }
						onClick={ toggle }
						onKeyDown={ handleKeyDown }
					>
						{ menu.map( ( item, key ) => (
							<li key={ key }>{ item }</li>
						) ) }
					</ul>
				);
			} }
		/>
	);
}

export default DropdownMenu;
