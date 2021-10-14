import _Affix from './affix';
import withInstall from '../utils/withInstall';
import { TdAffixProps } from './type';

import './style';

export const Affix = withInstall(_Affix);

export * from './type';
export type AffixProps = TdAffixProps;
export default Affix;
