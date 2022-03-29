import _Transfer from './transfer';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';

export const Transfer = withInstall(
  mapProps([{ name: 'value' }, { name: 'checked', event: 'update:checked' }], {
    model: { prop: 'value', event: 'change' },
  })(_Transfer),
);

export default Transfer;
