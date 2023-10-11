import Vue, { CreateElement, VNode } from 'vue';
import {
  BrowseIcon as TdBrowseIcon,
  BrowseOffIcon as TdBrowseOffIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-vue';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import { getUnicodeLength, limitUnicodeMaxLength, getIEVersion } from '../_common/js/utils/helper';
import { InputValue, TdInputProps } from './type';
import { getCharacterLength, omit } from '../utils/helper';
import getConfigReceiverMixins, { InputConfig, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import FormItem from '../form/form-item';
import log from '../_common/js/log';

const ANIMATION_TIME = 100;

function getValidAttrs(obj: object): object {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

export interface InputParentInjectInstance extends Vue {
  composing: boolean;
  tFormItem: InstanceType<typeof FormItem>;
}

export default mixins(
  getConfigReceiverMixins<InputParentInjectInstance, InputConfig>('input'),
  getGlobalIconMixins(),
).extend({
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

  inject: {
    tFormItem: { default: undefined },
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
      preValue: this.value,
      timer: null,
      observerTimer: null,
      containerObserver: null as ResizeObserver,
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
        ((this.value && !this.tDisabled && this.clearable && !this.readonly) || this.showClearIconOnEmpty)
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
        name: this.name || undefined,
        type: this.renderType,
        unselectable: this.readonly ? 'on' : 'off',
      });
    },
    inputClasses(): ClassName {
      return [
        this.componentName,
        {
          [this.commonSizeClassName[this.size]]: this.size !== 'medium',
          [this.commonStatusClassName.disabled]: this.tDisabled,
          [this.commonStatusClassName.focused]: this.focused,
          [`${this.classPrefix}-is-${this.tStatus}`]: this.tStatus && this.tStatus !== 'default',
          [`${this.classPrefix}-align-${this.align}`]: this.align !== 'left',
          [`${this.classPrefix}-is-disabled`]: this.tDisabled,
          [`${this.classPrefix}-is-readonly`]: this.readonly,
          [`${this.componentName}--focused`]: this.focused,
        },
      ];
    },
    inputWrapClass(): ClassName {
      const wrapClass = `${this.componentName}__wrap`;
      return [
        `${wrapClass}`,
        {
          [`${wrapClass}--focused`]: this.focused,
          [`${this.componentName}--auto-width`]: this.autoWidth && !this.keepWrapperWidth,
        },
      ];
    },

    limitNumber(): string {
      const { maxlength, maxcharacter, value } = this;
      if (typeof value === 'number') return String(value);
      if (maxlength && maxcharacter) {
        log.warn('Input', 'Pick one of maxlength and maxcharacter please.');
      }
      if (maxlength) {
        const length = value?.length ? getUnicodeLength(value) : 0;
        return `${length}/${maxlength}`;
      }
      if (maxcharacter) {
        return `${getCharacterLength(value || '')}/${maxcharacter}`;
      }
      return '';
    },

    innerStatus(): string {
      if (this.limitNumber) {
        const [current, total] = this.limitNumber.split('/');
        return Number(current) > Number(total) ? 'error' : '';
      }
      return '';
    },

    tStatus(): string {
      return this.status || this.innerStatus;
    },

    isIE(): boolean {
      return getIEVersion() <= 11;
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
        this.inputValue = this.format ? this.format(val) : val;
        this.preValue = this.inputValue;

        // limit props value
        const newVal = this.getValueByLimitNumber(val);
        if (newVal !== val && this.type !== 'number') {
          emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', newVal, { trigger: 'initial' });
        }
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
    if (this.autoWidth) {
      this.addListeners();
    }
    if (this.maxlength || this.maxcharacter) {
      this.$watch(
        () => this.innerStatus,
        () => this.onValidateChange(),
      );
    }
    this.innerStatus && this.onValidateChange();
  },

  mounted() {
    this.addResizeObserver();
  },

  beforeDestroy() {
    this.cleanupObserver(this.containerObserver, this.$refs.inputRef as Element);
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
    addResizeObserver() {
      if (this.$refs.inputRef) {
        this.$watch(
          () => this.$refs.inputRef,
          () => {
            this.cleanupObserver(this.containerObserver, this.$refs.inputRef as Element);
            this.containerObserver = this.useResizeObserver(this.$refs.inputRef as HTMLElement, () => {
              if (this.autoWidth) {
                this.observerTimer = setTimeout(() => {
                  this.updateInputWidth();
                  clearTimeout(this.observerTimer);
                }, ANIMATION_TIME);
              }
            });
          },
          { immediate: true },
        );
      }
    },
    renderIcon(
      h: CreateElement,
      icon: string | Function | undefined,
      iconType: 'prefix-icon' | 'suffix-icon' | 'password-icon',
    ) {
      if (typeof icon === 'function') {
        return icon(h);
      }

      // 插槽名称为中划线
      if (this.$scopedSlots[kebabCase(iconType)]) {
        return this.$scopedSlots[kebabCase(iconType)](h);
      }
      // 插槽名称为驼峰
      if (this.$scopedSlots[camelCase(iconType)]) {
        return this.$scopedSlots[camelCase(iconType)](h);
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
    focus() {
      (this.$refs.inputRef as HTMLInputElement).focus();
    },
    blur() {
      (this.$refs.inputRef as HTMLInputElement).blur();
    },
    handleKeydown(e: KeyboardEvent) {
      if (this.tDisabled) return;
      const {
        currentTarget: { value },
      }: any = e;
      if (/enter/i.test(e.key) || /enter/i.test(e.code)) {
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
    handlePaste(e: ClipboardEvent) {
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
      emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', '', { e, trigger: 'clear' });
      emitEvent<Parameters<TdInputProps['onClear']>>(this, 'clear', { e });
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
      this.$emit('compositionstart', value, { e });
      this.onCompositionstart?.(value, { e });
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
      this.$emit('compositionend', value, { e });
      this.onCompositionend?.(value, { e });
    },
    onRootClick(e: MouseEvent) {
      (this.$refs.inputRef as HTMLInputElement)?.focus();
      this.$emit('click', { e });
      this.onClick?.({ e });
    },
    throttleChangeCursorPos(ref: HTMLInputElement, pos: number) {
      // eslint-disable-next-line no-param-reassign
      (ref as HTMLInputElement).selectionEnd = pos;
    },
    handleInput(e: InputEvent | CompositionEvent) {
      this.preValue = this.inputValue + e.data;
      let {
        currentTarget: { value: val },
      }: any = e;
      let preCursorPos: number;
      if (this.composingRef) {
        this.composingRefValue = val;
      } else {
        if (this.type !== 'number') {
          val = this.getValueByLimitNumber(val);
        }
        emitEvent<Parameters<TdInputProps['onChange']>>(this, 'change', val, { e, trigger: 'input' });
        // 受控，重要，勿删 input无法直接实现受控
        if (!this.isIE) {
          // 修复在 popup 弹出层里输入时 光标异常的问题
          const inputRef = this.$refs.inputRef as HTMLInputElement;
          preCursorPos = inputRef.selectionStart;
          // 处理连续快速重复输入异常的问题
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.throttleChangeCursorPos(inputRef, preCursorPos);
          });
        }
        this.$nextTick(() => {
          this.setInputValue(this.value);
        });
      }
    },

    onInputMouseenter(e: MouseEvent) {
      this.isHover = true;
      emitEvent<Parameters<TdInputProps['onMouseenter']>>(this, 'mouseenter', { e });
    },

    onInputMouseleave(e: MouseEvent) {
      this.isHover = false;
      emitEvent<Parameters<TdInputProps['onMouseleave']>>(this, 'mouseleave', { e });
    },

    updateInputWidth() {
      const pre = this.$refs.inputPreRef as HTMLSpanElement;
      if (!pre) return;
      const { width } = pre.getBoundingClientRect();
      if (this.$refs.inputRef) {
        (this.$refs.inputRef as HTMLInputElement).style.width = `${width}px`;
      }
    },

    getValueByLimitNumber(inputValue: string) {
      const { allowInputOverMax, maxlength, maxcharacter } = this;
      if (!(maxlength || maxcharacter) || allowInputOverMax || !inputValue) return inputValue;
      if (maxlength) {
        // input value could be unicode 😊
        return limitUnicodeMaxLength(inputValue, Number(maxlength));
      }
      if (maxcharacter) {
        const r = getCharacterLength(inputValue, maxcharacter);
        if (typeof r === 'object') {
          return r.characters;
        }
      }
    },

    onValidateChange() {
      const error = this.innerStatus ? 'exceed-maximum' : undefined;
      this.onValidate?.({ error });
      this.$emit('validate', { error });
    },

    useResizeObserver(el: HTMLElement, callback: (data: ResizeObserverEntry[]) => void): ResizeObserver {
      if (typeof window === 'undefined') return;

      const isSupport = typeof window !== 'undefined' && window.ResizeObserver;
      // unit tests do not need any warn console; too many warns influence focusing on more important log info
      if (!isSupport) return;

      const containerObserver = new ResizeObserver(callback);
      containerObserver.observe(el);

      return containerObserver;
    },

    cleanupObserver(observer: ResizeObserver, container: Element) {
      if (!observer || !container) return;
      observer.unobserve(container);
      observer.disconnect();
    },
  },

  render(h: CreateElement): VNode {
    const inputEvents = {
      focus: this.emitFocus,
      blur: this.formatAndEmitBlur,
      keydown: this.handleKeydown,
      keyup: this.handleKeyUp,
      keypress: this.handleKeypress,
      paste: this.handlePaste,
      compositionstart: this.compositionstartHandler,
      compositionend: this.compositionendHandler,
      // input的change事件是失去焦点或者keydown的时候执行。这与api定义的change不符，所以不做任何变化。
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      change: () => {},
    };

    const wrapperAttrs = omit(this.$attrs, Object.keys(this.inputAttrs));
    const wrapperEvents = omit(this.$listeners, [...Object.keys(inputEvents), 'input', 'paste']);

    const prefixIcon = this.renderIcon(h, this.prefixIcon, 'prefix-icon');
    let suffixIcon = this.renderIcon(h, this.suffixIcon, 'suffix-icon');
    let passwordIcon = this.renderIcon(h, undefined, 'password-icon');

    const label = renderTNodeJSX(this, 'label');
    const suffix = renderTNodeJSX(this, 'suffix');
    const limitNode = this.limitNumber && this.showLimitNumber ? (
        <div
          class={[
            `${this.classPrefix}-input__limit-number`,
            {
              [`${this.classPrefix}-is-disabled`]: this.disabled,
            },
          ]}
        >
          {this.limitNumber}
        </div>
    ) : null;

    const labelContent = label ? <div class={`${this.componentName}__prefix`}>{label}</div> : null;
    const suffixContent = suffix || limitNode ? (
        <div class={`${this.componentName}__suffix`}>
          {suffix}
          {limitNode}
        </div>
    ) : null;

    const { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } = this.useGlobalIcon({
      BrowseIcon: TdBrowseIcon,
      BrowseOffIcon: TdBrowseOffIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });

    if (this.type === 'password') {
      if (this.renderType === 'password') {
        suffixIcon = <BrowseOffIcon class={`${this.componentName}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      } else if (this.renderType === 'text') {
        suffixIcon = <BrowseIcon class={`${this.componentName}__suffix-clear`} nativeOnClick={this.emitPassword} />;
      }
    }

    if (this.showClear) {
      // 如果类型为 password 则使用 passwordIcon 显示 clear
      if (this.type === 'password') {
        passwordIcon = (
          <CloseCircleFilledIcon class={`${this.componentName}__suffix-clear`} nativeOnClick={this.emitClear} />
        );
      } else {
        suffixIcon = (
          <CloseCircleFilledIcon class={`${this.componentName}__suffix-clear`} nativeOnClick={this.emitClear} />
        );
      }
    }

    const classes = [
      this.inputClasses,
      this.inputClass,
      {
        [`${this.componentName}--prefix`]: prefixIcon || labelContent,
        [`${this.componentName}--suffix`]: suffixIcon || suffixContent,
      },
    ];
    const inputTextValue = this.composingRef ? this.composingRefValue : this.inputValue;
    const inputNode = (
      <div
        class={classes}
        {...{ attrs: wrapperAttrs, on: wrapperEvents }}
        onClick={this.onRootClick}
        onMouseenter={this.onInputMouseenter}
        onMouseleave={this.onInputMouseleave}
        onwheel={this.onHandleMousewheel}
      >
        {prefixIcon ? (
          <span class={[`${this.componentName}__prefix`, `${this.componentName}__prefix-icon`]}>{prefixIcon}</span>
        ) : null}
        {labelContent}
        {/* input element must exist, or other select components can not focus by keyboard operation */}
        <input
          attrs={this.inputAttrs}
          on={inputEvents}
          ref="inputRef"
          class={[`${this.componentName}__inner`, { [`${this.componentName}--soft-hidden`]: !this.showInput }]}
          value={inputTextValue}
          onInput={this.handleInput}
          title={this.disabled ? inputTextValue : undefined}
        />
        {this.autoWidth && (
          <span ref="inputPreRef" class={`${this.classPrefix}-input__input-pre`}>
            {this.preValue || this.tPlaceholder}
          </span>
        )}
        {suffixContent}
        {passwordIcon ? (
          <span
            class={[
              `${this.componentName}__suffix`,
              `${this.componentName}__suffix-icon`,
              `${this.componentName}__clear`,
            ]}
          >
            {passwordIcon}
          </span>
        ) : null}
        {suffixIcon ? (
          <span
            class={[
              `${this.componentName}__suffix`,
              `${this.componentName}__suffix-icon`,
              { [`${this.componentName}__clear`]: this.showClear },
            ]}
          >
            {suffixIcon}
          </span>
        ) : null}
      </div>
    );

    const tips = renderTNodeJSX(this, 'tips');

    return (
      <div class={this.inputWrapClass}>
        {inputNode}
        {tips && (
          <div class={`${this.componentName}__tips ${this.componentName}__tips--${this.tStatus || 'default'}`}>
            {tips}
          </div>
        )}
      </div>
    );
  },
});
