import _Steps from './steps';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

const LocalSteps = mapProps(
  ['current'],
  { model: { prop: 'current', event: 'change' } }
)(_Steps);

export const Steps = withInstall('Steps', LocalSteps);
export default Steps;
