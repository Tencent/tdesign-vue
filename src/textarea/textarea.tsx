import Vue, { VueConstructor } from 'vue';
import isFunction from 'lodash/isFunction';
import { getUnicodeLength, limitUnicodeMaxLength } from '../_common/js/utils/helper';
import { getPropsApiByEvent, getCharacterLength } from '../utils/helper';
import calcTextareaHeight from './calcTextareaHeight';
import { renderTNodeJSX } from '../utils/render-tnode';
import { ClassName } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

import props from './props';
import type { TextareaValue } from './type';

const classPrefixMixins = getClassPrefixMixins('textarea');

function getValidAttrs(obj: object): object {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
export interface Textarea extends Vue {
  tFormItem: {
    validate(trigger: string): Promise<any>;
  };
}

export default mixins(Vue as VueConstructor<Textarea>, classPrefixMixins).extend({
  name: 'TTextarea',
  props: {
    ...props,
  },
  inject: {
    tFormItem: { default: undefined },
  },
  data() {
    return {
      formDisabled: undefined,
      focused: false,
      mouseHover: false,
      textareaStyle: {},
      isComposing: false,
    };
  },

  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    textareaClasses(): ClassName {
      return [
        this.componentName,
        {
          [`${this.classPrefix}-is-disabled`]: this.tDisabled,
          [`${this.classPrefix}-is-readonly`]: this.readonly,
        },
      ];
    },
    limitClasses(): ClassName {
      return [
        `${this.componentName}__limit`,
        {
          [`${this.classPrefix}-is-disabled`]: this.tDisabled,
        },
      ];
    },
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.tDisabled,
        readonly: this.readonly,
        placeholder: this.placeholder,
        name: this.name || undefined,
        unselectable: this.readonly ? 'on' : 'off',
      });
    },
    characterNumber(): number {
      const characterInfo = getCharacterLength(String(this.value || ''));
      if (typeof characterInfo === 'object') {
        return characterInfo.length;
      }
      return characterInfo;
    },
  },
  mounted() {
    this.adjustTextareaHeight();
  },

  watch: {
    autofocus: {
      handler(val) {
        if (val === true) {
          this.$nextTick(() => {
            const textArea = this.$refs.refTextareaElem as HTMLInputElement;
            textArea?.focus();
          });
        }
      },
      immediate: true,
    },
    value: {
      handler() {
        this.$nextTick(() => this.adjustTextareaHeight());
      },
      immediate: true,
    },
  },

  methods: {
    adjustTextareaHeight() {
      if (!this.$refs.refTextareaElem) return;
      if (this.autosize === true) {
        this.textareaStyle = calcTextareaHeight(this.$refs.refTextareaElem as HTMLTextAreaElement);
      } else if (this.autosize && typeof this.autosize === 'object') {
        this.textareaStyle = calcTextareaHeight(
          this.$refs.refTextareaElem as HTMLTextAreaElement,
          this.autosize?.minRows,
          this.autosize?.maxRows,
        );
      } else if (this.$attrs.rows) {
        this.textareaStyle = { height: 'auto', minHeight: 'auto' };
      }
    },
    emitEvent(name: string, value: string | number, context: object) {
      this.$emit(name, value, context);
      const handleName = getPropsApiByEvent(name);
      isFunction(this[handleName]) && this[handleName](value, context);
    },
    focus(): void {
      const textArea = this.$refs.refTextareaElem as HTMLInputElement;
      textArea?.focus();
    },
    blur(): void {
      const textArea = this.$refs.refTextareaElem as HTMLInputElement;
      textArea?.blur();
    },
    handleInput(e: any): void {
      this.inputValueChangeHandle(e);
    },
    onCompositionstart() {
      this.isComposing = true;
    },
    onCompositionend(e: InputEvent) {
      this.isComposing = false;
      this.inputValueChangeHandle(e);
    },
    inputValueChangeHandle(e: InputEvent) {
      const { target } = e;
      let val = (target as HTMLInputElement).value;
      if (this.maxlength) {
        val = limitUnicodeMaxLength(val, Number(this.maxlength));
      }
      if (this.maxcharacter && this.maxcharacter >= 0) {
        const stringInfo = getCharacterLength(val, this.maxcharacter);
        val = typeof stringInfo === 'object' && stringInfo.characters;
      }
      this.$emit('input', val);
      // 中文输入时不触发 onChange
      !this.isComposing && this.emitEvent('change', val, { e });

      this.$nextTick(() => this.setInputValue(val));
      this.adjustTextareaHeight();
    },

    setInputValue(v: TextareaValue = ''): void {
      const textareaElem = this.$refs.refTextareaElem as HTMLInputElement;
      const sV = String(v);
      if (!textareaElem) {
        return;
      }
      if (textareaElem.value !== sV) {
        textareaElem.value = sV;
      }
    },
    emitKeyDown(e: KeyboardEvent) {
      if (this.tDisabled) return;
      this.emitEvent('keydown', this.value, { e });
    },
    emitKeyUp(e: KeyboardEvent) {
      if (this.tDisabled) return;
      this.emitEvent('keyup', this.value, { e });
    },
    emitKeypress(e: KeyboardEvent) {
      if (this.tDisabled) return;
      this.emitEvent('keypress', this.value, { e });
    },
    emitFocus(e: FocusEvent) {
      if (this.tDisabled) return;
      this.focused = true;
      this.emitEvent('focus', this.value, { e });
    },
    emitBlur(e: FocusEvent) {
      this.focused = false;
      this.tFormItem?.validate('blur');
      this.emitEvent('blur', this.value, { e });
    },
  },

  render() {
    const inputEvents = getValidAttrs({
      focus: this.emitFocus,
      blur: this.emitBlur,
      keydown: this.emitKeyDown,
      keyup: this.emitKeyUp,
      keypress: this.emitKeypress,
    });
    const classes = [
      `${this.componentName}__inner`,
      {
        [`${this.classPrefix}-is-${this.status}`]: this.status,
        [this.commonStatusClassName.disabled]: this.tDisabled,
        [this.commonStatusClassName.focused]: this.focused,
        [`${this.classPrefix}-resize-none`]: typeof this.autosize === 'object',
      },
    ];
    const tips = renderTNodeJSX(this, 'tips');

    const textTips = tips && (
      <div class={[`${this.componentName}__tips`, `${this.componentName}__tips--${this.status || 'normal'}`]}>
        {tips}
      </div>
    );

    const limitText = (this.maxcharacter && <span class={this.limitClasses}>{`${this.characterNumber}/${this.maxcharacter}`}</span>)
      || (!this.maxcharacter && this.maxlength && (
        <span class={this.limitClasses}>{`${this.value ? getUnicodeLength(String(this.value)) : 0}/${
          this.maxlength
        }`}</span>
      ));

    return (
      <div class={this.textareaClasses}>
        <textarea
          onInput={this.handleInput}
          onCompositionstart={this.onCompositionstart}
          onCompositionend={this.onCompositionend}
          {...{ attrs: { ...this.$attrs, ...this.inputAttrs }, on: inputEvents }}
          value={this.value}
          class={classes}
          style={this.textareaStyle}
          ref="refTextareaElem"
        ></textarea>
        {textTips || limitText ? (
          <div
            class={[
              `${this.componentName}__info_wrapper`,
              {
                [`${this.componentName}__info_wrapper_align`]: !textTips,
              },
            ]}
          >
            {textTips}
            {limitText}
          </div>
        ) : null}
      </div>
    );
  },
});
