import Vue, { VueConstructor, CreateElement, VNode } from 'vue';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import { omit, getPropsApiByEvent } from '../utils/helper';
import ClearIcon from '../icon/clear-circle-filled';
import props from '../../types/input/props';
import { InputValue } from '../../types/input/TdInputProps';
import isFunction from 'lodash/isFunction';

const name = `${prefix}-input`;

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

export default (Vue as VueConstructor<InputInstance>).extend({
  name,
  inheritAttrs: false,
  props: { ...props },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    showClear(): boolean {
      return this.value && !this.disabled && this.clearable;
    },
    inputAttrs(): Record<string, any> {
      return getValidAttrs({
        autofocus: this.autofocus,
        disabled: this.disabled,
        readonly: this.readonly,
        autocomplete: this.autocomplete,
        placeholder: this.placeholder || undefined,
        maxlength: this.maxlength,
        name: this.name || undefined,
        type: this.type,
      });
    },
  },
  created() {
    this.composing = false;
  },
  render(h: CreateElement): VNode {
    const inputEvents = getValidAttrs({
      focus: this.emitFocus,
      blur: this.emitBlur,
      keydown: this.handleKeydonw,
      keyup: this.handleKeyUp,
      keypresss: this.handleKeypress,
      // input的change事件是失去焦点或者keydown的时候执行。这与api定义的change不符，所以不做任何变化。
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      change: () => { },
    });

    const wrapperAttrs = omit(this.$attrs, Object.keys(this.inputAttrs));
    const wrapperEvents = omit(this.$listeners, [...Object.keys(inputEvents), 'input']);

    const prefixIcon = this.renderIcon(h, this.prefixIcon, 'prefix-icon');
    let suffixIcon = this.renderIcon(h, this.suffixIcon, 'suffix-icon');

    if (this.showClear) {
      suffixIcon = <ClearIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitClear} />;
    }

    const classes = [
      name,
      CLASSNAMES.SIZE[this.size] || '',
      {
        [CLASSNAMES.STATUS.disabled]: this.disabled,
        [CLASSNAMES.STATUS.focused]: this.focused,
        [`${prefix}-is-${this.status}`]: this.status,
        [`${name}--prefix`]: prefixIcon,
        [`${name}--suffix`]: suffixIcon,
      },
    ];
    return (
      <div class={classes} {...{ attrs: wrapperAttrs, on: wrapperEvents }}>
        {prefixIcon ? <span class={`${name}__prefix`}>{prefixIcon}</span> : null}
        <input
          {...{ attrs: this.inputAttrs, on: inputEvents }}
          ref="refInputElem"
          value={this.value}
          class={`${name}__inner`}
          onInput={this.handleInput}
          onCompositionend={this.onCompositionend}
        />
        {suffixIcon ? <span class={[`${name}__suffix`, { [`${name}__clear`]: this.showClear }]}>{suffixIcon}</span> : null}
      </div>
    );
  },
  methods: {
    renderIcon(
      h: CreateElement,
      icon: string | Function | undefined,
      iconType: 'prefix-icon' | 'suffix-icon',
    ): JsxNode {
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
      const sV = String(v);
      if (!input) {
        return;
      }
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
      const checkInputType = e.inputType && e.inputType === 'insertCompositionText';
      if (e.isComposing || checkInputType) return;
      this.inputValueChangeHandle(e);
    },
    emitEvent(name: string, e: FocusEvent | KeyboardEvent | InputEvent) {
      this.$emit(name, this.value, { e });
      const eventPropsName = getPropsApiByEvent(name);
      isFunction(this[eventPropsName]) && this[eventPropsName]();
    },
    handleKeydonw(e: KeyboardEvent) {
      if (this.disabled) return;
      const { code } = e;
      if (code === 'Enter') {
        this.emitEvent('enter', e);
      } else {
        this.emitEvent('keydown', e);
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (this.disabled) return;
      this.emitEvent('keyup', e);
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.disabled) return;
      this.emitEvent('keypress', e);
    },
    emitClear(e: MouseEvent) {
      this.$emit('clear', { e });
      isFunction(this.onClear) && this.onClear({ e });
      this.$emit('change', '', { e });
      this.$emit('input', '');
      isFunction(this.onChange) && this.onChange('', { e });
    },
    emitFocus(e: FocusEvent) {
      if (this.disabled) return;
      this.focused = true;
      this.emitEvent('focus', e);
    },
    emitBlur(e: FocusEvent) {
      this.focused = false;
      this.emitEvent('blur', e);
    },
    onCompositionend(e: InputEvent) {
      this.inputValueChangeHandle(e);
    },
    inputValueChangeHandle(e: InputEvent) {
      const { target } = e;
      const val = (target as HTMLInputElement).value;
      this.$emit('change', val, { e });
      this.$emit('input', val);
      isFunction(this.onChange) && this.onChange(val, { e });
      // 受控
      this.$nextTick(() => this.setInputValue(this.value));
    },
  },
});
