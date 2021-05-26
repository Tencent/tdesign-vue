import TreeSelect from './tree-select';
import setInstallFn from '../utils/setInstallFn';
import { TdTreeSelectProps } from '../../types/tree-select/TdTreeSelectProps';

setInstallFn('TreeSelect', TreeSelect);

export type TreeSelectProps = TdTreeSelectProps;
export { TreeSelect };
export default TreeSelect;
