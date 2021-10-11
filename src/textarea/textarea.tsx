import Vue from 'vue';
import isFunction from 'lodash/isFunction';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import props from './props';
import { getPropsApiByEvent } from '../utils/helper';
import calcTextareaHeight from './calcTextareaHeight';

const name = `${prefix}-textarea`;
function getValidAttrs(obj: object): object {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
export default Vue.extend({
  name,
  props: {
    ...props,
  },
  data() {
    return {
      focused: false,
      mouseHover: false,
      textareaStyle: {},
    };
  },

  computed: {
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.disabled,
        readonly: this.readonly,
        placeholder: this.placeholder,
        maxlength: this.maxlength || undefined,
        name: this.name || undefined,
      });
    },
  },

  mounted() {
    this.adjustTextareaHeight();
  },

  methods: {
    adjustTextareaHeight() {
      if (this.autosize === true) {
        this.textareaStyle = calcTextareaHeight(this.$refs.refTextareaElem as HTMLTextAreaElement);
      } else if (typeof this.autosize === 'object') {
        this.textareaStyle = calcTextareaHeight(this.$refs.refTextareaElem as HTMLTextAreaElement, this.autosize?.minRows, this.autosize?.maxRows);
      }
    },

    emitEvent(name: string, value: string | number, context: object) {
      this.$emit(name, value, context);
      const handleName = getPropsApiByEvent(name);
      isFunction(this[handleName]) && this[handleName](value, context);
    },

    focus(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.focus();
    },
    blur(): void {
      const input = this.$refs.refInputElem as HTMLInputElement;
      input?.blur();
    },
    handleInput(e: any): void {
      const { target } = e;
      const val = (target as HTMLInputElement).value;
      this.$emit('input', val);
      this.emitEvent('change', val, { e: InputEvent });

      this.adjustTextareaHeight();
    },

    emitKeyDown(e: KeyboardEvent) {
      if (this.disabled) return;
      this.emitEvent('keydown', this.value, { e });
    },
    emitKeyUp(e: KeyboardEvent) {
      if (this.disabled) return;
      this.emitEvent('keyup', this.value, { e });
    },
    emitKeypress(e: KeyboardEvent) {
      if (this.disabled) return;
      this.emitEvent('keypress', this.value, { e });
    },
    emitFocus(e: FocusEvent) {
      if (this.disabled) return;
      this.focused = true;
      this.emitEvent('focus', this.value, { e });
    },
    emitBlur(e: FocusEvent) {
      this.focused = false;
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
      `${name}__inner`,
      {
        [CLASSNAMES.STATUS.disabled]: this.disabled,
        [CLASSNAMES.STATUS.focused]: this.focused,
        [`${prefix}-resize-none`]: typeof this.autosize === 'object',
      },
    ];
    return (
      <div class={`${name}`}>
        <textarea
          onInput={this.handleInput}
          {...{ attrs: this.inputAttrs, on: inputEvents }}
          value={this.value}
          class={classes}
          style={this.textareaStyle}
          ref="refTextareaElem"
        ></textarea>
        {this.maxlength ? (
          <span class={`${name}__limit`}>{`${this.value ? String(this.value)?.length : 0}/${this.maxlength}`}</span>
        ) : null}
      </div>
    );
  },
});
