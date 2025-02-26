import withInstall from '../utils/withInstall';
import _ConfigProvider from './config-provider';
import { TdConfigProviderProps } from './context';

export * from './type';
export type ConfigProviderProps = TdConfigProviderProps;

export type { Locale } from './context';

export const ConfigProvider = withInstall(_ConfigProvider);
export default ConfigProvider;
