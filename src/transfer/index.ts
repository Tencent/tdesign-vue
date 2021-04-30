import _Transfer from './transfer';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/setInstallFn';

const Transfer = mapProps([
  {
    name: 'value',
  },
  {
    name: 'checked',
    event: 'update:checked',
  },
], {
  model: {
    prop: 'value',
    event: 'change',
  },
})(_Transfer);

setInstallFn('Transfer', Transfer);

export { Transfer };
export default Transfer;
