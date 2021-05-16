import Popup from './popup';
import setInstallFn from '../utils/setInstallFn';
import { TdPopupProps } from '../../types/popup/TdPopupProps';

setInstallFn('Popup', Popup);

export type PopupProps = TdPopupProps;
export * from '../../types/popup/TdPopupProps';
export { Popup };
export default Popup;
