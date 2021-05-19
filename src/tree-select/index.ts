import _TreeSelect from './tree-select';
import withInstall from '../utils/withInstall';

import { TdTreeSelectProps } from '../../types/tree-select/TdTreeSelectProps';

export type TreeSelectProps = TdTreeSelectProps;
export const TreeSelect = withInstall('TreeSelect', _TreeSelect);
export default TreeSelect;
