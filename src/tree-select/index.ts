import _TreeSelect from './tree-select';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';
export const TreeSelect = withInstall('TreeSelect', _TreeSelect);
export default TreeSelect;
