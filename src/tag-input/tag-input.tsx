import {
  defineComponent, computed, toRefs, ref, nextTick,
} from '@vue/composition-api';

import { CloseCircleFilledIcon as TdCloseCircleFilledIcon } from 'tdesign-icons-vue';
import TInput, { InputProps, InputValue } from '../input';
import { TdTagInputProps } from './type';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import useTagScroll from './hooks/useTagScroll';
import useTagList from './useTagList';
import useHover from './hooks/useHover';
import useDefaultValue from '../hooks/useDefaultValue';
import useDragSorter from './hooks/useDragSorter';
import { useGlobalIcon } from '../hooks/useGlobalIcon';
import { usePrefixClass } from '../config-provider/useConfig';

export default defineComponent({
  name: 'TTagInput',

  props: { ...props },

  setup(props: TdTagInputProps, context) {
    const { inputValue, inputProps } = toRefs(props);
    // 除了绑定 DOM 的变量，其他的一律不可使用 Ref 作为后缀
    const isComposition = ref(false);
    const COMPONENT_NAME = usePrefixClass('tag-input');
    const classPrefix = usePrefixClass();

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
    const { isHover, addHover, cancelHover } = useHover(
      {
        readonly,
        disabled,
        onMouseenter: props.onMouseenter,
        onMouseleave: props.onMouseleave,
      },
      context,
    );

    // 这里不需要响应式，因此直接传递参数
    const { getDragProps } = useDragSorter(
      {
        ...props,
        sortOnDraggable: props.dragSort,
        onDragOverCheck: {
          x: true,
          targetClassNameRegExp: new RegExp(`^${classPrefix.value}-tag`),
        },
      },
      context,
    );

    const {
      scrollToRight, onWheel, scrollToRightOnEnter, scrollToLeftOnLeave, tagInputRef,
    } = useTagScroll(props);
    // handle tag add and remove
    const {
      tagValue, onInnerEnter, onInputBackspaceKeyUp, onInputBackspaceKeyDown, clearAll, renderLabel, onClose,
    } = useTagList(props, context, getDragProps);

    const { CloseCircleFilledIcon } = useGlobalIcon({ CloseCircleFilledIcon: TdCloseCircleFilledIcon });

    const classes = computed(() => {
      const isEmpty = !(Array.isArray(tagValue.value) && tagValue.value.length);
      return [
        COMPONENT_NAME.value,
        {
          [`${COMPONENT_NAME.value}--break-line`]: excessTagsDisplayType.value === 'break-line',
          [`${classPrefix.value}-is-empty`]: isEmpty,
          [`${classPrefix.value}-tag-input--with-tag`]: !isEmpty,
        },
      ];
    });

    const tagInputPlaceholder = computed(() => (!tagValue.value?.length ? placeholder.value : ''));

    const showClearIcon = computed(() => Boolean(
      !readonly.value
          && !disabled.value
          && clearable.value
          && isHover.value
          && (tagValue.value?.length || tInputValue.value),
    ));

    const onInputCompositionstart = (value: InputValue, context: { e: CompositionEvent }) => {
      isComposition.value = true;
      inputProps.value?.onCompositionstart?.(value, context);
    };

    const onInputCompositionend = (value: InputValue, context: { e: CompositionEvent }) => {
      isComposition.value = false;
      inputProps.value?.onCompositionend?.(value, context);
    };

    const onInputEnter = (value: InputValue, context: { e: KeyboardEvent }) => {
      // 阻止 Enter 默认行为，避免在 Form 中触发 submit 事件
      context.e?.preventDefault();
      setTInputValue('', { e: context.e, trigger: 'enter' });
      !isComposition.value && onInnerEnter(value, context);
      nextTick(() => {
        scrollToRight();
        isComposition.value = false;
      });
    };

    const onInnerClick: InputProps['onClick'] = (params) => {
      props.onClick?.(params);
      context.emit('click', params);
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
      classPrefix,
      classes,
      componentName: COMPONENT_NAME,
      setTInputValue,
      addHover,
      cancelHover,
      onInputEnter,
      onInnerEnter,
      onInputBackspaceKeyUp,
      onInputBackspaceKeyDown,
      renderLabel,
      onWheel,
      scrollToRightOnEnter,
      scrollToLeftOnLeave,
      onClearClick,
      onInnerClick,
      onClose,
      onInputCompositionstart,
      onInputCompositionend,
      CloseCircleFilledIcon,
    };
  },

  render(h) {
    const { CloseCircleFilledIcon } = this;
    const suffixIconNode = this.showClearIcon ? (
      <CloseCircleFilledIcon class={`${this.componentName}__suffix-clear`} onClick={this.onClearClick} />
    ) : (
      renderTNodeJSX(this, 'suffixIcon')
    );
    const suffixClass = `${this.classPrefix}-tag-input__with-suffix-icon`;
    if (suffixIconNode && !this.classes.includes(suffixClass)) {
      this.classes.push(suffixClass);
    }
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
        readonly={this.readonly || this.inputProps?.readonly}
        inputClass={this.inputProps?.inputClass} // 展开无效 需直接透传
        value={this.tInputValue}
        showInput={!this.inputProps?.readonly || !this.tagValue || !this.tagValue?.length}
        keepWrapperWidth={!this.autoWidth}
        autoWidth={true}
        size={this.size}
        disabled={this.disabled}
        label={() => this.renderLabel({ displayNode, label }, h)}
        class={this.classes}
        tips={this.tips}
        status={this.status}
        placeholder={this.tagInputPlaceholder}
        suffix={this.suffix}
        suffixIcon={() => suffixIconNode}
        props={this.inputProps}
        scopedSlots={this.$scopedSlots}
        on={{
          change: (val: InputValue, context?: { e?: InputEvent | MouseEvent }) => {
            this.setTInputValue(val, { ...context, trigger: 'input' });
          },
          enter: this.onInputEnter,
          keyup: this.onInputBackspaceKeyUp,
          keydown: this.onInputBackspaceKeyDown,
          mouseenter: (context: { e: MouseEvent }) => {
            this.addHover(context);
            this.scrollToRightOnEnter();
          },
          mouseleave: (context: { e: MouseEvent }) => {
            this.cancelHover(context);
            this.scrollToLeftOnLeave();
          },
          focus: (inputValue: InputValue, context: { e: MouseEvent }) => {
            this.onFocus?.(this.tagValue, { e: context.e, inputValue });
            this.$emit('focus', this.tagValue, { e: context.e, inputValue });
          },
          blur: (inputValue: InputValue, context: { e: MouseEvent }) => {
            this.setTInputValue('', { e: context.e, trigger: 'blur' });
            this.onBlur?.(this.tagValue, { e: context.e, inputValue: '' });
            this.$emit('blur', this.tagValue, { e: context.e, inputValue: '' });
          },
          paste: (context: { e: ClipboardEvent; pasteValue: string }) => {
            this.onPaste?.(context);
            this.$emit('paste', context);
          },
          click: this.onInnerClick,
          compositionstart: this.onInputCompositionstart,
          compositionend: this.onInputCompositionend,
          mousewheel: this.onWheel,
        }}
      />
    );
  },
});
