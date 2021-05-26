import TdTree from './td-tree';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/setInstallFn';
import { TdTreeProps } from '../../types/tree/TdTreeProps';

const Tree = mapProps([
  {
    name: 'value',
    event: ['change', 'update:value'],
  },
  {
    name: 'expanded',
    event: ['expand', 'update:expanded'],
  },
  {
    name: 'actived',
    event: ['active', 'update:actived'],
  },
], {
  model: {
    prop: 'value',
    event: 'change',
  },
})(TdTree);

setInstallFn('Tree', Tree);

export * from '../../types/tree/TdTreeProps';
export type TreeProps = TdTreeProps;
export { Tree };
export default Tree;
