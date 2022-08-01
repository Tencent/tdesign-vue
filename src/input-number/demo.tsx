import Vue, { VNode } from 'vue';
import {
  AddIcon, RemoveIcon, ChevronDownIcon, ChevronUpIcon,
} from 'tdesign-icons-vue';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import TButton from '../button';
import TInput from '../input';
import { emitEvent } from '../utils/event';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import props from './props';
import { ChangeSource, TdInputNumberProps, InputNumberValue } from './type';
import { ClassName, TNodeReturnValue } from '../common';
import {
  isInputNumber,
  largeNumberToFixed,
  compareLargeNumber,
  largePositiveNumberAdd,
  largePositiveNumberSubtract,
} from '../_common/js/input-number/large-number';
import log from '../_common/js/log';

const name = `${prefix}-input-number`;

type InputNumberEvent = {
  on: {
    input?: (e: InputEvent) => void;
    click?: (e: MouseEvent) => void;
    blur?: (value: InputNumberValue, ctx: { e: FocusEvent }) => void;
    focus?: (value: InputNumberValue, ctx: { e: FocusEvent }) => void;
    keydown?: (value: InputNumberValue, ctx: { e: KeyboardEvent }) => void;
    keyup?: (value: InputNumberValue, ctx: { e: KeyboardEvent }) => void;
    keypress?: (value: InputNumberValue, ctx: { e: KeyboardEvent }) => void;
  };
};

type ChangeContextEvent = InputEvent | MouseEvent | FocusEvent | KeyboardEvent;

type InputNumberAttr = {
  attrs: {
    disabled?: boolean;
    readonly?: boolean;
    autocomplete?: string;
    ref: string;
    placeholder: string;
    unselectable?: string;
    tips: TdInputNumberProps['tips'];
    autoWidth: boolean;
    align: TdInputNumberProps['align'];
    status: TdInputNumberProps['status'];
  };
};

export default Vue.extend({
  name: 'TInputNumber',
  props: { ...props },
  components: {
    AddIcon,
    RemoveIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    TButton,
    TInput,
  },

  data() {
    return {
      // 表单控制禁用态时的变量
      formDisabled: undefined,
      userInput: null,
      filterValue: null,
      isError: false,
      inputting: false,
      enter: false,
    };
  },

  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    disabledReduce(): boolean {
      return this.tDisabled || this.isError || Number(this.value) - this.step < this.min;
    },
    disabledAdd(): boolean {
      return this.tDisabled || this.isError || Number(this.value) + this.step > this.max;
    },
    valueDecimalPlaces(): number {
      const tempVal = this.filterValue !== null && !isNaN(Number(this.filterValue)) && !isNaN(parseFloat(this.filterValue))
        ? this.filterValue
        : String(this.value);
      const tempIndex = tempVal.indexOf('.') + 1;
      return tempIndex > 0 ? tempVal.length - tempIndex : 0;
    },
    stepDecimalPlaces(): number {
      const tempVal = String(this.step);
      const tempIndex = tempVal.indexOf('.') + 1;
      return tempIndex > 0 ? tempVal.length - tempIndex : 0;
    },
    digitsNum(): number {
      if (this.decimalPlaces !== undefined) {
        if (this.decimalPlaces < this.stepDecimalPlaces) {
          console.warn('decimal places of step should be less than decimal-places');
        }
        return this.decimalPlaces;
      }
      return this.valueDecimalPlaces > this.stepDecimalPlaces ? this.valueDecimalPlaces : this.stepDecimalPlaces;
    },
    reduceClasses(): ClassName {
      return {
        class: [
          `${name}__decrease`,
          {
            [CLASSNAMES.STATUS.disabled]: this.disabledReduce,
          },
        ],
      };
    },
    reduceEvents(): InputNumberEvent {
      return {
        on: {
          click: this.handleReduce,
        },
      };
    },
    addClasses(): ClassName {
      return {
        class: [
          `${name}__increase`,
          {
            [CLASSNAMES.STATUS.disabled]: this.disabledAdd,
          },
        ],
      };
    },
    addEvents(): InputNumberEvent {
      return {
        on: {
          click: this.handleAdd,
        },
      };
    },
    cmptWrapClasses(): ClassName {
      return {
        class: [
          name,
          CLASSNAMES.SIZE[this.size],
          {
            [CLASSNAMES.STATUS.disabled]: this.tDisabled,
            [`${prefix}-is-controls-right`]: this.theme === 'column',
            [`${name}--${this.theme}`]: this.theme,
            [`${name}--auto-width`]: this.autoWidth,
          },
        ],
      };
    },
    inputEvents(): InputNumberEvent {
      return {
        on: {
          blur: this.handleBlur,
          focus: this.handleFocus,
          keydown: this.handleKeydown,
          keyup: this.handleKeyup,
          keypress: this.handleKeypress,
        },
      };
    },
    inputAttrs(): InputNumberAttr {
      return {
        attrs: {
          disabled: this.tDisabled,
          readonly: this.readonly,
          autocomplete: 'off',
          ref: 'refInputElem',
          placeholder: this.placeholder,
          unselectable: this.readonly ? 'on' : 'off',
          tips: this.tips,
          autoWidth: this.autoWidth,
          align: this.align || (this.theme === 'row' ? 'center' : undefined),
          status: this.isError ? 'error' : this.status,
        },
      };
    },
    displayValue(): InputNumberValue {
      // inputting
      if (this.inputting && !this.enter && this.userInput !== null) {
        return this.filterValue;
      }
      if (this.value === undefined || this.value === null) return '';
      // end input
      return this.format && !this.inputting ? this.format(this.value) : largeNumberToFixed(this.value, this.digitsNum);
    },
  },
  methods: {
    decreaseIcon(): TNodeReturnValue {
      return this.theme === 'column' ? <chevron-down-icon size={this.size} /> : <remove-icon size={this.size} />;
    },
    increaseIcon(): TNodeReturnValue {
      return this.theme === 'column' ? <chevron-up-icon size={this.size} /> : <add-icon size={this.size} />;
    },
    handleAdd(e: MouseEvent) {
      if (this.disabledAdd || this.readonly) return;
      this.handleAction(this.getClickValue('add'), 'add', e);
    },
    handleReduce(e: MouseEvent) {
      if (this.disabledReduce || this.readonly) return;
      this.handleAction(this.getClickValue('reduce'), 'reduce', e);
    },
    getClickValue(op: string) {
      if (this.step <= 0) {
        log.error('InputNumber', 'step must be larger than 0.');
        return this.value;
      }
      const step = isNumber(this.step) ? String(this.step) : this.step;
      let newVal: string | number;
      if (op === 'add') {
        newVal = this.largeNumber
          ? largePositiveNumberAdd(this.value, step)
          : this.toDecimalPlaces((this.value || 0) + Number(this.step));
      } else if (op === 'reduce') {
        newVal = this.largeNumber
          ? largePositiveNumberSubtract(this.value, step)
          : this.toDecimalPlaces((this.value || 0) - Number(this.step));
      }
      if (this.value === undefined) {
        newVal = this.putInRangeNumber(newVal);
      }
      return largeNumberToFixed(newVal, this.digitsNum);
    },
    handleInput(val: InputNumberValue, e: InputEvent) {
      // get
      this.userInput = val;
      // filter
      this.filterValue = this.toValidStringNumber(this.userInput);
      this.userInput = '';
      // check
      const isEqual = this.largeNumber ? this.filterValue === this.value : Number(this.filterValue) === this.value;
      if (!this.isValid(this.filterValue) || isEqual) {
        return;
      }
      const newValue = this.largeNumber ? this.filterValue : Number(this.filterValue);
      this.updateValue(newValue);
      this.handleAction(newValue, 'input', e);
    },
    handleAction(value: InputNumberValue, actionType: ChangeSource, e: ChangeContextEvent) {
      if (actionType !== 'input') {
        this.clearInput();
      }
      this.handleChange(value, { type: actionType, e });
    },
    toValidStringNumber(s: string) {
      // only allow one [.e] and two [-]
      let filterVal = s.replace(/[^\d.eE。-]/g, '').replace('。', '.');
      if (this.multiE(filterVal) || this.multiDot(filterVal) || this.multiNegative(filterVal)) {
        filterVal = filterVal.substring(0, filterVal.length - 1);
      }
      return filterVal;
    },
    putInRangeNumber(val: string | number): InputNumberValue {
      if (val === '') return undefined;
      if (!isInputNumber(val)) return this.value;
      if (
        this.largeNumber
        && (isString(this.max) || this.max === Infinity)
        && (isString(this.min) || this.min === -Infinity)
      ) {
        if (compareLargeNumber(this.max, val) < 0) return this.max;
        if (compareLargeNumber(this.min, val) > 0) return this.min;
        return val;
      }
      return Math.max(Number(this.min), Math.min(Number(this.max), Number(val)));
    },
    handleChange(value: InputNumberValue, ctx: { type: ChangeSource; e: ChangeContextEvent }) {
      this.updateValue(value);
      emitEvent<Parameters<TdInputNumberProps['onChange']>>(this, 'change', value, ctx);
    },
    handleBlur(value: string, ctx: { e: FocusEvent }) {
      this.handleEndInput(ctx.e);
      this.clearFilterValue();
      emitEvent<Parameters<TdInputNumberProps['onBlur']>>(this, 'blur', this.value, ctx);
    },
    handleFocus(value: string, ctx: { e: FocusEvent }) {
      this.handleStartInput();
      emitEvent<Parameters<TdInputNumberProps['onFocus']>>(this, 'focus', this.value, ctx);
    },
    handleKeypressEnter(value: number, ctx: { e: KeyboardEvent }) {
      this.handleEndInput(ctx.e);
      emitEvent<Parameters<TdInputNumberProps['onEnter']>>(this, 'enter', this.value, ctx);
      this.inputting = true;
      this.enter = true;
      this.filterValue = String(this.value);
    },
    handleKeydown(value: number, ctx: { e: KeyboardEvent }) {
      emitEvent<Parameters<TdInputNumberProps['onKeydown']>>(this, 'keydown', this.value, ctx);
      this.handleDownKey(ctx.e);
    },
    handleDownKey(e: KeyboardEvent) {
      const keyEvent = {
        ArrowUp: this.handleAdd,
        ArrowDown: this.handleReduce,
      };
      const code = e.code || e.key;
      if (keyEvent[code] !== undefined) {
        keyEvent[code](e);
      }
    },
    handleKeyup(value: number, ctx: { e: KeyboardEvent }) {
      emitEvent<Parameters<TdInputNumberProps['onKeyup']>>(this, 'keyup', this.value, ctx);
      this.enter = false;
    },
    handleKeypress(value: number, ctx: { e: KeyboardEvent }) {
      emitEvent<Parameters<TdInputNumberProps['onKeypress']>>(this, 'keypress', this.value, ctx);
      this.handlePressKey(value, ctx);
    },
    handlePressKey(value: number, ctx: { e: KeyboardEvent }) {
      const keyEvent = {
        Enter: this.handleKeypressEnter,
        NumpadEnter: this.handleKeypressEnter,
      };
      const code = ctx.e.code || ctx.e.key;
      if (keyEvent[code] !== undefined) {
        keyEvent[code](value, ctx);
      }
    },
    handleStartInput() {
      this.inputting = true;
      if (this.value === undefined || this.value === null) return;
      this.filterValue = largeNumberToFixed(this.value, this.digitsNum);
    },
    handleEndInput(e: FocusEvent | KeyboardEvent) {
      if (this.largeNumber && isNumber(this.value)) {
        log.error('InputNumber', 'largeNumber must be a string, instead of number.');
        return;
      }
      this.inputting = false;
      let value = this.putInRangeNumber(this.filterValue);
      if (value !== undefined && !this.largeNumber && isNumber(value)) {
        value = this.toDecimalPlaces(value);
      } else if (this.largeNumber) {
        value = largeNumberToFixed(value, this.digitsNum);
      }
      if (value !== this.value) {
        this.updateValue(value);
        this.handleAction(value, 'input', e);
      }
      this.isError = false;
    },
    updateValue(v: InputNumberValue) {
      this.$emit('input', v);
    },
    handleInputError(visible: boolean) {
      this.isError = visible;
    },
    isValid(v: string) {
      if (this.empty(v) || !isInputNumber(v)) {
        this.handleInputError(true);
        return false;
      }
      return this.isValidNumber(v);
    },
    isValidNumber(v: number | string) {
      if (compareLargeNumber(v, this.max) > 0) {
        this.handleInputError(true);
        return false;
      }
      if (compareLargeNumber(v, this.min) < 0) {
        this.handleInputError(true);
        return false;
      }
      this.isError = false;
      return true;
    },
    empty(v: string) {
      return !v && !v.replace(' ', '');
    },
    clearInput() {
      this.userInput = null;
    },
    clearFilterValue() {
      this.filterValue = '';
    },
    multiE(s: string) {
      const m = s.match(/[e]/gi);
      return m === null ? false : m.length > 1;
    },
    multiDot(s: string) {
      const m = s.match(/[.]/g);
      return m === null ? false : m.length > 1;
    },
    multiNegative(s: string) {
      const m = s.match(/[-]/g);
      return m === null ? false : m.length > 2;
    },
    toDecimalPlaces(value: number): number {
      const decimalPlaces = this.decimalPlaces === undefined ? this.digitsNum : this.decimalPlaces;
      const factor = 10 ** decimalPlaces;
      return Math.round(value * factor) / factor;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (v !== undefined) {
          this.isValidNumber(v);
        }
      },
    },
  },
  render(): VNode {
    return (
      <div {...this.cmptWrapClasses}>
        {this.theme !== 'normal' && (
          <t-button
            {...this.reduceClasses}
            {...this.reduceEvents}
            variant="outline"
            shape="square"
            icon={this.decreaseIcon}
          />
        )}
        <t-input
          {...this.inputAttrs}
          {...this.inputEvents}
          scopedSlots={this.$scopedSlots}
          props={this.inputProps}
          value={this.displayValue}
          onChange={(val: string, { e }: { e: InputEvent }) => this.handleInput(val, e)}
        />
        {this.theme !== 'normal' && (
          <t-button
            {...this.addClasses}
            {...this.addEvents}
            variant="outline"
            shape="square"
            icon={this.increaseIcon}
          />
        )}
      </div>
    );
  },
});
