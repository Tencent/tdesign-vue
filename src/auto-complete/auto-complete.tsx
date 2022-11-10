import {
  computed, ref, defineComponent, toRefs,
} from '@vue/composition-api';
import props from './props';
import { TdAutoCompleteProps } from './type';
import Input, { InputProps } from '../input';
import Popup, { PopupProps } from '../popup';
import useCommonClassName from '../hooks/useCommonClassName';
import AutoCompleteOptionList from './option-list';
import useVModel from '../hooks/useVModel';
import { useConfig } from '../config-provider/useConfig';

export default defineComponent({
  name: 'TAutoComplete',

  props,

  setup(props: TdAutoCompleteProps, { emit }) {
    const { value } = toRefs(props);
    const [tValue, setTValue] = useVModel(value, props.defaultValue, props.onChange);
    const { classPrefix, sizeClassNames } = useCommonClassName();
    const { global } = useConfig('input');

    const popupVisible = ref();

    const getOverlayStyle = (trigger: HTMLElement, popupElement: HTMLElement) => {
      const triggerWidth = trigger.getBoundingClientRect().width || trigger.offsetWidth || trigger.clientWidth;
      const popupWidth = popupElement.getBoundingClientRect().width || popupElement.offsetWidth || popupElement.clientWidth;
      return {
        width: triggerWidth > popupWidth ? `${triggerWidth}px` : 'auto',
      };
    };

    const classes = computed(() => [`${classPrefix.value}-auto-complete`]);
    const popupClasses = computed(() => [`${classPrefix.value}-select__dropdown`]);
    const popupInnerClasses = computed(() => [`${classPrefix.value}-select__dropdown-inner`]);

    const onInputChange = (value: string, context: { e?: InputEvent | MouseEvent }) => {
      setTValue(value, context);
    };

    const innerInputProps = computed(() => {
      const tProps: InputProps = {
        value: tValue.value,
        size: props.size,
        ...props.inputProps,
      };
      return tProps;
    });

    const onInnerFocus: InputProps['onFocus'] = (value, context) => {
      popupVisible.value = true;
      emit('focus', { ...context, value });
      props.onFocus?.({ ...context, value });
    };

    const inputListeners = computed(() => ({
      change: onInputChange,
      focus: onInnerFocus,
    }));

    const onInnerSelect: TdAutoCompleteProps['onSelect'] = (value, context) => {
      popupVisible.value = false;
      setTValue(value, context);
      emit('select', value, context);
      props.onSelect?.(value, context);
    };

    const onPopupVisibleChange: PopupProps['onVisibleChange'] = (visible, { trigger }) => {
      if (trigger !== 'trigger-element-click') {
        popupVisible.value = visible;
      }
    };

    return {
      global,
      classes,
      classPrefix,
      popupClasses,
      popupInnerClasses,
      sizeClassNames,
      innerInputProps,
      inputListeners,
      tValue,
      popupVisible,
      onPopupVisibleChange,
      getOverlayStyle,
      onInnerSelect,
    };
  },

  render() {
    const listContent = (
      <AutoCompleteOptionList
        value={this.value}
        options={this.options}
        size={this.size}
        classPrefix={this.classPrefix}
        sizeClassNames={this.sizeClassNames}
        onSelect={this.onInnerSelect}
        popupVisible={this.popupVisible}
        highlightKeyword={this.highlightKeyword}
        filterable={this.filterable}
        filter={this.filter}
      />
    );
    return (
      <div class={this.classes}>
        <Popup
          visible={this.popupVisible}
          on={{ 'visible-change': this.onPopupVisibleChange }}
          overlayClassName={this.popupClasses}
          overlayInnerClassName={this.popupInnerClasses}
          trigger="click"
          placement="bottom-left"
          overlayInnerStyle={this.getOverlayStyle}
          hideEmptyPopup={true}
          content={listContent ? () => listContent : null}
        >
          <Input
            placeholder={this.placeholder ?? this.global.placeholder}
            on={this.inputListeners}
            props={this.innerInputProps}
          />
        </Popup>
      </div>
    );
  },
});
