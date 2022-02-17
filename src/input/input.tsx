import Vue, { CreateElement, VNode } from 'vue';
import { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';
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
}

export default mixins(getConfigReceiverMixins<InputInstance, InputConfig>('input')).extend({
  name: 'TInput',
  inheritAttrs: false,
  props: { ...props },
  data() {
    return {
      formDisabled: undefined,
      isHover: false,
      focused: false,
      renderType: this.type,
    };
  },
  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    showClear(): boolean {
      return this.value && !this.tDisabled && this.clearable && this.isHover;
    },
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.tDisabled,
        readonly: this.readonly,
        autocomplete: this.autocomplete,
        placeholder: this.placeholder ?? this.t(this.global.placeholder),
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
        },
      ];
    },
  },
  watch: {
    autofocus: {
      handler(val) {
        if (val === true) {
          this.$nextTick(() => {
            (this.$refs.refInputElem as HTMLInputElement).focus();
          });
        }
      },
      immediate: true,
    },
  },

  created() {
    this.composing = false;
  },

  methods: {
    mouseEvent(v: boolean) {
      this.isHover = v;
    },
    renderIcon(h: CreateElement, icon: string | Function | undefined, iconType: 'prefix-icon' | 'suffix-icon') {
      if (typeof icon === 'function') {
        return icon(h);
      }
      if (this.$scopedSlots[iconType]) {
        return this.$scopedSlots[iconType](null);
      }
      return null;
    },
    setInputValue(v: InputValue = ''): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      if (!input) return;
      const sV = String(v);
      if (input.value !== sV) {
        input.value = sV;
      }
    },
    focus(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.focus();
    },
    blur(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.blur();
    },
    handleInput(e: InputEvent): void {
      // 中文输入的时候inputType是insertCompositionText所以中文输入的时候禁止触发。
      const isCheckInputType = e.inputType && e.inputType === 'insertCompositionText';
      if (e.isComposing || isCheckInputType) return;
      this.inputValueChangeHandle(e);
    },

    handleKeydown(e: KeyboardEvent) {
      if (this.tDisabled) return;
      const code = e.code || e.key;
      if (code === 'Enter' || code === 'NumpadEnter') {
        emitEvent<Parameters<TdInputProps['onEnter']>>(this, 'enter', this.value, { e });
      } else {
        emitEvent<Parameters<TdInputProps['onKeydown']>>(this, 'keydown', this.value, { e });
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (this.tDisabled) return;
      emitEvent<Parameters<TdInputProps['onKeyup']>>(this, 'keyup', this.value, { e });
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.tDisabled) return;
      emitEvent<Parameters<TdInputProps['onKeypress']>>(this, 'keypress', this.value, { e });
    },
    onHandlePaste(e: ClipboardEvent) {
      if (this.tDisabled) return;
      // @ts-ignore
      const clipData = e.clipboardData || window.clipboardData;
      emitEvent<Parameters<TdInputProps['onPaste']>>(this, 'paste', { e, pasteValue: clipData?.getData('text/plain') });
    },
    emitPassword() {
      const { renderType } = this;
      const toggleType = renderType === 'password' ? 'text' : 'password';
      this.renderType = toggleType;
    },
    emitClear(e: MouseEvent) {
      emitEvent<Parameters<TdInputProps['onClear']>>(this, 'clear', { e });
      emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', '', { e });
      this.focus();
      this.emitFocus(e);
    },
    emitFocus(e: FocusEvent) {
      if (this.tDisabled) return;
      this.focused = true;
      emitEvent<Parameters<TdInputProps['onFocus']>>(this, 'focus', this.value, { e });
    },
    emitBlur(e: FocusEvent) {
      this.focused = false;
      emitEvent<Parameters<TdInputProps['onBlur']>>(this, 'blur', this.value, { e });
    },
    onCompositionend(e: InputEvent) {
      this.inputValueChangeHandle(e);
    },
    inputValueChangeHandle(e: InputEvent) {
      const { target } = e;
      let val = (target as HTMLInputElement).value;
      if (this.maxcharacter && this.maxcharacter >= 0) {
        const stringInfo = getCharacterLength(val, this.maxcharacter);
        val = typeof stringInfo === 'object' && stringInfo.characters;
      }
      emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', val, { e });
      // 受控，重要，勿删
      this.$nextTick(() => this.setInputValue(this.value));
    },

    onInputMouseenter(e: MouseEvent) {
      this.mouseEvent(true);
      this.onMouseenter?.({ e });
    },

    onInputMouseleave(e: MouseEvent) {
      this.mouseEvent(false);
      this.onMouseleave?.({ e });
    },
  },

  render(h: CreateElement): VNode {
    const inputEvents = getValidAttrs({
      focus: this.emitFocus,
      blur: this.emitBlur,
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

    if (this.showClear) {
      suffixIcon = <CloseCircleFilledIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitClear} />;
    }

    if (this.type === 'password') {
      if (this.renderType === 'password') {
        suffixIcon = <BrowseOffIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      } else if (this.renderType === 'text') {
        suffixIcon = <BrowseIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      }
    }

    const classes = [
      this.inputClasses,
      {
        [`${name}--prefix`]: prefixIcon || labelContent,
        [`${name}--suffix`]: suffixIcon || suffixContent,
      },
    ];
    const inputNode = (
      <div
        class={classes}
        onMouseenter={this.onInputMouseenter}
        onMouseleave={this.onInputMouseleave}
        {...{ attrs: wrapperAttrs, on: wrapperEvents }}
      >
        {prefixIcon ? <span class={[`${name}__prefix`, `${name}__prefix-icon`]}>{prefixIcon}</span> : null}
        {labelContent}
        <input
          {...{ attrs: this.inputAttrs, on: inputEvents }}
          ref="refInputElem"
          class={`${name}__inner`}
          value={this.value}
          onInput={this.handleInput}
          onCompositionend={this.onCompositionend}
        />
        {suffixContent}
        {suffixIcon ? (
          <span class={[`${name}__suffix`, `${name}__suffix-icon`, { [`${name}__clear`]: this.showClear }]}>
            {suffixIcon}
          </span>
        ) : null}
      </div>
    );

    const tips = renderTNodeJSX(this, 'tips');
    if (tips) {
      return (
        <div class={INPUT_WRAP_CLASS}>
          {inputNode}
          <div class={`${INPUT_TIPS_CLASS} ${prefix}-input__tips--${this.status || 'normal'}`}>{tips}</div>
        </div>
      );
    }
    return inputNode;
  },
});
