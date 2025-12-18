import { MouseEvent } from 'react';

type MenuItemData = {
	name: string;
	value: string;
};

type MenuItemProps = {
	item: MenuItemData;
	isCurrent: boolean;
	isLast: boolean;
	onClick: ( value: string, url: string ) => void;
	urlBase: string;
};

const MenuItem = ( { item, isCurrent, onClick, isLast, urlBase }: MenuItemProps ) => {
	const url = urlBase + ( item.value === '' ? '' : '&sub=' + item.value );
	const clicker = ( ev: MouseEvent< HTMLAnchorElement > ) => {
		ev.preventDefault();
		onClick( item.value, url );
	};

	return (
		<li>
			<a className={ isCurrent ? 'current' : '' } href={ url } onClick={ clicker }>
				{ item.name }
			</a>{ ' ' }
			{ ! isLast && '|' }&nbsp;
		</li>
	);
};

export type { MenuItemData };
export default MenuItem;
