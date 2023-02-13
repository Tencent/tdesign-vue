import VueCompositionAPI from '@vue/composition-api';

import _Timeline from './timeline';
import _TimelineItem from './timeline-item';
import { TdTimelineProps, TdTimelineItemProps } from './type';
import withInstall from '../utils/withInstall';

import './style/index.js';

export type TimelineProps = TdTimelineProps;
export type TimelineItemProps = TdTimelineItemProps;

/**
 * @deprecated use TimelineProps instead
 */
export type TdTimeLineProps = TimelineProps;

/**
 * @deprecated use TimelineItemProps instead
 */
export type TdTimeLineItemProps = TimelineItemProps;

export * from './type';

export const Timeline = withInstall(_Timeline, VueCompositionAPI);
export const TimelineItem = withInstall(_TimelineItem, VueCompositionAPI);

export default Timeline;
