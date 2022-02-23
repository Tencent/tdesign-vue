import {
  defineComponent, ref, computed, toRefs, nextTick,
} from '@vue/composition-api';

// components
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import TInput, { InputValue } from '../input';

// utils
import { TdTagInputProps } from './type';
import props from './props';
import { prefix } from '../config';
import { renderTNodeJSX } from '../utils/render-tnode';

// hooks
import useTagScroll from './useTagScroll';
import useTagList from './useTagList';
import useHover from './useHover';

// constants class
const NAME_CLASS = `${prefix}-tag-input`;
const CLEAR_CLASS = `${prefix}-tag-input__suffix-clear`;
const BREAK_LINE_CLASS = `${prefix}-tag-input--break-line`;

export default defineComponent({
  name: 'TTagInput',

  props: { ...props },

  setup(props: TdTagInputProps, context) {
    const tInputValue = ref<InputValue>();
    const {
      excessTagsDisplayType, readonly, disabled, clearable, placeholder,
    } = toRefs(props);
    const { isHover, addHover, cancelHover } = useHover({
      readonly: props.readonly,
      disabled: props.disabled,
      onMouseenter: props.onMouseenter,
      onMouseleave: props.onMouseleave,
    });
    const {
      scrollToRight, onWheel, scrollToRightOnEnter, scrollToLeftOnLeave, tagInputRef,
    } = useTagScroll(props);
    // handle tag add and remove
    const {
      tagValue, onInnerEnter, onInputBackspaceKeyUp, clearAll, renderLabel, onClose,
    } = useTagList(
      props,
      context,
    );

    const classes = computed(() => [
      NAME_CLASS,
      {
        [BREAK_LINE_CLASS]: excessTagsDisplayType.value === 'break-line',
      },
    ]);

    const tagInputPlaceholder = computed(() => (isHover.value || !tagValue.value?.length ? placeholder.value : ''));

    const showClearIcon = computed(() => Boolean(!readonly.value && !disabled.value && clearable.value && isHover.value && tagValue.value?.length));

    const onInputEnter = (value: InputValue, context: { e: KeyboardEvent }) => {
      tInputValue.value = '';
      onInnerEnter(value, context);
      nextTick(() => {
        scrollToRight();
      });
    };

    const onClick = () => {
      tagInputRef.value.focus();
    };

    const onClearClick = (context: { e: MouseEvent }) => {
      clearAll(context);
      tInputValue.value = '';
    };

    return {
      tagValue,
      tInputValue,
      isHover,
      tagInputPlaceholder,
      showClearIcon,
      tagInputRef,
      addHover,
      cancelHover,
      onInputEnter,
      onInnerEnter,
      onInputBackspaceKeyUp,
      renderLabel,
      onWheel,
      scrollToRightOnEnter,
      scrollToLeftOnLeave,
      onClick,
      onClearClick,
      onClose,
      classes,
    };
  },

  render(h) {
    const suffixIconNode = this.showClearIcon ? (
      <CloseCircleFilledIcon class={CLEAR_CLASS} onClick={this.clearAll} />
    ) : (
      renderTNodeJSX(this, 'suffixIcon')
    );
    // 自定义 Tag 节点
    const displayNode = renderTNodeJSX(this, 'valueDisplay', {
      params: {
        value: this.tagValue,
        onClose: (index: number, item: any) => this.onClose({ index, item }),
      },
    });
    // 左侧文本
    const label = renderTNodeJSX(this, 'label', { silent: true });
    return (
      <TInput
        ref="tagInputRef"
        {...this.inputProps}
        value={this.tInputValue}
        onChange={(val: InputValue) => {
          this.tInputValue = val;
        }}
        onMousewheel={this.onWheel}
        size={this.size}
        readonly={this.readonly}
        disabled={this.disabled}
        label={() => this.renderLabel({ displayNode, label }, h)}
        class={this.classes}
        tips={this.tips}
        status={this.status}
        placeholder={this.tagInputPlaceholder}
        suffix={this.suffix}
        suffixIcon={() => suffixIconNode}
        // onPaste={this.onPaste}
        onEnter={this.onInputEnter}
        onKeyup={this.onInputBackspaceKeyUp}
        onMouseenter={(context: { e: MouseEvent }) => {
          this.addHover(context);
          this.scrollToRightOnEnter();
        }}
        onMouseleave={(context: { e: MouseEvent }) => {
          this.cancelHover(context);
          this.scrollToLeftOnLeave();
        }}
        onFocus={(inputValue: InputValue, context: { e: MouseEvent }) => {
          this.onFocus?.(this.tagValue, { e: context.e, inputValue });
        }}
        onBlur={(inputValue: InputValue, context: { e: MouseEvent }) => {
          this.onBlur?.(this.tagValue, { e: context.e, inputValue });
        }}
      />
    );
  },
});
