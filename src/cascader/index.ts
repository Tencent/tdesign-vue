import _Cascader from './cascader';
import withInstall from '../utils/withInstall';
import { TdCascaderProps } from './type';
import './style';

export * from './type';
export type CascaderProps = TdCascaderProps;

export const Cascader = withInstall(_Cascader);

export default Cascader;
