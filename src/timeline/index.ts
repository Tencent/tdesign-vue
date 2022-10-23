import _Timeline from './timeline';
import _TimelineItem from './timelineItem';
import { TdTimeLineProps, TdTimeLineItemProps } from './type';
import withInstall from '../utils/withInstall';

import './style/index.js';

export type TimelineProps = TdTimeLineProps;
export type TimelineItemProps = TdTimeLineItemProps;
export * from './type';
export const Timeline = withInstall(_Timeline);
export const TimelineItem = withInstall(_TimelineItem);
export default Timeline;
