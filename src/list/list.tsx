import { defineComponent, computed, ref } from '@vue/composition-api';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import TLoading from '../loading';
import TListItem from './list-item';
import props from './props';
import { LOAD_MORE, LOADING } from './const';
import { useConfig, usePrefixClass, useCommonClassName } from '../hooks/useConfig';
import useListVirtualScroll from './hooks/useListVirtualScroll';
import { renderTNodeJSX } from '../utils/render-tnode';
import useListItems from './hooks/useListItem';
import type { TdListProps } from './type';

export default defineComponent({
  name: 'TList',
  props,
  setup(props: TdListProps, { emit }) {
    const listRef = ref();

    const { globalConfig } = useConfig('list');
    const componentName = usePrefixClass('list');
    const { SIZE } = useCommonClassName();
    const { listItems } = useListItems();
    const listClass = computed(() => [
      `${componentName.value}`,
      SIZE.value[props.size],
      {
        [`${componentName.value}--split`]: props.split,
        [`${componentName.value}--stripe`]: props.stripe,
        [`${componentName.value}--vertical-action`]: props.layout === 'vertical',
      },
    ]);

    const loadingClass = computed(() => isString(props.asyncLoading) && ['loading', 'load-more'].includes(props.asyncLoading)
      ? `${componentName.value}__load ${componentName.value}__load--${props.asyncLoading}`
      : `${componentName.value}__load`);

    const {
      virtualConfig, cursorStyle, listStyle, isVirtualScroll, onInnerVirtualScroll,
    } = useListVirtualScroll(
      props.scroll,
      listRef,
      listItems,
    );
    const handleScroll = (e: WheelEvent) => {
      const listElement = e.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = listElement;
      if (isVirtualScroll.value) onInnerVirtualScroll(e);
      const scrollParams = {
        e,
        scrollTop,
        scrollBottom: scrollHeight - clientHeight - scrollTop,
      };
      emit('scroll', scrollParams);

      props.onScroll?.(scrollParams);
    };

    const handleLoadMore = (e: MouseEvent) => {
      if (isString(props.asyncLoading) && props.asyncLoading !== LOAD_MORE) return;
      emit('load-more', { e });
      props.onLoadMore?.({ e });
    };

    return {
      componentName,
      listClass,
      loadingClass,
      handleScroll,
      handleLoadMore,
      listRef,
      globalConfig,
      virtualConfig,
      cursorStyle,
      listStyle,
      isVirtualScroll,
    };
  },

  render() {
    const {
      isVirtualScroll, cursorStyle, listStyle, componentName, globalConfig, virtualConfig,
    } = this;

    const propsHeaderContent = renderTNodeJSX(this, 'header');
    const propsFooterContent = renderTNodeJSX(this, 'footer');
    const renderLoading = () => {
      if (this.asyncLoading && isString(this.asyncLoading)) {
        if (this.asyncLoading === LOADING) {
          return (
            <div>
              <TLoading />
              <span>{globalConfig.loadingText}</span>
            </div>
          );
        }
        if (this.asyncLoading === LOAD_MORE) {
          return <span>{globalConfig.loadingMoreText}</span>;
        }
      }
      return renderTNodeJSX(this, 'asyncLoading');
    };

    return (
      <div
        class={this.listClass}
        onScroll={this.handleScroll}
        ref="listRef"
        style={isVirtualScroll ? 'position:relative' : undefined}
      >
        {propsHeaderContent ? <div class={`${componentName}__header`}>{propsHeaderContent}</div> : null}
        {isVirtualScroll ? (
          <div>
            <div style={cursorStyle}></div>
            <ul class={`${componentName}__inner`} style={listStyle}>
              {virtualConfig.visibleData.value.map((item) => (
                <TListItem {...omit(item, 'slots')} scopedSlots={{ default: item.slots }}></TListItem>
              ))}
            </ul>
          </div>
        ) : (
          <ul class={`${componentName}__inner`}>{renderTNodeJSX(this, 'default')}</ul>
        )}
        {propsFooterContent ? <div class={`${componentName}__footer`}>{propsFooterContent}</div> : null}
        <div class={this.loadingClass} onClick={this.handleLoadMore}>
          {renderLoading()}
        </div>
      </div>
    );
  },
});
