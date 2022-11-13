import VueCompositionAPI from '@vue/composition-api';
import _AutoComplete from './auto-complete';
import _HighlightOption from './highlight-option';
import withInstall from '../utils/withInstall';
import { TdAutoCompleteProps } from './type';

import './style';

export * from './type';
export type AutoCompleteProps = TdAutoCompleteProps;

export const AutoComplete = withInstall(_AutoComplete, VueCompositionAPI);
export const HighlightOption = withInstall(_HighlightOption, VueCompositionAPI);

export default AutoComplete;
