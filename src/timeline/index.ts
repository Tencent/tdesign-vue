import _Timeline from './timeline';
import _TimelineItem from './timelineItem';
import { TdTimelineProps, TdTimelineItemProps } from './type';
import withInstall from '../utils/withInstall';

import './style/index.js';

export type TimelineProps = TdTimelineProps;
export type TimelineItemProps = TdTimelineItemProps;
export * from './type';
export const Timeline = withInstall(_Timeline);
export const TimelineItem = withInstall(_TimelineItem);
export default Timeline;
