import Vue, { CreateElement, VNode } from 'vue';
import { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import { InputValue, TdInputProps } from './type';
import { getCharacterLength, omit } from '../utils/helper';
import getConfigReceiverMixins, { InputConfig } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import { ClassName } from '../common';
import CLASSNAMES from '../utils/classnames';
import { emitEvent } from '../utils/event';
import { prefix } from '../config';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import FormItem from '../form/form-item';

const name = `${prefix}-input`;
const INPUT_WRAP_CLASS = `${prefix}-input__wrap`;
const INPUT_TIPS_CLASS = `${prefix}-input__tips`;

function getValidAttrs(obj: object): object {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

interface InputInstance extends Vue {
  composing: boolean;
  tFormItem: InstanceType<typeof FormItem>;
}

export default mixins(getConfigReceiverMixins<InputInstance, InputConfig>('input')).extend({
  name: 'TInput',
  inheritAttrs: false,
  props: {
    ...props,
    showInput: {
      // 控制透传readonly同时是否展示input 默认保留 因为正常Input需要撑开宽度
      type: Boolean,
      default: true,
    },
    keepWrapperWidth: {
      // 控制透传autoWidth之后是否容器宽度也自适应 多选等组件需要用到自适应但也需要保留宽度
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formDisabled: undefined,
      isHover: false,
      focused: false,
      renderType: this.type,
      inputValue: this.value,
      composingRef: false,
      composingRefValue: this.value,
    };
  },
  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    tPlaceholder(): string {
      return this.placeholder ?? this.t(this.global.placeholder);
    },
    showClear(): boolean {
      return (
        ((this.value && !this.disabled && this.clearable && !this.readonly) || this.showClearIconOnEmpty)
        && this.isHover
      );
    },
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.tDisabled,
        readonly: this.readonly,
        autocomplete: this.autocomplete ?? this.global.autocomplete,
        placeholder: this.tPlaceholder,
        maxlength: this.maxlength,
        name: this.name || undefined,
        type: this.renderType,
        unselectable: this.readonly ? 'on' : 'off',
      });
    },
    inputClasses(): ClassName {
      return [
        name,
        CLASSNAMES.SIZE[this.size] || '',
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
          [CLASSNAMES.STATUS.focused]: this.focused,
          [`${prefix}-is-${this.status}`]: this.status,
          [`${prefix}-align-${this.align}`]: this.align !== 'left',
          [`${prefix}-is-disabled`]: this.tDisabled,
          [`${prefix}-is-readonly`]: this.readonly,
          [`${name}--focused`]: this.focused,
          [`${name}--auto-width`]: this.autoWidth && !this.keepWrapperWidth,
        },
      ];
    },
  },
  watch: {
    autofocus: {
      handler(val) {
        if (val === true) {
          this.$nextTick(() => {
            const input = this.$refs.inputRef as HTMLInputElement;
            input?.focus();
          });
        }
      },
      immediate: true,
    },
    value: {
      handler(val) {
        this.inputValue = val;
      },
      immediate: true,
    },
    type: {
      handler(val) {
        this.renderType = val;
      },
      immediate: true,
    },
  },

  created() {
    this.composing = false;
    if (this.autoWidth) {
      this.addListeners();
    }
  },
  methods: {
    addListeners() {
      this.$watch(
        () => this.value + this.placeholder,
        () => {
          if (!this.autoWidth) return;
          this.$nextTick(() => {
            this.updateInputWidth();
          });
        },
        { immediate: true },
      );
    },
    mouseEvent(v: boolean) {
      this.isHover = v;
    },
    renderIcon(h: CreateElement, icon: string | Function | undefined, iconType: 'prefix-icon' | 'suffix-icon') {
      if (typeof icon === 'function') {
        return icon(h);
      }

      // 插槽名称为中划线
      if (this.$scopedSlots[kebabCase(iconType)]) {
        return this.$scopedSlots[kebabCase(iconType)](null);
      }
      // 插槽名称为驼峰
      if (this.$scopedSlots[camelCase(iconType)]) {
        return this.$scopedSlots[camelCase(iconType)](null);
      }

      return null;
    },
    setInputValue(v: InputValue = ''): void {
      const input = this.$refs.inputRef as HTMLInputElement;
      if (!input) return;
      const sV = String(v);
      if (input.value !== sV) {
        input.value = sV;
      }
    },
    focus(): void {
      const input = this.$refs.inputRef as HTMLInputElement;
      input?.focus();
    },
    blur(): void {
      const input = this.$refs.inputRef as HTMLInputElement;
      input?.blur();
    },
    handleKeydown(e: KeyboardEvent) {
      if (this.tDisabled) return;
      const code = e.code || e.key;
      const {
        currentTarget: { value },
      }: any = e;
      if (code === 'Enter' || code === 'NumpadEnter') {
        emitEvent<Parameters<TdInputProps['onEnter']>>(this, 'enter', value, { e });
      } else {
        emitEvent<Parameters<TdInputProps['onKeydown']>>(this, 'keydown', value, { e });
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (this.tDisabled) return;
      const {
        currentTarget: { value },
      }: any = e;
      if (e.key === 'Process') {
        return;
      }
      emitEvent<Parameters<TdInputProps['onKeyup']>>(this, 'keyup', value, { e });
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.tDisabled) return;
      const {
        currentTarget: { value },
      }: any = e;
      emitEvent<Parameters<TdInputProps['onKeypress']>>(this, 'keypress', value, { e });
    },
    onHandlePaste(e: ClipboardEvent) {
      if (this.tDisabled) return;
      // @ts-ignore
      const clipData = e.clipboardData || window.clipboardData;
      emitEvent<Parameters<TdInputProps['onPaste']>>(this, 'paste', { e, pasteValue: clipData?.getData('text/plain') });
    },
    onHandleMousewheel(e: WheelEvent) {
      emitEvent<Parameters<TdInputProps['onWheel']>>(this, 'wheel', { e });
    },
    emitPassword() {
      const { renderType } = this;
      const toggleType = renderType === 'password' ? 'text' : 'password';
      this.renderType = toggleType;
    },
    emitClear(e: MouseEvent) {
      emitEvent<Parameters<TdInputProps['onClear']>>(this, 'clear', { e });
      emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', '', { e });
    },
    emitFocus(e: FocusEvent) {
      this.inputValue = this.value;
      if (this.tDisabled) return;
      this.focused = true;
      emitEvent<Parameters<TdInputProps['onFocus']>>(this, 'focus', this.value, { e });
    },
    formatAndEmitBlur(e: FocusEvent) {
      if (this.format) {
        this.inputValue = this.format(this.value);
      }
      this.focused = false;
      this.tFormItem?.validate('blur');
      emitEvent<Parameters<TdInputProps['onBlur']>>(this, 'blur', this.value, { e });
    },
    compositionstartHandler(e: CompositionEvent) {
      this.composingRef = true;
      const {
        currentTarget: { value },
      }: any = e;
      this.composingRefValue = value;
      this?.onCompositionstart?.(value, { e });
    },
    compositionendHandler(e: CompositionEvent) {
      const {
        currentTarget: { value },
      }: any = e;
      if (this.composingRef) {
        this.composingRef = false;
        this.handleInput(e);
      }
      this.composingRefValue = '';
      this?.onCompositionend?.(value, { e });
    },
    onRootClick(e: MouseEvent) {
      (this.$refs.inputRef as HTMLInputElement)?.focus();
      this.$emit('click', e);
    },
    handleInput(e: InputEvent | CompositionEvent) {
      let {
        currentTarget: { value: val },
      }: any = e;
      if (this.composingRef) {
        this.composingRefValue = val;
      } else {
        if (this.maxcharacter && this.maxcharacter >= 0) {
          const stringInfo = getCharacterLength(val, this.maxcharacter);
          val = typeof stringInfo === 'object' && stringInfo.characters;
        }
        emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', val, { e } as { e: MouseEvent | InputEvent });
        // 受控，重要，勿删
        this.$nextTick(() => {
          this.setInputValue(this.value);
        });
      }
    },

    onInputMouseenter(e: MouseEvent) {
      this.mouseEvent(true);
      this.onMouseenter?.({ e });
    },

    onInputMouseleave(e: MouseEvent) {
      this.mouseEvent(false);
      this.onMouseleave?.({ e });
    },

    updateInputWidth() {
      const pre = this.$refs.inputPreRef as HTMLSpanElement;
      if (!pre) return;
      const width = pre.offsetWidth;
      if (this.$refs.inputRef) {
        (this.$refs.inputRef as HTMLInputElement).style.width = `${width}px`;
      }
    },
  },

  render(h: CreateElement): VNode {
    const inputEvents = getValidAttrs({
      focus: this.emitFocus,
      blur: this.formatAndEmitBlur,
      keydown: this.handleKeydown,
      keyup: this.handleKeyUp,
      keypress: this.handleKeypress,
      paste: this.onHandlePaste,
      // input的change事件是失去焦点或者keydown的时候执行。这与api定义的change不符，所以不做任何变化。
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      change: () => {},
    });

    const wrapperAttrs = omit(this.$attrs, Object.keys(this.inputAttrs));
    const wrapperEvents = omit(this.$listeners, [...Object.keys(inputEvents), 'input', 'paste']);

    const prefixIcon = this.renderIcon(h, this.prefixIcon, 'prefix-icon');
    let suffixIcon = this.renderIcon(h, this.suffixIcon, 'suffix-icon');

    const label = renderTNodeJSX(this, 'label');
    const suffix = renderTNodeJSX(this, 'suffix');

    const labelContent = label ? <div class={`${name}__prefix`}>{label}</div> : null;
    const suffixContent = suffix ? <div class={`${name}__suffix`}>{suffix}</div> : null;

    if (this.type === 'password') {
      if (this.renderType === 'password') {
        suffixIcon = <BrowseOffIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      } else if (this.renderType === 'text') {
        suffixIcon = <BrowseIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      }
    }

    if (this.showClear) {
      suffixIcon = <CloseCircleFilledIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitClear} />;
    }

    const classes = [
      this.inputClasses,
      this.inputClass,
      {
        [`${name}--prefix`]: prefixIcon || labelContent,
        [`${name}--suffix`]: suffixIcon || suffixContent,
      },
    ];
    const inputNode = (
      <div
        class={classes}
        onClick={this.onRootClick}
        {...{ attrs: wrapperAttrs, on: wrapperEvents }}
        onMouseenter={this.onInputMouseenter}
        onMouseleave={this.onInputMouseleave}
        onwheel={this.onHandleMousewheel}
      >
        {prefixIcon ? <span class={[`${name}__prefix`, `${name}__prefix-icon`]}>{prefixIcon}</span> : null}
        {labelContent}
        {this.showInput && (
          <input
            {...{ attrs: this.inputAttrs, on: inputEvents }}
            ref="inputRef"
            class={`${name}__inner`}
            value={this.composingRef ? this.composingRefValue : this.inputValue}
            onInput={this.handleInput}
            onCompositionstart={this.compositionstartHandler}
            onCompositionend={this.compositionendHandler}
          />
        )}
        {this.autoWidth && (
          <span ref="inputPreRef" class={`${prefix}-input__input-pre`}>
            {this.value || this.tPlaceholder}
          </span>
        )}
        {suffixContent}
        {suffixIcon ? (
          <span class={[`${name}__suffix`, `${name}__suffix-icon`, { [`${name}__clear`]: this.showClear }]}>
            {suffixIcon}
          </span>
        ) : null}
      </div>
    );

    const tips = renderTNodeJSX(this, 'tips');
    return (
      <div class={INPUT_WRAP_CLASS}>
        {inputNode}
        {tips && <div class={`${INPUT_TIPS_CLASS} ${prefix}-input__tips--${this.status || 'normal'}`}>{tips}</div>}
      </div>
    );
  },
});
