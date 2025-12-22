import type { ReactNode } from 'react';
import clsx from 'clsx';
import './style.scss';

type NoticeLevel = 'warning' | 'notice' | 'error' | 'general';

type NoticeProps = {
	level?: NoticeLevel;
	className?: string;
	children: ReactNode;
};

function Notice( { level = 'notice', children, className }: NoticeProps ) {
	return <div className={ clsx( `inline-notice inline-${ level }`, className ) }>{ children }</div>;
}

export default Notice;
