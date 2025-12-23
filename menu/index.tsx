import MenuItem, { MenuItemData } from './menu-item';
import './style.scss';

type MenuProps = {
	menu: MenuItemData[];
	home: string;
	onChangePage: ( value: string, url: string ) => void;
	urlBase: string;
	currentPage: string;
};

const isCurrent = ( page: string, item: MenuItemData, home: string ) =>
	page === item.value || ( page === home && item.value === '' );

const Menu = ( { onChangePage, menu, home, urlBase, currentPage }: MenuProps ) => {
	if ( menu.length < 2 ) {
		return null;
	}

	return (
		<div className="subsubsub-container">
			<ul className="subsubsub">
				{ menu.map( ( item, pos ) => (
					<MenuItem
						key={ pos }
						item={ item }
						isCurrent={ isCurrent( currentPage, item, home ) }
						isLast={ pos === menu.length - 1 }
						onClick={ onChangePage }
						urlBase={ urlBase }
					/>
				) ) }
			</ul>
		</div>
	);
};

export default Menu;
