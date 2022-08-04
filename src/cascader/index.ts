import VueCompositionAPI from '@vue/composition-api';
import _Cascader from './cascader';
import _CascaderPanel from './cascader-panel';
import withInstall from '../utils/withInstall';
import { TdCascaderProps } from './type';
import './style';

export * from './type';
export type CascaderProps = TdCascaderProps;

export const Cascader = withInstall(_Cascader, VueCompositionAPI);
export const CascaderPanel = withInstall(_CascaderPanel, VueCompositionAPI);

export default Cascader;
