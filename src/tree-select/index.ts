import _TreeSelect from './tree-select';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';
export const TreeSelect = withInstall(mapProps([
  {
    name: 'value',
    event: ['change', 'clear', 'remove'],
  },
], {
  model: { prop: 'value', event: 'change' },
})(_TreeSelect));
export default TreeSelect;
