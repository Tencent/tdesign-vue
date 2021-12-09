import Vue, { CreateElement, VNode, VueConstructor } from 'vue';
import { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon as ClearIcon } from 'tdesign-icons-vue';
import { InputValue, TdInputProps } from './type';
import { getCharacterLength, omit } from '../utils/helper';

import CLASSNAMES from '../utils/classnames';
import { emitEvent } from '../utils/event';
import { prefix } from '../config';
import props from './props';

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
  name: 'TInput',
  inheritAttrs: false,
  props: { ...props },
  data() {
    return {
      isHover: false,
      focused: false,
      renderType: this.type,
    };
  },
  computed: {
    showClear(): boolean {
      return this.value && !this.disabled && this.clearable && this.isHover;
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
        type: this.renderType,
      });
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
  render(h: CreateElement): VNode {
    const inputEvents = getValidAttrs({
      focus: this.emitFocus,
      blur: this.emitBlur,
      keydown: this.handleKeydown,
      keyup: this.handleKeyUp,
      keypress: this.handleKeypress,
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

    if (this.type === 'password') {
      if (this.renderType === 'password') {
        suffixIcon = <BrowseOffIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      } else if (this.renderType === 'text') {
        suffixIcon = <BrowseIcon class={`${name}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      }
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
      <div
        class={classes}
        onMouseenter={() => this.mouseEvent(true) }
        onMouseleave={() => this.mouseEvent(false) }
        {...{ attrs: wrapperAttrs, on: wrapperEvents }}
      >
        {prefixIcon ? <span class={`${name}__prefix`}>{prefixIcon}</span> : null}
        <input
          {...{ attrs: this.inputAttrs, on: inputEvents }}
          ref="refInputElem"
          value={this.value}
          class={`${name}__inner`}
          onInput={this.handleInput}
          onCompositionend={this.onCompositionend}
        />
        {
          suffixIcon
            ? <span class={[`${name}__suffix`, { [`${name}__clear`]: this.showClear }]}>{suffixIcon}</span>
            : null
        }
      </div>
    );
  },
  methods: {
    mouseEvent(v: boolean) {
      this.isHover = v;
    },
    renderIcon(
      h: CreateElement,
      icon: string | Function | undefined,
      iconType: 'prefix-icon' | 'suffix-icon',
    ) {
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
      if (this.disabled) return;
      const { code } = e;
      if (code === 'Enter' || code === 'NumpadEnter') {
        emitEvent<Parameters<TdInputProps['onEnter']>>(this, 'enter', this.value, { e });
      } else {
        emitEvent<Parameters<TdInputProps['onKeydown']>>(this, 'keydown', this.value, { e });
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (this.disabled) return;
      emitEvent<Parameters<TdInputProps['onKeyup']>>(this, 'keyup', this.value, { e });
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.disabled) return;
      emitEvent<Parameters<TdInputProps['onKeypress']>>(this, 'keypress', this.value, { e });
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
      if (this.disabled) return;
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
  },
});
