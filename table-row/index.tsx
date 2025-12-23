import type { ReactNode } from 'react';

type TableRowProps = {
	title: ReactNode;
	url?: string | false;
	children: ReactNode;
};

const TableRow = ( props: TableRowProps ) => {
	const { title, url = false, children } = props;

	return (
		<tr>
			<th>
				{ ! url && title }
				{ url && (
					<a href={ url } target="_blank" rel="noreferrer">
						{ title }
					</a>
				) }
			</th>
			<td>{ children }</td>
		</tr>
	);
};

export default TableRow;
