import _Cascader from './cascader';
import _CascaderPanel from './cascader-panel';
import withInstall from '../utils/withInstall';
import { TdCascaderProps } from './type';
import './style';

export * from './type';
export type CascaderProps = TdCascaderProps;

export const Cascader = withInstall(_Cascader);
export const CascaderPanel = withInstall(_CascaderPanel);

export default Cascader;
