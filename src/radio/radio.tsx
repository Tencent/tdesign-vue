import Vue, { VueConstructor, VNode } from 'vue';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import { omit } from '../utils/helper';
import { renderContent } from '../utils/render-tnode';
import props from './props';
import { RadioGroupInstance, RadioButtonInstance } from './instance';
import { emitEvent } from '../utils/event';
import { TdRadioProps } from './type';

const name = `${prefix}-radio`;
export const radioBtnName = `${prefix}-radio-button`;

interface RadioInstance extends Vue {
  radioGroup: RadioGroupInstance;
  radioButton: RadioButtonInstance;
}

export default (Vue as VueConstructor<RadioInstance>).extend({
  name: 'TRadio',

  inheritAttrs: false,

  props: { ...props },

  inject: {
    radioGroup: { default: undefined },
    radioButton: { default: undefined },
  },

  data() {
    return {
      // 表单控制禁用态时的变量
      formDisabled: undefined,
    };
  },

  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
  },

  render(): VNode {
    const { radioGroup, radioButton } = this;

    const inputProps = {
      checked: this.checked,
      disabled: this.tDisabled,
      value: this.value,
      name: this.name,
    };

    if (radioGroup) {
      inputProps.checked = this.value === radioGroup.value;
      inputProps.disabled = this.tDisabled === undefined ? radioGroup.disabled : this.tDisabled;
      inputProps.name = radioGroup.name;
    }

    const prefixCls = radioButton ? radioBtnName : name;

    const inputClass = [
      `${prefixCls}`,
      {
        [CLASSNAMES.STATUS.checked]: inputProps.checked,
        [CLASSNAMES.STATUS.disabled]: inputProps.disabled,
      },
    ];

    return (
      <label class={inputClass}>
        <input
          type="radio"
          class={`${prefixCls}__former`}
          on={{ ...omit(this.$listeners, ['change', 'click']) }}
          {...{ domProps: inputProps }}
          onChange={this.handleChange}
          onClick={this.handleClick}
        />
        <span class={`${prefixCls}__input`}></span>
        <span class={`${prefixCls}__label`}>{renderContent(this, 'default', 'label')}</span>
      </label>
    );
  },

  methods: {
    handleChange(e: Event) {
      if (this.radioGroup) {
        // this.radioGroup.$emit('checked-change', this.value, { e });
        this.radioGroup.handleRadioChange(this.value, { e });
      } else {
        const target = e.target as HTMLInputElement;
        emitEvent<Parameters<TdRadioProps['onChange']>>(this, 'change', target.checked, { e });
      }
    },
    handleClick(e: Event) {
      this.$emit('click');
      if (!this.checked || !this.allowUncheck) return;
      if (this.radioGroup) {
        // this.radioGroup.$emit('checked-change', undefined, { e });
        this.radioGroup.handleRadioChange(undefined, { e });
      } else {
        emitEvent<Parameters<TdRadioProps['onChange']>>(this, 'change', false, { e });
      }
    },
  },
});
