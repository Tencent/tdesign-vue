import _Popconfirm from './popconfirm';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdPopconfirmProps } from '../../types/popconfirm/TdPopconfirmProps';

export type PopconfirmProps = TdPopconfirmProps;
export * from '../../types/popconfirm/TdPopconfirmProps';

export const Popconfirm = withInstall('Popconfirm', mapProps(
  ['visible'],
  { model: { prop: 'visible', event: 'visible-change' } },
)(_Popconfirm));

export default Popconfirm;
