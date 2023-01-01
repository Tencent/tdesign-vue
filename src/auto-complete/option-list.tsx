import {
  ref, computed, defineComponent, PropType, h, watch, onBeforeMount,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import HighlightOption from './highlight-option';
import { CommonClassNameType } from '../hooks/useCommonClassName';
import { AutoCompleteOptionObj, TdAutoCompleteProps } from './type';
import log from '../_common/js/log';
import { usePrefixClass } from '../hooks/useConfig';

export default defineComponent({
  name: 'AutoCompleteOptionList',

  props: {
    sizeClassNames: Object as PropType<CommonClassNameType['sizeClassNames']>,
    value: String,
    size: String as PropType<TdAutoCompleteProps['size']>,
    options: Array as PropType<TdAutoCompleteProps['options']>,
    popupVisible: Boolean,
    highlightKeyword: Boolean,
    filterable: Boolean,
    filter: Function as PropType<TdAutoCompleteProps['filter']>,
  },

  setup(props, { emit }) {
    const active = ref('');
    const classPrefix = usePrefixClass();

    const classes = computed(() => `${classPrefix.value}-select__list`);
    const optionClasses = computed(() => [
      `${classPrefix.value}-select-option`,
      {
        [props.sizeClassNames[props.size]]: props.size,
      },
    ]);

    // 整理数据格式
    const tOptions = computed<AutoCompleteOptionObj[]>(() => {
      let options = (props.options || []).map((item) => {
        let option: AutoCompleteOptionObj = {};
        if (typeof item === 'string') {
          option = { text: item, label: item };
        } else {
          if (item.text && typeof item.text !== 'string') {
            log.warn('AutoComplete', '`text` must be a string.');
          }
          if (!item.text) {
            if (typeof item.label === 'string') {
              option = { ...item, text: item.label };
            } else {
              log.warn('AutoComplete', 'one of `label` and `text` must be a existed string.');
            }
          } else {
            option = item;
          }
        }
        return option;
      });
      // 自定义过滤规则
      if (props.filter) {
        options = options.filter((option) => props.filter(props.value, option));
      } else if (props.filterable) {
        // 默认过滤规则
        const regExp = new RegExp(props.value, 'i');
        options = options.filter((item) => regExp.test(item.text));
      }
      return options;
    });

    const onOptionClick = (e: MouseEvent) => {
      let liNode = e.target as HTMLElement;
      while (liNode && liNode.tagName !== 'LI') {
        liNode = liNode.parentNode as HTMLElement;
      }
      const keyword = liNode.getAttribute('title');
      active.value = keyword;
      emit('select', keyword, { e });
    };

    // 键盘事件，上下选择
    const onKeyInnerPress = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
        const index = tOptions.value.findIndex((item) => item.text === active.value);
        const newIndex = index - 1 < 0 ? tOptions.value.length - 1 : index - 1;
        active.value = tOptions.value[newIndex].text;
      } else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
        const index = tOptions.value.findIndex((item) => item.text === active.value);
        const newIndex = index + 1 >= tOptions.value.length ? 0 : index + 1;
        active.value = tOptions.value[newIndex].text;
      } else if (e.code === 'Enter' || e.key === 'Enter') {
        emit('select', active.value, { e });
      }
    };

    watch(
      () => props.popupVisible,
      () => {
        if (props.popupVisible) {
          document.addEventListener('keydown', onKeyInnerPress);
        } else {
          document.removeEventListener('keydown', onKeyInnerPress);
        }
      },
      { immediate: true },
    );

    watch(
      () => props.value,
      () => {
        if (!props.value) {
          active.value = '';
        }
      },
      { immediate: true },
    );

    onBeforeMount(() => {
      document.removeEventListener('keydown', onKeyInnerPress);
    });

    return {
      classes,
      classPrefix,
      optionClasses,
      active,
      tOptions,
      onOptionClick,
    };
  },

  render() {
    if (!this.tOptions.length) return null;
    return (
      <ul class={this.classes}>
        {this.tOptions.map((item) => {
          const cls = [...this.optionClasses];
          if (item.text === this.active) {
            cls.push(`${this.classPrefix}-select-option--hover`);
          }
          let labelNode: any = item.label;
          if (isFunction(item.label)) {
            labelNode = item.label(h);
          } else if (this.$scopedSlots.option) {
            labelNode = this.$scopedSlots.option?.({ option: item });
          }
          const content = labelNode || item.text;
          return (
            <li key={item.text} class={cls} title={item.text} onClick={this.onOptionClick}>
              {typeof content === 'string' && this.highlightKeyword ? (
                <HighlightOption content={content} keyword={this.value} />
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    );
  },
});
