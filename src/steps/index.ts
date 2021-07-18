import _Steps from './steps';
import _StepItem from './step-item';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdStepsProps, TdStepItemProps } from './type';

export * from './type';
export type StepsProps = TdStepsProps;
export type StepItemProps = TdStepItemProps;

const LocalSteps = mapProps(
  ['current'],
  { model: { prop: 'current', event: 'change' } }
)(_Steps);

export const StepItem = withInstall('StepItem', _StepItem);
export const Steps = withInstall('Steps', LocalSteps);
export default Steps;
