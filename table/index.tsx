import type { ReactNode } from 'react';
import clsx from 'clsx';
import './style.scss';

type TableProps = {
	className?: string;
	children: ReactNode;
};

const Table = ( { className, children }: TableProps ) => {
	return (
		<table className={ clsx( 'wpl-table', className ) }>
			<tbody>{ children }</tbody>
		</table>
	);
};

export default Table;
