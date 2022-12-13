import VueCompositionAPI from '@vue/composition-api';

import _TreeSelect from './tree-select';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';
export const TreeSelect = withInstall(_TreeSelect, VueCompositionAPI);
export default TreeSelect;
