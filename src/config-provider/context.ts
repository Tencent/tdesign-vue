import merge from 'lodash/merge';
import defaultConfig from '../_common/js/global-config/default-config';
import defaultZhCN from '../_common/js/global-config/locale/zh_CN';
import defaultEnUS from '../_common/js/global-config/locale/en_US';

export enum EAnimationType {
  ripple = 'ripple',
  expand = 'expand',
  fade = 'fade',
}

export const defaultGlobalConfig = merge(defaultConfig, defaultZhCN);

export type Locale = typeof defaultZhCN;
export type GlobalConfig = typeof defaultGlobalConfig;

export const zhCN = defaultZhCN;
export const enUS = defaultEnUS;
