import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
  onUpdated,
  inject,
  provide,
} from '@vue/composition-api';
import { get } from 'lodash';
import { useTNodeJSX } from '../hooks/tnode';
import { renderTNodeJSX } from '../utils/render-tnode';
import { useConfig } from '../config-provider/useConfig';
import {
  TdSelectProps, SelectValue, TdOptionProps, SelectOptionGroup, SelectOption,
} from './type';
import { name } from './select';
import Option from './option';

type OptionsType = TdOptionProps[];

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
  ],

  // setup(props: SelectPanelProps, context: SetupContext) {
  setup(props: SelectPanelProps) {
    const {
      options, showCreateOption, value, multiple, max,
    } = toRefs(props);

    const renderTNode = useTNodeJSX();
    const { t, global } = useConfig('select');
    const tSelect: any = inject('tSelect');

    const isEmpty = computed(() => !options.value.length && !showCreateOption.value);

    const multiLimitDisabled = (v: string | number) => {
      if (multiple.value && max.value) {
        if (Array.isArray(value.value) && value.value.indexOf(v) === -1 && max.value <= value.value.length) {
          return true;
        }
      }
      return false;
    };

    return {
      t,
      global,
      isEmpty,
      renderTNode,
      multiLimitDisabled,
      tSelect,
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
      const { showCreateOption, inputValue } = this;
      return (
        <ul v-show={showCreateOption} class={[`${name}__create-option`, `${name}__list`]}>
          <t-option value={inputValue} label={inputValue} class={`${name}__create-option--special`} />
        </ul>
      );
    },
    renderSingleOption(options: OptionsType = []) {
      const { realValue, realLabel } = this;
      return options.map((item, index) => (
        <t-option
          value={get(item, realValue as string)}
          label={get(item, realLabel as string)}
          content={item.content}
          disabled={item.disabled || this.multiLimitDisabled(get(item, realValue as string) as string)}
          key={index}
        ></t-option>
      ));
    },
    renderOptionsContent(options: SelectOption[]) {
      const { tSelect } = this;

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
        optionsContent = options.map((groupList: SelectOptionGroup) => {
          const children = groupList.children.filter((item) => tSelect.displayOptionsMap.value.get(item));
          return (
            <t-option-group v-show={children.length} label={groupList.group} divider={groupList.divider}>
              {this.renderSingleOption(children)}
            </t-option-group>
          );
        });
      } else {
        // 无分组
        optionsContent = this.renderSingleOption(options);
      }
      return <ul class={`${name}__list`}>{optionsContent}</ul>;
    },
  },

  render() {
    const {
      size, renderTNode, loading, isEmpty, options,
    } = this;
    return (
      <div class={`${name}__dropdown-inner ${name}__dropdown-inner--size-${sizeClassMap[size]}`}>
        {renderTNode('panelTopContent')}
        {isEmpty && this.renderEmptyContent()}
        {this.renderCreateOption()}
        {!isEmpty && loading && this.renderLoadingContent()}
        {!isEmpty && !loading && this.renderOptionsContent(options)}
        {renderTNode('panelBottomContent')}
      </div>
    );
  },
});
