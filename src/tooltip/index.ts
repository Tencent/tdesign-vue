import _Tooltip from './tooltip';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdTooltipProps } from './type';

import './style';

export type TooltipProps = TdTooltipProps;
export * from './type';

export const Tooltip = withInstall(mapProps(
  ['visible'],
  { model: { prop: 'visible', event: 'visible-change' } },
)(_Tooltip));

export default Tooltip;
