import _Popup from './popup';
import withInstall from '../utils/withInstall';
import { TdPopupProps } from '../../types/popup/TdPopupProps';

export * from '../../types/popup/TdPopupProps';
export type PopupProps = TdPopupProps;

export const Popup = withInstall('Popup', _Popup);
export default Popup;
