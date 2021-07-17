import _Tooltip from './tooltip.vue';
import withInstall from '../utils/withInstall';
import { TdTooltipProps } from '../../types/tooltip/TdTooltipProps';

export type TooltipProps = TdTooltipProps;
export * from '../../types/tooltip/TdTooltipProps';
export const Tooltip = withInstall('Tooltip', _Tooltip);
export default Tooltip;
