import {
  defineComponent, computed, toRefs, ref, nextTick,
} from '@vue/composition-api';

import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import TInput, { InputValue } from '../input';
import { TdTagInputProps } from './type';
import props from './props';
import { prefix } from '../config';
import { renderTNodeJSX } from '../utils/render-tnode';
import useTagScroll from './hooks/useTagScroll';
import useTagList from './useTagList';
import useHover from './hooks/useHover';
import useDefaultValue from '../hooks/useDefaultValue';
import useDragSorter from './hooks/useDragSorter';

// constants class
const NAME_CLASS = `${prefix}-tag-input`;
const CLEAR_CLASS = `${prefix}-tag-input__suffix-clear`;
const BREAK_LINE_CLASS = `${prefix}-tag-input--break-line`;

export default defineComponent({
  name: 'TTagInput',

  props: { ...props },

  setup(props: TdTagInputProps, context) {
    const { inputValue } = toRefs(props);
    const { inputProps } = props;
    const isCompositionRef = ref(false);
    const [tInputValue, setTInputValue] = useDefaultValue(
      inputValue,
      props.defaultInputValue,
      props.onInputChange,
      'inputValue',
      'input-change',
    );

    const {
      excessTagsDisplayType, readonly, disabled, clearable, placeholder,
    } = toRefs(props);
    const { isHover, addHover, cancelHover } = useHover({
      readonly: props.readonly,
      disabled: props.disabled,
      onMouseenter: props.onMouseenter,
      onMouseleave: props.onMouseleave,
    });

    // 这里不需要响应式，因此直接传递参数
    const { getDragProps } = useDragSorter(
      {
        ...props,
        sortOnDraggable: props.dragSort,
        onDragOverCheck: {
          x: true,
          targetClassNameRegExp: new RegExp(`^${prefix}-tag`),
        },
      },
      context,
    );

    const {
      scrollToRight, onWheel, scrollToRightOnEnter, scrollToLeftOnLeave, tagInputRef,
    } = useTagScroll(props);
    // handle tag add and remove
    const {
      tagValue, onInnerEnter, onInputBackspaceKeyUp, clearAll, renderLabel, onClose,
    } = useTagList(
      props,
      getDragProps,
    );

    const classes = computed(() => [
      NAME_CLASS,
      {
        [BREAK_LINE_CLASS]: excessTagsDisplayType.value === 'break-line',
      },
    ]);

    const tagInputPlaceholder = computed(() => (!tagValue.value?.length ? placeholder.value : ''));

    const showClearIcon = computed(() => Boolean(
      !readonly.value
          && !disabled.value
          && clearable.value
          && isHover.value
          && (tagValue.value?.length || tInputValue.value),
    ));

    const onInputCompositionstart = (value: InputValue, context: { e: CompositionEvent }) => {
      isCompositionRef.value = true;
      inputProps?.onCompositionstart?.(value, context);
    };

    const onInputCompositionend = (value: InputValue, context: { e: CompositionEvent }) => {
      isCompositionRef.value = false;
      inputProps?.onCompositionend?.(value, context);
    };

    const onInputEnter = (value: InputValue, context: { e: KeyboardEvent }) => {
      // 阻止 Enter 默认行为，避免在 Form 中触发 submit 事件
      context.e?.preventDefault();
      setTInputValue('', { e: context.e, trigger: 'enter' });
      !isCompositionRef.value && onInnerEnter(value, context);
      nextTick(() => {
        scrollToRight();
        isCompositionRef.value = false;
      });
    };

    const onClick = () => {
      tagInputRef.value.focus();
    };

    const onClearClick = (ctx: { e: MouseEvent }) => {
      clearAll(ctx);
      setTInputValue('', { e: ctx.e, trigger: 'clear' });
      props.onClear?.(ctx);
      context.emit('clear', ctx);
    };

    return {
      tagValue,
      tInputValue,
      isHover,
      tagInputPlaceholder,
      showClearIcon,
      tagInputRef,
      setTInputValue,
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
      onInputCompositionstart,
      onInputCompositionend,
    };
  },

  render(h) {
    const suffixIconNode = this.showClearIcon ? (
      <CloseCircleFilledIcon class={CLEAR_CLASS} onClick={this.onClearClick} />
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
        readonly={this.inputProps?.readonly}
        inputClass={this.inputProps?.inputClass} // 展开无效 需直接透传
        value={this.tInputValue}
        onChange={(val: InputValue, context?: { e?: InputEvent | MouseEvent }) => {
          this.setTInputValue(val, { ...context, trigger: 'input' });
        }}
        showInput={!this.inputProps?.readonly || !this.tagValue || !this.tagValue?.length}
        keepWrapperWidth={true}
        onMousewheel={this.onWheel}
        autoWidth={this.autoWidth}
        size={this.size}
        disabled={this.disabled}
        label={() => this.renderLabel({ displayNode, label }, h)}
        class={this.classes}
        tips={this.tips}
        status={this.status}
        placeholder={this.tagInputPlaceholder}
        suffix={this.suffix}
        suffixIcon={() => suffixIconNode}
        {...{
          props: {
            ...this.inputProps,
            onEnter: this.onInputEnter,
            onKeyup: this.onInputBackspaceKeyUp,
            onMouseenter: (context: { e: MouseEvent }) => {
              this.addHover(context);
              this.scrollToRightOnEnter();
            },
            onMouseleave: (context: { e: MouseEvent }) => {
              this.cancelHover(context);
              this.scrollToLeftOnLeave();
            },
            onFocus: (inputValue: InputValue, context: { e: MouseEvent }) => {
              this.onFocus?.(this.tagValue, { e: context.e, inputValue });
              this.$emit('focus', this.tagValue, { e: context.e, inputValue });
            },
            onBlur: (inputValue: InputValue, context: { e: MouseEvent }) => {
              this.onBlur?.(this.tagValue, { e: context.e, inputValue });
              this.$emit('blur', this.tagValue, { e: context.e, inputValue });
            },
            onPaste: (context: { e: ClipboardEvent; pasteValue: string }) => {
              this.onPaste?.(context);
              this.$emit('paste', context);
            },
          },
        }}
        onCompositionstart={this.onInputCompositionstart}
        onCompositionend={this.onInputCompositionend}
      />
    );
  },
});
