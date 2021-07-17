import _Tooltip from './tooltip.vue';
import withInstall from '../utils/withInstall';
import { TdTooltipProps } from './type';

export type TooltipProps = TdTooltipProps;
export * from './type';
export const Tooltip = withInstall('Tooltip', _Tooltip);
export default Tooltip;
