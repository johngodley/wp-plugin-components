import { ReactNode } from 'react';

type ExternalLinkProps = {
	url: string;
	className?: string;
	title?: string;
	children?: ReactNode;
};

const ExternalLink = ( { url, children, title, className }: ExternalLinkProps ) => {
	return (
		<a href={ url } target="_blank" rel="noopener noreferrer" title={ title } className={ className }>
			{ children }
		</a>
	);
};

export default ExternalLink;
