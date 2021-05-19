import _Switch from './switch';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

export const Switch = withInstall('Switch', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_Switch));
export default Switch;
