import _Popup from './popup';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdPopupProps } from './type';

import './style';

export type PopupProps = TdPopupProps;
export * from './type';

export const Popup = withInstall(mapProps(
  ['visible'],
  { model: { prop: 'visible', event: 'visible-change' } },
)(_Popup));

export default Popup;
