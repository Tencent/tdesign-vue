import _Transfer from './transfer';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

export const Transfer = withInstall('Transfer', mapProps([
  { name: 'value' },
  { name: 'checked', event: 'update:checked' },
], {
  model: { prop: 'value', event: 'change' },
})(_Transfer));
export default Transfer;
