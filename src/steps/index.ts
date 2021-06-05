import _Steps from './steps';
import StepItem from '../step-item';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/setInstallFn';

const Steps = mapProps(['current'], { model: { prop: 'current', event: 'change' } })(_Steps);

setInstallFn('Steps', Steps);
setInstallFn('StepItem', StepItem);
export { Steps };
export default Steps;
