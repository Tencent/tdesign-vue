import Vue, { VueConstructor, VNode } from 'vue';
import { omit } from '../utils/helper';
import { renderContent } from '../utils/render-tnode';
import { RadioGroupInstance, RadioButtonInstance } from './instance';
import props from './props';
import { emitEvent } from '../utils/event';
import { TdRadioProps } from './type';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('radio');

export interface RadioParentInjectInstance extends Vue {
  radioGroup: RadioGroupInstance;
  radioButton: RadioButtonInstance;
}

export default mixins(Vue as VueConstructor<RadioParentInjectInstance>, classPrefixMixins).extend({
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

  render(): VNode {
    const { radioGroup, radioButton } = this;
    const tChecked = this.getChecked();
    const tDisabled = this.getDisabled();

    const prefixCls = radioButton ? `${this.componentName}-button` : this.componentName;

    const inputClass = [
      `${prefixCls}`,
      {
        [this.commonStatusClassName.checked]: tChecked,
        [this.commonStatusClassName.disabled]: tDisabled,
      },
    ];

    const allowUncheck = this.allowUncheck || this.radioGroup?.allowUncheck;
    return (
      <label class={inputClass} onClick={this.handleRadioClick} tabindex={tDisabled ? undefined : '0'}>
        <input
          type="radio"
          class={`${prefixCls}__former`}
          value={this.value ?? undefined}
          name={this.name || radioGroup?.name || undefined}
          checked={tChecked}
          disabled={tDisabled}
          onClick={this.onInputClick}
          tabindex="-1"
          data-value={typeof this.value === 'string' ? `'${this.value}'` : this.value}
          data-allow-uncheck={allowUncheck || undefined}
          // @ts-ignore
          on={{ ...omit(this.$listeners, ['change', 'click']) }}
        />
        <span class={`${prefixCls}__input`}></span>
        <span class={`${prefixCls}__label`}>{renderContent(this, 'default', 'label')}</span>
      </label>
    );
  },

  methods: {
    getChecked() {
      return this.checked || (this.value !== undefined && this.radioGroup?.value === this.value);
    },

    getDisabled() {
      return Boolean((this.formDisabled || this.disabled) ?? this.radioGroup?.disabled);
    },

    onInputClick(e: MouseEvent) {
      e.stopPropagation();
    },

    handleRadioClick(e: MouseEvent) {
      const tDisabled = this.getDisabled();
      if (tDisabled) return;
      this.$emit('click', { e });
      this.checkRadio(e);
    },

    checkRadio(e: MouseEvent) {
      const tChecked = this.getChecked();
      const allowUncheck = this.allowUncheck || this.radioGroup?.allowUncheck;

      if (tChecked && !allowUncheck) return;

      if (this.radioGroup) {
        const value = tChecked && allowUncheck ? undefined : this.value;
        this.radioGroup.handleRadioChange(value, { e });
      } else {
        const value = allowUncheck ? !tChecked : true;
        emitEvent<Parameters<TdRadioProps['onChange']>>(this, 'change', value, { e });
      }
    },
  },
});
