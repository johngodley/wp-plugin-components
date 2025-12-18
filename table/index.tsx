import type { ReactNode } from 'react';
import classnames from 'classnames';
import './style.scss';

type TableProps = {
	className?: string;
	children: ReactNode;
};

const Table = ( { className, children }: TableProps ) => {
	return (
		<table className={ classnames( 'wpl-table', className ) }>
			<tbody>{ children }</tbody>
		</table>
	);
};

export default Table;
