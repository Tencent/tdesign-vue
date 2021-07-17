import _Affix from './affix';
import withInstall from '../utils/withInstall';
import { TdAffixProps } from './type';

export const Affix = withInstall('Affix', _Affix);

export * from './type';
export type AffixProps = TdAffixProps;
export default Affix;
