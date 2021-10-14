import _Steps from './steps';
import _StepItem from './step-item';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdStepsProps, TdStepItemProps } from './type';

import './style';

export * from './type';
export type StepsProps = TdStepsProps;
export type StepItemProps = TdStepItemProps;

export const StepItem = withInstall(_StepItem);

export const Steps = withInstall(mapProps(
  ['current'],
  { model: { prop: 'current', event: 'change' } },
)(_Steps));

export default Steps;
