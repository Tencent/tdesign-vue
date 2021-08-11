import withInstall from '../utils/withInstall';
import _LocaleProvider from './local-provider';

export * from './type';
export const LocaleProvider = withInstall('LocaleProvider', _LocaleProvider);
export default LocaleProvider;
