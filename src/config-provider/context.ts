import merge from 'lodash/merge';
import defaultConfig from '../_common/js/global-config/default-config';
import defaultZhCN from '../_common/js/global-config/locale/zh_CN';
import { GlobalConfigProvider } from './type';

export enum EAnimationType {
  ripple = 'ripple',
  expand = 'expand',
  fade = 'fade',
}

export const defaultGlobalConfig: GlobalConfigProvider = merge(defaultConfig, defaultZhCN);

export type Locale = typeof defaultZhCN;

// 导出全局配置（包括语言配置）全部类型
export * from './type';
