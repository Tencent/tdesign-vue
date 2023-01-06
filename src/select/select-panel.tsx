import {
  computed, defineComponent, toRefs, inject, onMounted, onBeforeUnmount,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { VNode } from 'vue';
import { useTNodeJSX } from '../hooks/tnode';
import { renderTNodeJSXDefault } from '../utils/render-tnode';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import {
  TdOptionProps, SelectOptionGroup, TdSelectProps, SelectOption,
} from './type';
import Option from './option';
import useVirtualScroll from '../hooks/useVirtualScroll';
import { flattenOptions } from './util';

export interface OptionsType extends TdOptionProps {
  $index?: number;
}

type SelectPanelProps = Pick<
  TdSelectProps,
  | 'size'
  | 'multiple'
  | 'empty'
  | 'options'
  | 'loadingText'
  | 'loading'
  | 'valueType'
  | 'keys'
  | 'panelTopContent'
  | 'panelBottomContent'
  | 'inputValue'
  | 'scroll'
  | 'creatable'
  | 'filterable'
  | 'filter'
>;

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
    'filter',
    'loading',
    'loadingText',
    'multiple',
    'scroll',
    'creatable',
    'filterable',
  ],

  setup(props: SelectPanelProps) {
    const { options, inputValue } = toRefs(props);
    const renderTNode = useTNodeJSX();
    const { t, global } = useConfig('select');
    const selectProvider: any = inject('tSelect');
    const COMPONENT_NAME = usePrefixClass('select');

    const panelContentRef = computed(() => selectProvider.getOverlayElm());

    const {
      type,
      rowHeight = 28, // 默认每行高度28
      bufferSize = 20,
      isFixedRowHeight = false,
      threshold = 100,
    } = props.scroll || {};

    const displayOptions = computed(() => {
      if (!inputValue.value || !(props.filterable || isFunction(props.filter))) return options.value;

      const filterMethods = (option: SelectOption) => {
        if (isFunction(props.filter)) {
          return props.filter(`${props.inputValue}`, option);
        }
        return option.label?.toLowerCase?.().indexOf(`${props.inputValue}`.toLowerCase()) > -1;
      };

      const res: Array<SelectOption & { index?: number }> = [];
      // 动态赋予选项 index 的计数：默认从 0 开始累加，当含有用户创建条目的时候，创建条目 index 为 0，正常条目下标从 1 开始累加
      let groupIndex = isCreateOptionShown.value ? 1 : 0;
      props.options.forEach((option) => {
        if ((option as SelectOptionGroup).group && (option as SelectOptionGroup).children) {
          res.push({
            ...option,
            // 处理index使其在过滤后的分组中能正确触发上下移动键的hover效果
            children: (option as SelectOptionGroup).children.filter(filterMethods).reduce((pre, cur) => {
              pre.push({ ...cur, index: groupIndex });
              groupIndex += 1;
              return pre;
            }, []),
          });
        } else if (filterMethods(option)) {
          res.push({ ...option, index: groupIndex + res.length });
        }
      });

      return res;
    });
    const getDisplayOptions = () => {
      const arr: (SelectOption & { isCreated?: boolean })[] = [];
      if (isCreateOptionShown.value) {
        arr.push({ label: String(inputValue.value), value: String(inputValue.value), isCreated: true } as SelectOption);
      }
      arr.push(...displayOptions.value);
      return arr;
    };

    // 是否显示创建选项，需满足条件：1. creatable 为真；2. filterable 为真；3.有用户输入筛选内容；4. 用户输入的筛选内容不能在当前 options 下找到
    const isCreateOptionShown = computed(
      () => !!(
        props.creatable
          && props.filterable
          && props.inputValue
          && flattenOptions(options.value).find((v) => v.label === props.inputValue) === undefined
      ),
    );
    const isEmpty = computed(() => !(displayOptions.value.length > 0));
    const isVirtual = computed(
      () => props.scroll?.type === 'virtual' && props.options?.length > (props.scroll?.threshold || 100),
    );

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
        data: displayOptions,
        fixedHeight: isFixedRowHeight,
        lineHeight: rowHeight,
        bufferSize,
        threshold,
      })
      : {};
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
        selectProvider.getOverlayElm()?.addEventListener('scroll', onInnerVirtualScroll);
      }
    });

    // 卸载时取消监听
    onBeforeUnmount(() => {
      if (props.scroll?.type === 'virtual') {
        selectProvider.getOverlayElm()?.removeEventListener('scroll', onInnerVirtualScroll);
      }
    });

    return {
      t,
      global,
      isEmpty,
      renderTNode,
      selectProvider,
      isCreateOptionShown,
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
      displayOptions,
      getDisplayOptions,
      componentName: COMPONENT_NAME,
    };
  },

  methods: {
    renderEmptyContent() {
      if (this.empty && typeof this.empty === 'string') {
        return <div class={`${this.componentName}__empty`}>{this.empty}</div>;
      }
      return renderTNodeJSXDefault(
        this,
        'empty',
        <div class={`${this.componentName}__empty`}>{this.t(this.global.empty)}</div>,
      );
    },
    renderLoadingContent() {
      if (this.loadingText && typeof this.loadingText === 'string') {
        return <div class={`${this.componentName}__loading-tips`}>{this.loadingText}</div>;
      }
      return renderTNodeJSXDefault(
        this,
        'loadingText',
        <div class={`${this.componentName}__loading-tips`}>{this.t(this.global.loadingText)}</div>,
      );
    },
    renderCreateOption() {
      const on = this.isVirtual ? { onRowMounted: this.handleRowMounted } : {};

      return (
        <ul class={[`${this.componentName}__create-option`, `${this.componentName}__list`]}>
          <t-option
            multiple={this.multiple}
            index={0}
            isCreatedOption={true}
            value={this.inputValue}
            label={this.inputValue}
            class={`${this.componentName}__create-option--special`}
            trs={this.trs}
            scrollType={this.scrollType}
            isVirtual={this.isVirtual}
            bufferSize={this.bufferSize}
            on={on}
          />
        </ul>
      );
    },

    // 递归render options
    renderOptionsContent(options: SelectOption[]) {
      const on = this.isVirtual ? { onRowMounted: this.handleRowMounted } : {};

      return (
        <ul class={`${this.componentName}__list`}>
          {options.map(
            (
              item: SelectOptionGroup &
                TdOptionProps & {
                  slots: VNode;
                  class: string | undefined;
                  style: { [key: string]: string } | undefined;
                } & OptionsType,
              index,
            ) => {
              if (item.group) {
                return (
                  <t-option-group label={item.group} divider={item.divider}>
                    {this.renderOptionsContent(item.children)}
                  </t-option-group>
                );
              }

              const scrollProps = this.isVirtual
                ? {
                  rowIndex: item.$index,
                  trs: this.trs,
                  scrollType: this.scrollType,
                  isVirtual: this.isVirtual,
                  bufferSize: this.bufferSize,
                }
                : { key: index };
              // replace `scopedSlots` of `v-slots` in Vue3
              return (
                <t-option
                  // 透传 class
                  class={item.class}
                  // 透传 style
                  style={item.style}
                  // 透传其余参数
                  {...{ props: { ...item, ...scrollProps } }}
                  // t-option 自身逻辑所需属性
                  multiple={this.multiple}
                  scopedSlots={{ default: item.slots }}
                  key={`${item.$index || ''}_${index}`}
                  on={on}
                />
              );
            },
          )}
        </ul>
      );
    },

    renderPanelContent(innerStyle = {}) {
      const { loading } = this;
      return (
        <div
          class={[
            `${this.componentName}__dropdown-inner`,
            `${this.componentName}__dropdown-inner--size-${sizeClassMap[this.size]}`,
          ]}
          style={innerStyle}
        >
          {this.renderTNode('panelTopContent')}
          {this.isCreateOptionShown && this.renderCreateOption()}
          {loading && this.renderLoadingContent()}
          {!loading && this.isEmpty && !this.isCreateOptionShown && this.renderEmptyContent()}
          {!loading
            && !this.isEmpty
            && this.renderOptionsContent(this.isVirtual && this.visibleData ? this.visibleData : this.displayOptions)}
          {this.renderTNode('panelBottomContent')}
        </div>
      );
    },
  },

  render() {
    // 虚拟滚动渲染，popup 的 dom 结构有区别
    if (this.isVirtual) {
      const cursorTranslate = `translate(0, ${this.scrollHeight}px)`;
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

      const translate = `translate(0, ${this.translateY}px)`;
      const virtualStyle = {
        transform: translate,
        '-ms-transform': translate,
        '-moz-transform': translate,
        '-webkit-transform': translate,
      };
      return (
        <div>
          <div style={{ ...cursorTranslateStyle }}></div>
          {this.renderPanelContent(virtualStyle)}
        </div>
      );
    }

    return (this.renderPanelContent as Function)();
  },
});
