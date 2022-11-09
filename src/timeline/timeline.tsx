import { VNode } from 'vue';
import {
  computed, defineComponent, ref, toRefs, nextTick, getCurrentInstance, provide,
} from '@vue/composition-api';
import getRenderAlign from './utils';
import TimelineItem from './timeline-item';
import { TdTimeLineProps } from './type';
import TimelineProps from './props';
import { usePrefixClass } from '../hooks/useConfig';

export default defineComponent({
  name: 'TTimeline',
  components: {
    TimelineItem,
  },
  props: { ...TimelineProps },
  setup(props: TdTimeLineProps) {
    const {
      theme, labelAlign, reverse, layout, mode,
    } = toRefs(props);

    const instance = getCurrentInstance();

    const classPrefix = usePrefixClass();

    const uidArr: any = ref([]);
    nextTick(() => {
      const defaultSlots: any = instance.slots.default ? instance.slots.default : [null];
      uidArr.value = defaultSlots.map((item: any) => item?.componentInstance?._uid);
    });
    const hasLabelItem = computed(() => {
      const defaultSlots: any = instance.slots.default ? instance.slots.default : [null];
      return defaultSlots.some((item: any) => !!item?.componentOptions?.propsData?.label);
    });

    const timelineClassName = computed(() => {
      const renderAlign = getRenderAlign(labelAlign?.value, layout?.value);
      const classNames = [
        `${classPrefix.value}-timeline`,
        `${classPrefix.value}-timeline-${renderAlign}`,
        `${classPrefix.value}-timeline-${layout?.value}`,
        `${classPrefix.value}-timeline-label--${mode?.value}`,
      ];
      if (reverse?.value) {
        classNames.push(`${classPrefix.value}-timeline-reverse`);
      }
      if (hasLabelItem?.value) {
        classNames.push(`${classPrefix.value}-timeline-label`);
      }
      return classNames.join(' ');
    });

    provide('TTimeline', {
      uidArr,
      theme,
      labelAlign,
      reverse,
      layout,
      mode,
      timelineClassName: timelineClassName.value,
    });

    return {
      timelineClassName,
    };
  },

  render() {
    const { reverse } = this;
    const defaultSlot: VNode[] = this.$scopedSlots.default ? this.$scopedSlots.default(null) : [null];
    if (reverse) {
      defaultSlot.reverse();
    }
    const { timelineClassName, style } = this;
    return (
      <ul class={timelineClassName} style={style}>
        {defaultSlot}
      </ul>
    );
  },
});
