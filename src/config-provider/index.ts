import withInstall from '../utils/withInstall';
import _ConfigProvider from './config-provider';

export * from './type';

export type { Locale } from './context';

export const ConfigProvider = withInstall(_ConfigProvider);
export default ConfigProvider;
