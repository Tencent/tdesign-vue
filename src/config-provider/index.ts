import withInstall from '../utils/withInstall';
import _ConnfigProvider from './config-provider';

export * from './type';
export * from './useConfig';

export type { Locale } from './context';

export const ConnfigProvider = withInstall(_ConnfigProvider);
export default ConnfigProvider;
