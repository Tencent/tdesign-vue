import {
  ref, computed, defineComponent, PropType, h, watch,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { CommonClassNameType } from '../hooks/useCommonClassName';
import { TdAutoCompleteProps } from './type';
import log from '../_common/js/log';

export default defineComponent({
  name: 'AutoCompleteOptionList',

  props: {
    classPrefix: String,
    sizeClassNames: Object as PropType<CommonClassNameType['sizeClassNames']>,
    size: String as PropType<TdAutoCompleteProps['size']>,
    options: Array as PropType<TdAutoCompleteProps['options']>,
    popupVisible: Boolean,
  },

  setup(props, { emit }) {
    const active = ref('');

    const classes = computed(() => `${props.classPrefix}-select__list`);
    const optionClasses = computed(() => [
      `${props.classPrefix}-select-option`,
      {
        [props.sizeClassNames[props.size]]: props.size,
      },
    ]);

    // 整理数据格式
    const tOptions = computed(() => props.options.map((item) => {
      if (typeof item === 'string') return { text: item, label: item };
      if (!item.text) {
        if (typeof item.label === 'string') {
          return {
            ...item,
            text: item.label,
          };
        }
        log.warn('AutoComplete', 'one of `label` and `text` must be a existed string.');
      }
      return item;
    }));

    const onOptionClick = (e: MouseEvent) => {
      const keyword = (e.target as HTMLElement).getAttribute('title');
      active.value = keyword;
      emit('select', keyword, { e });
    };

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

    return {
      classes,
      optionClasses,
      active,
      tOptions,
      onOptionClick,
    };
  },

  render() {
    return (
      <ul class={this.classes}>
        {this.tOptions.map((item) => {
          const cls = [...this.optionClasses];
          if (item.text === this.active) {
            cls.push(`${this.classPrefix}-select-option--hover`);
          }
          const label = isFunction(item.label) ? item.label(h) : item.label;
          return (
            <li class={cls} title={item.text} onClick={this.onOptionClick}>
              {item.text || label || this.$scopedSlots.label?.({ option: item })}
            </li>
          );
        })}
      </ul>
    );
  },
});
