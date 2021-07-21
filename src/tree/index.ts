
import _TdTree from './td-tree';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

export const Tree = withInstall('Tree', mapProps([
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
  model: { prop: 'value', event: 'change' },
})(_TdTree));

export * from './interface';
export default Tree;
