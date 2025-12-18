import classnames from 'classnames';

type PopoverArrowProps = {
	style: React.CSSProperties;
	align: 'left' | 'right' | 'centre';
};

export default function PopoverArrows( { style, align }: PopoverArrowProps ) {
	const classes = classnames( 'wpl-popover__arrows', {
		'wpl-popover__arrows__left': align === 'left',
		'wpl-popover__arrows__right': align === 'right',
		'wpl-popover__arrows__centre': align === 'centre',
	} );

	return <div className={ classes } style={ style } />;
}
