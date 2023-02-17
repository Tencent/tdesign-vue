import {
  computed, defineComponent, toRefs, getCurrentInstance, inject, SetupContext, ref,
} from '@vue/composition-api';
import TLoading from '../loading';
import { TdTimelineItemProps } from './type';
import getRenderAlign from './utils';
import TimelineItemProps from './timeline-item-props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';

const DEFAULT_THEME = ['primary', 'warning', 'error', 'default'];

export default defineComponent({
  name: 'TTimelineItem',
  components: {
    TLoading,
  },
  props: {
    ...TimelineItemProps,
  },
  setup(props: TdTimelineItemProps, context: SetupContext) {
    const instance = getCurrentInstance();
    const classPrefix = usePrefixClass();

    const timelineProvider: any = inject('TTimeline', {
      layout: 'vertical',
      reverse: false,
      theme: undefined,
      labelAlign: 'left',
      mode: 'alternate',
      uidArr: ref([]),
    });
    const {
      layout, reverse, theme, labelAlign, mode, uidArr,
    } = timelineProvider;
    const { dotColor, labelAlign: itemLabelAlign, loading } = toRefs(props);
    const timelineItemAlign = computed(() => itemLabelAlign.value ?? getRenderAlign(labelAlign?.value, layout?.value));

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
    const positionClassName = computed(() => {
      // 横向布局 以及 纵向布局对应为不同的样式名
      const left = layout?.value === 'horizontal' ? 'top' : 'left';
      const right = layout?.value === 'horizontal' ? 'bottom' : 'right';
      // 单独设置则单独生效
      if (timelineItemAlign.value === 'alternate') {
        return currentIndex.value % 2 === 0
          ? `${classPrefix.value}-timeline-item-${left}`
          : `${classPrefix.value}-timeline-item-${right}`;
      }
      if (timelineItemAlign.value === 'left' || timelineItemAlign.value === 'top') {
        return `${classPrefix.value}-timeline-item-${left}`;
      }
      if (timelineItemAlign.value === 'right' || timelineItemAlign.value === 'bottom') {
        return `${classPrefix.value}-timeline-item-${right}`;
      }
      return '';
    });
    // 计算是不是末尾子元素
    const getItemClassName = computed(() => {
      const isLastChildren = uidArr.value.length - 1 === currentIndex.value;
      const lastClassName = isLastChildren ? `${classPrefix.value}-timeline-item--last` : '';
      return `${classPrefix.value}-timeline-item ${positionClassName.value} ${lastClassName}`;
    });

    // 连线类名
    const tailClassName = computed(() => {
      const statusClassName = reverse ? `${classPrefix.value}-timeline-item__tail--status-${dotColor?.value}` : '';
      return `${classPrefix.value}-timeline-item__tail ${classPrefix.value}-timeline-item__tail--theme-${theme?.value} ${statusClassName}`;
    });
    const dotElement = computed<boolean>(() => Boolean(context.slots.dot || props.dot));
    // 圆圈类名
    const dotClassName = computed(() => {
      const dotCustomClassName = !!dotElement.value || (!dotElement.value && loading?.value)
        ? `${classPrefix.value}-timeline-item__dot--custom`
        : '';
      const docColorClassName = DEFAULT_THEME.includes(dotColor?.value)
        ? `${classPrefix.value}-timeline-item__dot--${dotColor?.value}`
        : '';
      return `${classPrefix.value}-timeline-item__dot ${dotCustomClassName} ${docColorClassName}`;
    });

    const labelClassName = computed(
      () => `${classPrefix.value}-timeline-item__label ${classPrefix.value}-timeline-item__label--${mode?.value}`,
    );
    return {
      mode,
      currentIndex,
      tailClassName,
      dotClassName,
      labelClassName,
      getItemClassName,
      classPrefix,
    };
  },

  render() {
    const {
      dotColor,
      dotClassName,
      style = {},
      labelClassName,
      mode,
      loading,
      tailClassName,
      getItemClassName,
      classPrefix = 't',
    } = this;

    const dotElement = renderTNodeJSX(this, 'dot');
    const labelNode = renderTNodeJSX(this, 'label');

    const dotContentClass = `${classPrefix}-timeline-item__dot-content`;
    if (Array.isArray(dotElement) && dotElement[0]?.data) {
      const classes = dotElement[0].data.class;
      dotElement[0].data.class = classes ? [classes, dotContentClass].join(' ') : dotContentClass;
    }

    return (
      <li class={getItemClassName} style={style}>
        {mode === 'alternate' && labelNode && <div class={labelClassName}>{labelNode}</div>}
        <div class={`${classPrefix}-timeline-item__wrapper`}>
          <div class={dotClassName} style={{ borderColor: !DEFAULT_THEME.includes(dotColor) && dotColor }}>
            {!dotElement && loading && <TLoading size="12px" class={dotContentClass} />}
            {dotElement}
          </div>
          <div class={tailClassName} />
        </div>
        <div class={`${classPrefix}-timeline-item__content`}>
          {renderContent(this, 'content', 'default')}
          {mode === 'same' && labelNode && <div class={labelClassName}>{labelNode}</div>}
        </div>
      </li>
    );
  },
});
