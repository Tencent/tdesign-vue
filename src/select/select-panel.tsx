import {
  computed, defineComponent, toRefs, inject, onMounted, onBeforeUnmount,
} from '@vue/composition-api';
import { get } from 'lodash';
import { useTNodeJSX } from '../hooks/tnode';
import { renderTNodeJSX } from '../utils/render-tnode';
import { useConfig } from '../config-provider/useConfig';
import {
  SelectValue, TdOptionProps, SelectOptionGroup, TdSelectProps,
} from './type';
import { name } from './select';
import Option from './option';
import useVirtualScroll from '../hooks/useVirtualScroll';

export interface OptionsType extends TdOptionProps {
  $index?: number;
}

interface SelectPanelProps
  extends Pick<
    TdSelectProps,
    | 'value'
    | 'size'
    | 'multiple'
    | 'empty'
    | 'options'
    | 'max'
    | 'loadingText'
    | 'loading'
    | 'valueType'
    | 'keys'
    | 'panelTopContent'
    | 'panelBottomContent'
    | 'inputValue'
    | 'scroll'
  > {
  onChange?: (value: SelectValue, context?: { label?: string | number; restData?: Record<string, any> }) => void;
  /**
   * 是否展示popup
   */
  showPopup: boolean;
  /**
   * 控制popup展示的函数
   */
  setShowPopup: (show: boolean) => void;
  /**
   * 是否支持创建自定义option
   */
  showCreateOption: boolean;
}

const sizeClassMap = {
  small: 's',
  medium: 'm',
  large: 'l',
};

export default defineComponent({
  name: 'TSelectPanel',

  components: {
    TOption: Option,
  },

  props: [
    'inputValue',
    'panelTopContent',
    'panelBottomContent',
    'size',
    'options',
    'empty',
    'showCreateOption',
    'loading',
    'loadingText',
    'multiple',
    'max',
    'value',
    'realValue',
    'realLabel',
    'scroll',
  ],

  setup(props: SelectPanelProps) {
    const { options, showCreateOption } = toRefs(props);
    const renderTNode = useTNodeJSX();
    const { t, global } = useConfig('select');
    const tSelect: any = inject('tSelect');

    const isEmpty = computed(() => !options.value.length && !showCreateOption.value);
    const panelContentRef = computed(() => tSelect.getOverlayElm());

    const {
      type,
      rowHeight = 28, // 默认每行高度28
      bufferSize = 20,
      isFixedRowHeight = false,
      threshold = 100,
    } = props.scroll || {};

    const {
      trs = null,
      visibleData = null,
      handleScroll: handleVirtualScroll = null,
      scrollHeight = null,
      translateY = null,
      handleRowMounted = null,
    } = type === 'virtual'
      ? useVirtualScroll({
        container: panelContentRef,
        data: options,
        fixedHeight: isFixedRowHeight,
        lineHeight: rowHeight,
        bufferSize,
        threshold,
      })
      : {};

    const isVirtual = computed(
      () => props.scroll?.type === 'virtual' && props.options?.length > (props.scroll?.threshold || 100),
    );

    let lastScrollY = -1;
    const onInnerVirtualScroll = (e: WheelEvent) => {
      if (!isVirtual.value) {
        return;
      }
      const target = (e.target || e.srcElement) as HTMLElement;
      const top = target.scrollTop;
      // 排除横向滚动出发的纵向虚拟滚动计算
      if (Math.abs(lastScrollY - top) > 5) {
        handleVirtualScroll();
        lastScrollY = top;
      } else {
        lastScrollY = -1;
      }
    };

    // 监听popup滚动 处理虚拟滚动时的virtualData变化
    onMounted(() => {
      if (props.scroll?.type === 'virtual') {
        tSelect.getOverlayElm().addEventListener('scroll', onInnerVirtualScroll);
      }
    });

    // 卸载时取消监听
    onBeforeUnmount(() => {
      if (props.scroll?.type === 'virtual') {
        tSelect.getOverlayElm().removeEventListener('scroll', onInnerVirtualScroll);
      }
    });

    return {
      t,
      global,
      isEmpty,
      renderTNode,
      tSelect,
      // 虚拟滚动相关
      trs,
      isVirtual,
      onInnerVirtualScroll,
      visibleData,
      scrollHeight,
      translateY,
      scrollType: props.scroll?.type,
      handleRowMounted,
      bufferSize,
      threshold,
    };
  },

  methods: {
    renderEmptyContent() {
      const { empty, t, global } = this;
      const useLocale = !empty && !this.$slots.empty;
      if (useLocale) {
        return <div class={`${name}__loading-tips`}>{t(global.empty)}</div>;
      }
      return renderTNodeJSX(this, 'empty');
    },
    renderLoadingContent() {
      const { loadingText, t, global } = this;
      const useLocale = !loadingText && !this.$slots.loadingText;
      if (useLocale) {
        return <div class={`${name}__loading-tips`}>{t(global.loadingText)}</div>;
      }
      return renderTNodeJSX(this, 'loadingText');
    },
    renderCreateOption() {
      const {
        showCreateOption, inputValue, trs, scrollType, isVirtual, handleRowMounted, bufferSize,
      } = this;
      const on = isVirtual ? { onRowMounted: handleRowMounted } : {};

      return (
        <ul v-show={showCreateOption} class={[`${name}__create-option`, `${name}__list`]}>
          <t-option
            value={inputValue}
            label={inputValue}
            class={`${name}__create-option--special`}
            trs={trs}
            scrollType={scrollType}
            isVirtual={isVirtual}
            bufferSize={bufferSize}
            on={on}
          />
        </ul>
      );
    },
    renderSingleOption(options: OptionsType[] = []) {
      const {
        realValue, realLabel, trs, scrollType, isVirtual, handleRowMounted, bufferSize,
      } = this;

      const on = isVirtual ? { onRowMounted: handleRowMounted } : {};
      return options.map((item, index) => (
        <t-option
          value={get(item, realValue as string)}
          label={get(item, realLabel as string)}
          content={item.content}
          disabled={item.disabled}
          key={`${item.$index}_${index}`}
          rowIndex={item.$index}
          trs={trs}
          scrollType={scrollType}
          isVirtual={isVirtual}
          bufferSize={bufferSize}
          on={on}
        ></t-option>
      ));
    },
    renderOptionsContent() {
      const {
        tSelect, options, visibleData, isVirtual,
      } = this;
      const children = renderTNodeJSX(this, 'default');
      // 自定义输出
      if (tSelect.hasSlotOptions.value) {
        return (
          <ul v-show={options.length} class={[`${name}__groups`, `${name}__list`]}>
            {children}
          </ul>
        );
      }
      // 组件渲染
      let optionsContent;
      if (tSelect.isGroupOption.value) {
        // 有分组
        optionsContent = (isVirtual && visibleData ? visibleData : options).map((groupList: SelectOptionGroup) => {
          const children = groupList.children.filter((item) => tSelect.displayOptionsMap.value.get(item));
          return (
            <t-option-group label={groupList.group} divider={groupList.divider}>
              {this.renderSingleOption(children)}
            </t-option-group>
          );
        });
      } else {
        // 无分组
        optionsContent = this.renderSingleOption(isVirtual && visibleData ? visibleData : options);
      }
      return <ul class={`${name}__list`}>{optionsContent}</ul>;
    },
  },

  render() {
    const {
      size, renderTNode, loading, isEmpty, translateY, scrollHeight, isVirtual,
    } = this;
    const translate = `translate(0, ${translateY}px)`;
    const virtualStyle = {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };

    const cursorTranslate = `translate(0, ${scrollHeight}px)`;
    const cursorTranslateStyle = {
      position: 'absolute',
      width: '1px',
      height: '1px',
      transition: 'transform 0.2s',
      transform: cursorTranslate,
      '-ms-transform': cursorTranslate,
      '-moz-transform': cursorTranslate,
      '-webkit-transform': cursorTranslate,
    };

    // 虚拟滚动渲染
    if (isVirtual) {
      return (
        <div>
          <div style={{ ...cursorTranslateStyle }}></div>
          <div
            class={[`${name}__dropdown-inner`, `${name}__dropdown-inner--size-${sizeClassMap[size]}`]}
            style={virtualStyle}
          >
            {renderTNode('panelTopContent')}
            {isEmpty && this.renderEmptyContent()}
            {this.renderCreateOption()}
            {!isEmpty && loading && this.renderLoadingContent()}
            {!isEmpty && !loading && this.renderOptionsContent()}
            {renderTNode('panelBottomContent')}
          </div>
        </div>
      );
    }

    return (
      <div
        class={[`${name}__dropdown-inner`, `${name}__dropdown-inner--size-${sizeClassMap[size]}`]}
        style={virtualStyle}
      >
        {renderTNode('panelTopContent')}
        {isEmpty && this.renderEmptyContent()}
        {this.renderCreateOption()}
        {!isEmpty && loading && this.renderLoadingContent()}
        {!isEmpty && !loading && this.renderOptionsContent()}
        {renderTNode('panelBottomContent')}
      </div>
    );
  },
});
