import _Popconfirm from './popconfirm';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdPopconfirmProps } from './type';

import './style';

export type PopconfirmProps = TdPopconfirmProps;
export * from './type';

export const Popconfirm = withInstall(mapProps(
  ['visible'],
  { model: { prop: 'visible', event: 'visible-change' } },
)(_Popconfirm));

export default Popconfirm;
