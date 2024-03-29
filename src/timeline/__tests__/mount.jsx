import { mount } from '@vue/test-utils';
import { Timeline, TimelineItem } from '../../timeline';

export function getTimelineDefaultMount(Timeline, props, events) {
  return mount({
    render() {
      return (
        <Timeline props={props} events={events}>
          <TimelineItem label="2022-01-01">Event1</TimelineItem>
          <TimelineItem label="2022-02-01">Event2</TimelineItem>
          <TimelineItem label="2022-03-01">Event3</TimelineItem>
          <TimelineItem label="2022-04-01" dotColor="yellowgreen">
            Event4
          </TimelineItem>
        </Timeline>
      );
    },
  });
}

// labelAlign 优先级比较
export function getTimelineItemMount(TimelineItem, props) {
  return mount({
    render() {
      return (
        <Timeline labelAlign="right">
          <TimelineItem props={props} label="2022-01-01">
            Event1
          </TimelineItem>
          <TimelineItem label="2022-02-01">Event2</TimelineItem>
          <TimelineItem label="2022-03-01">Event3</TimelineItem>
          <TimelineItem label="2022-04-01">Event4</TimelineItem>
        </Timeline>
      );
    },
  });
}

export default getTimelineDefaultMount;
