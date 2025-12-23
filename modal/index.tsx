import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ModalWrapper from './wrapper';
import getPortal from '../../wp-plugin-lib/portal';
import { MODAL_PORTAL } from '../constant';
import './style.scss';

export type ModalProps = {
	padding?: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
};

const Modal = ( props: ModalProps ) =>
	createPortal( <ModalWrapper { ...props } />, getPortal( MODAL_PORTAL ) || document.body );

export default Modal;
