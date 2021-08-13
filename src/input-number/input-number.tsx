import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import TButton from '../button';
import Add from '../icon/add';
import Remove from '../icon/remove';
import ChevronDown from '../icon/chevron-down';
import ChevronUp from '../icon/chevron-up';
import CLASSNAMES from '../utils/classnames';
import props from './props';
import { ChangeSource } from './type';
import { ClassName, TNodeReturnValue } from '../common';

const name = `${prefix}-input-number`;

type InputNumberEvent = {
  on: {
    input?: (e: InputEvent) => void;
    click?: (e: MouseEvent) => void;
    blur?: (e: FocusEvent) => void;
    focus?: (e: FocusEvent) => void;
    keydown?: (e: KeyboardEvent) => void;
    keyup?: (e: KeyboardEvent) => void;
    keypress?: (e: KeyboardEvent) => void;
  };
};

type ChangeContextEvent = InputEvent | MouseEvent | FocusEvent;

type InputNumberAttr = {
  attrs: {
    disabled?: boolean;
    readonly?: any;
    autocomplete?: string;
    ref: string;
    placeholder: string;
  };
};

export default Vue.extend({
  name,
  props: { ...props },
  components: {
    Add,
    Remove,
    ChevronDown,
    ChevronUp,
    TButton,
  },
  data() {
    return {
      userInput: null,
      filterValue: null,
      isError: false,
      inputing: false,
    };
  },
  computed: {
    disabledReduce(): boolean {
      return this.disabled || this.isError || (Number(this.value) - this.step < this.min);
    },
    disabledAdd(): boolean {
      return this.disabled || this.isError || (Number(this.value) + this.step > this.max);
    },
    valueDecimalPlaces(): number {
      const tempVal = this.filterValue !== null
        && !isNaN(Number(this.filterValue))
        && !isNaN(parseFloat(this.filterValue))
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
          't-input-number',
          CLASSNAMES.SIZE[this.size],
          {
            [CLASSNAMES.STATUS.disabled]: this.disabled,
            't-is-controls-right': this.theme === 'column',
            't-input-number--normal': this.theme === 'normal',
          },
        ],
      };
    },
    inputWrapProps(): ClassName {
      return {
        class: [
          't-input',
          {
            't-is-error': this.isError,
          },
        ],
      };
    },
    inputClasses(): ClassName {
      return {
        class: [
          't-input__inner',
          {
            [CLASSNAMES.STATUS.disabled]: this.disabled,
            [`${name}-text-align`]: this.theme === 'row',
          },
        ],
      };
    },
    inputEvents(): InputNumberEvent {
      return {
        on: {
          input: this.handleInput,
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
          disabled: this.disabled,
          autocomplete: 'off',
          ref: 'refInputElem',
          placeholder: this.placeholder,
        },
      };
    },
    displayValue(): string | number {
      if (this.value === undefined) return;
      // inputing
      if (this.inputing && this.userInput !== null) {
        return this.filterValue;
      }
      // end input
      return this.format && !this.inputing ? this.format(this.value) : this.value.toFixed(this.digitsNum);
    },
  },
  methods: {
    decreaseIcon(): TNodeReturnValue {
      return this.theme === 'column' ? <chevron-down size={this.size} /> : <remove size={this.size} />;
    },
    increaseIcon(): TNodeReturnValue {
      return this.theme === 'column' ? <chevron-up size={this.size} /> : <add size={this.size} />;
    },
    handleAdd(e: MouseEvent) {
      if (this.disabledAdd) return;
      const value = this.value || 0;
      const factor = 10 ** this.digitsNum;
      this.handleAction(Number(this.toDecimalPlaces(((value * factor)
        + (this.step * factor)) / factor).toFixed(this.digitsNum)), 'add', e);
    },
    handleReduce(e: MouseEvent) {
      if (this.disabledReduce) return;
      const value = this.value || 0;
      const factor = 10 ** this.digitsNum;
      this.handleAction(Number(this.toDecimalPlaces(((value * factor)
        - (this.step * factor)) / factor).toFixed(this.digitsNum)), 'reduce', e);
    },
    handleInput(e: InputEvent) {
      // get
      this.userInput = (e.target as HTMLInputElement).value;
      // filter
      this.filterValue = this.toValidStringNumber(this.userInput);
      this.userInput = '';
      // check
      if (!this.isValid(this.filterValue) || Number(this.filterValue) === this.value) return;
      // set
      this.updateValue(Number(this.filterValue));
      this.handleAction(Number(this.filterValue), 'input', e);
    },
    handleAction(value: number, actionType: ChangeSource, e: ChangeContextEvent) {
      if (actionType !== 'input') {
        this.clearInput();
      }
      this.handleChange(value, { type: actionType, e });
    },
    toValidStringNumber(s: string) {
      // only allow one [.e] and two [-]
      let filterVal = s.replace(/[^\d.eE。-]/g, '').replace('。', '.');
      if (this.multiE(filterVal) || this.multiDot(filterVal) || this.multiNegative(filterVal)) {
        filterVal = filterVal.substr(0, filterVal.length - 1);
      }
      return filterVal;
    },
    toValidNumber(s: string) {
      if (s === '') return undefined;
      const val = Number(s);
      if (isNaN(val) || isNaN(parseFloat(s))) return this.value;
      if (val > this.max) return this.max;
      if (val < this.min) return this.min;
      return parseFloat(s);
    },
    handleChange(value: number, ctx: { type: ChangeSource;
      e: ChangeContextEvent; }) {
      if (this.onChange) {
        this.onChange(value, ctx);
      }
      this.updateValue(value);
      this.$emit('change', value, { type: ctx.type, e: ctx.e });
    },
    async handleBlur(e: FocusEvent) {
      await this.handleEndInput(e);
      if (this.onBlur) {
        this.onBlur(this.value, { e });
      }
      this.$emit('blur', this.value, { e });
    },
    handleFocus(e: FocusEvent) {
      this.handleStartInput();
      if (this.onFocus) {
        this.onFocus(this.value, { e });
      }
      this.$emit('focus', this.value, { e });
    },
    handleKeydownEnter(e: KeyboardEvent) {
      if (e.key !== 'Enter') return;
      if (this.onEnter) {
        this.onEnter(this.value, { e });
      }
      this.$emit('enter', this.value, { e });
    },
    handleKeydown(e: KeyboardEvent) {
      if (this.onKeydown) {
        this.onKeydown(this.value, { e });
      }
      this.$emit('keydown', this.value, { e });
      this.handleKey(e);
    },
    handleKey(e: KeyboardEvent) {
      const keyEvent = {
        ArrowUp: this.handleAdd,
        ArrowDown: this.handleReduce,
        Enter: this.handleKeydownEnter,
      };
      if (keyEvent[e.key] !== undefined) {
        keyEvent[e.key](e);
      }
    },
    handleKeyup(e: KeyboardEvent) {
      if (this.onKeyup) {
        this.onKeyup(this.value, { e });
      }
      this.$emit('keyup', this.value, { e });
    },
    handleKeypress(e: KeyboardEvent) {
      if (this.onKeypress) {
        this.onKeypress(this.value, { e });
      }
      this.$emit('keypress', this.value, { e });
    },
    handleStartInput() {
      if (this.value === undefined) return;
      this.inputing = true;

      this.filterValue = this.value.toFixed(this.digitsNum);
    },
    handleEndInput(e: FocusEvent) {
      this.inputing = false;
      let value = this.toValidNumber(this.filterValue);
      if (value !== undefined) {
        value = this.toDecimalPlaces(value);
      }
      if (value !== this.value) {
        this.updateValue(value);
        this.handleAction(value, 'input', e);
      }
      this.isError = false;
    },
    updateValue(v: number) {
      this.$emit('input', v);
    },
    handleInputError(visible: boolean) {
      this.isError = visible;
    },
    isValid(v: string) {
      const numV = Number(v);
      if (this.empty(v) || isNaN(numV)) {
        this.handleInputError(true);
        return false;
      }
      return this.isValidNumber(numV);
    },
    isValidNumber(v: number) {
      if (v > this.max) {
        this.handleInputError(true);
        return false;
      }
      if (v < this.min) {
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
        {
          this.theme !== 'normal'
          && <t-button {...this.reduceClasses} {...this.reduceEvents} variant="outline" icon={this.decreaseIcon} />
        }
        <div {...this.inputWrapProps}>
          <input
            value={this.displayValue}
            {...this.inputClasses}
            {...this.inputAttrs}
            {...this.inputEvents}
          />
        </div>
        {
          this.theme !== 'normal'
          && <t-button {...this.addClasses} {...this.addEvents} variant="outline" icon={this.increaseIcon} />
        }
      </div>
    );
  },
});
