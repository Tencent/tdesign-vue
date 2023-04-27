import {
  computed, defineComponent, onMounted, ref,
} from '@vue/composition-api';
import { BacktopIcon as TdBackTopIcon } from 'tdesign-icons-vue';

import { scrollTo } from '../utils/dom';

import { renderContent } from '../utils/render-tnode';
import { usePrefixClass } from '../hooks/useConfig';
import { useGlobalIcon } from '../hooks/useGlobalIcon';
import props from './props';

import type { TdBackTopProps } from './type';

export default defineComponent({
  name: 'TBackTop',
  props: { ...props },
  setup(props: TdBackTopProps) {
    const visible = ref(false);
    const containerRef = ref(null);
    const componentName = usePrefixClass('back-top');
    const classPrefix = usePrefixClass();
    const {
      theme, shape, size, target, duration, offset, container,
    } = props;

    const { BacktopIcon } = useGlobalIcon({
      BacktopIcon: TdBackTopIcon,
    });
    const getContainer = (container: TdBackTopProps['container']) => {
      if (typeof container === 'string' && typeof document !== undefined) {
        if (container === 'body') {
          return document;
        }
        return document.querySelector(container);
      }
      if (typeof container === 'function') {
        return container();
      }
      return null;
    };
    const getBackTo = () => {
      if (target === container) return 0;
      if (target === 'body') return 0;
      if (!target) return 0;
      const targetNode = getContainer(target);
      if (!targetNode) return 0;
      const { y } = (targetNode as HTMLElement).getBoundingClientRect();
      return y;
    };
    const handleClick = (e: MouseEvent) => {
      const y = getBackTo();
      scrollTo(y, { container: containerRef.value, duration });
      props.onClick?.({ e });
    };

    const cls = computed(() => ({
      [componentName.value]: true,
      [`${componentName.value}--theme-${theme}`]: true,
      [`${componentName.value}--${shape}`]: true,
      [`${componentName.value}--show`]: visible.value,
      [`${classPrefix.value}-size-s`]: size === 'small',
      [`${classPrefix.value}-size-m`]: size === 'medium',
    }));

    const positionStyle = computed(() => ({
      insetInlineEnd: offset[0],
      insetBlockEnd: offset[1],
    }));

    onMounted(() => {
      containerRef.value = getContainer(props.container) as HTMLElement;
      let visibleHeight: number;
      if (typeof props.visibleHeight === 'string') {
        visibleHeight = Number(props.visibleHeight.replace('px', ''));
      } else {
        visibleHeight = props.visibleHeight;
      }
      if (visibleHeight === 0) {
        visible.value = true;
        return;
      }
      let scrollDOM: HTMLElement;
      if (containerRef.value.scrollTop === undefined) {
        scrollDOM = document.documentElement;
      } else {
        scrollDOM = containerRef.value;
      }
      containerRef.value.onscroll = () => {
        const { scrollTop } = scrollDOM;
        if (scrollTop >= visibleHeight) {
          visible.value = true;
          containerRef.value.onscroll = null;
        }
      };
    });
    return {
      BacktopIcon,
      cls,
      handleClick,
      positionStyle,
      componentName,
    };
  },
  render() {
    const { BacktopIcon } = this;
    const defaultContent = (
      <div>
        <BacktopIcon class={`${this.componentName}__icon`} size={'24'} />
        <span class={`${this.componentName}__text`}>TOP</span>
      </div>
    );
    return (
      <button type="button" class={this.cls} style={this.positionStyle} onClick={this.handleClick}>
        {renderContent(this, 'content', 'default', defaultContent)}
      </button>
    );
  },
});
