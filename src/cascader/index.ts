import _Cascader from './cascader';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import { TdCascaderProps } from './type';
import './style';

export * from './type';
export type CascaderProps = TdCascaderProps;

export const Cascader = withInstall(
  mapProps(['value'], {
    model: { prop: 'value', event: 'change' },
  })(_Cascader),
);

export default Cascader;
