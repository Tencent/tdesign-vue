import _Tabs from './tabs';
import _TabPanel from './tab-panel';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

export const Tabs = withInstall('Tabs', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_Tabs));
export const TabPanel = withInstall('TabPanel', _TabPanel);
export default Tabs;
