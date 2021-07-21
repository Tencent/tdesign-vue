import _Popup from './popup';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdPopupProps } from './type';

export * from './type';
export type PopupProps = TdPopupProps;

export const Popup = withInstall('Popup', mapProps(
  ['visible'],
  { model: { prop: 'visible', event: 'visible-change' } },
)(_Popup));
export default Popup;
