import _Popup from './popup';
import withInstall from '../utils/withInstall';
import { TdPopupProps } from './type';

import './style';

export type PopupProps = TdPopupProps;
export * from './type';

export const Popup = withInstall('Popup', _Popup);
export default Popup;
