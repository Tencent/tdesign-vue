import { VNode } from 'vue';
import {
  computed, defineComponent, SetupContext, toRefs, getCurrentInstance, inject,
} from '@vue/composition-api';
import TLoading from '../loading';
import { TdTimeLineItemProps } from './type';
import { prefix } from '../config';
import getRenderAlign from './utils';
import { TimelineItemProps } from './props';

const DefaultTheme = ['default', 'primary', 'success', 'warning', 'error'];

export default defineComponent({
  name: 'TTimelineItem',
  components: {
    TLoading,
  },
  props: {
    ...TimelineItemProps,
  },
  setup(props: TdTimeLineItemProps, context: SetupContext) {
    const instance = getCurrentInstance();

    const timelineProvider: any = inject('TTimeline');
    const {
      layout, reverse, theme, labelAlign, mode, uidArr,
    } = timelineProvider;
    const { dotColor, labelAlign: itemLabelAlign, loading } = toRefs(props);
    const renderAlign = computed(() => {
      const result = getRenderAlign(labelAlign.value, layout.value);
      return result;
    });

    const currentIndex = computed(() => {
      let index = 0;
      uidArr.value.forEach((item: number | undefined, itemIndex: number) => {
        if (item === instance.uid) {
          index = itemIndex;
        }
      });
      return index;
    });

    // 计算节点模式 CSS 类名
    const getPositionClassName = computed(() => {
      // 横向布局 以及 纵向布局对应为不同的样式名
      const left = layout.value === 'horizontal' ? 'top' : 'left';
      const right = layout.value === 'horizontal' ? 'bottom' : 'right';
      // 单独设置则单独生效
      if (renderAlign.value === 'alternate') {
        return itemLabelAlign.value || currentIndex.value % 2 === 0
          ? `${prefix}-timeline-item-${left}`
          : `${prefix}-timeline-item-${right}`;
      }
      if (renderAlign.value === 'left' || renderAlign.value === 'top') {
        return `${prefix}-timeline-item-${left}`;
      }
      if (renderAlign.value === 'right' || renderAlign.value === 'bottom') {
        return `${prefix}-timeline-item-${right}`;
      }
      return '';
    });
    // 计算是不是末尾子元素
    const getItemClassName = computed(() => {
      const isLastChildren = uidArr.value.length - 1 === currentIndex.value;
      const lastClassName = isLastChildren ? `${prefix}-timeline-item--last` : '';
      return `${prefix}-timeline-item ${getPositionClassName.value} ${lastClassName}`;
    });

    // 连线类名
    const tailClassName = computed(() => {
      const statusClassName = reverse ? `${prefix}-timeline-item__tail--status-${dotColor.value}` : '';
      return `${prefix}-timeline-item__tail ${prefix}-timeline-item__tail--theme-${theme.value} ${statusClassName}`;
    });
    const dotElement = instance.slots.dot;
    // 圆圈类名
    const dotClassName = computed(() => {
      const dotCustomClassName = !!dotElement || (!dotElement && loading.value) ? `${prefix}-timeline-item__dot--custom` : '';
      const docColorClassName = DefaultTheme.includes(dotColor.value)
        ? `${prefix}-timeline-item__dot--${dotColor.value}`
        : '';
      return `${prefix}-timeline-item__dot ${dotCustomClassName} ${docColorClassName}`;
    });

    const labelClassName = computed(
      () => `${prefix}-timeline-item__label ${prefix}-timeline-item__label--${mode.value}`,
    );
    return {
      mode,
      currentIndex,
      tailClassName,
      dotClassName,
      labelClassName,
      getItemClassName,
    };
  },

  render(h) {
    const defaultSlot: VNode[] = this.$scopedSlots.default ? this.$scopedSlots.default(null) : [null];
    const dotSlot: VNode[] = this.$scopedSlots.dot ? this.$scopedSlots.dot(null) : null;
    const {
      dotColor,
      dotClassName,
      style = {},
      labelClassName,
      label,
      mode,
      loading,
      tailClassName,
      content,
      getItemClassName,
    } = this;
    return (
      <li class={getItemClassName} style={style}>
        {mode === 'alternate' && label && <div class={labelClassName}>{label}</div>}
        <div class={`${prefix}-timeline-item__wrapper`}>
          <div class={dotClassName} style={{ borderColor: !DefaultTheme.includes(dotColor) && dotColor }}>
            <div class={`${prefix}-timeline-item__dot-content`}>
              {!dotSlot && loading && <TLoading size="12px" />}
              {dotSlot}
            </div>
          </div>
          <div class={tailClassName} />
        </div>
        <div class={`${prefix}-timeline-item__content`}>
          {content || defaultSlot}
          {mode === 'same' && label && <div class={labelClassName}>{label}</div>}
        </div>
      </li>
    );
  },
});
