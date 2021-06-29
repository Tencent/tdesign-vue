import _Affix from './affix';
import withInstall from '../utils/withInstall';
import { TdAffixProps } from '../../types/affix/TdAffixProps';

export const Affix = withInstall('Affix', _Affix);

export * from '../../types/affix/TdAffixProps';
export type AffixProps = TdAffixProps;

export default Affix;
