import Vue, { VNode, VueConstructor } from 'vue';
import { renderContent } from '../utils/render-tnode';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import checkboxProps from './props';
import Group from './group';
import { omit } from '../utils/helper';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';
import { TdCheckboxProps } from './type';

const name = `${prefix}-checkbox`;

interface CheckboxInstance extends Vue {
  checkboxGroup: InstanceType<typeof Group>;
}

export default (Vue as VueConstructor<CheckboxInstance>).extend({
  name: 'TCheckbox',

  inheritAttrs: false,

  props: { ...checkboxProps },

  inject: {
    checkboxGroup: { default: undefined },
  },

  data() {
    return {
      // 表单控制禁用态时的变量
      formDisabled: undefined,
    };
  },

  computed: {
    labelClasses(): ClassName {
      return [
        `${name}`,
        {
          [CLASSNAMES.STATUS.checked]: this.checked$,
          [CLASSNAMES.STATUS.disabled]: this.disabled$,
          [CLASSNAMES.STATUS.indeterminate]: this.indeterminate$,
        },
      ];
    },
    disabled$(): boolean {
      if (this.formDisabled) return this.formDisabled;
      if (!this.checkAll && !this.checked$ && this.checkboxGroup?.maxExceeded) {
        return true;
      }
      if (this.disabled !== undefined) return this.disabled;
      return !!this.checkboxGroup?.disabled;
    },
    name$(): string {
      return this.name || this.checkboxGroup?.name;
    },
    checked$(): boolean {
      if (this.checkAll) return this.checkboxGroup?.isCheckAll;
      return this.checkboxGroup ? !!this.checkboxGroup.checkedMap[this.value] : this.checked;
    },
    indeterminate$(): boolean {
      if (this.checkAll) return this.checkboxGroup?.indeterminate;
      return this.indeterminate;
    },
  },

  render(): VNode {
    return (
      <label class={this.labelClasses} title={this.$attrs.title}>
        <input
          type="checkbox"
          on={{ ...omit(this.$listeners, ['checked', 'change']) }}
          class={`${name}__former`}
          disabled={this.disabled$}
          readonly={this.readonly}
          indeterminate={this.indeterminate$}
          name={this.name$}
          value={this.value}
          checked={this.checked$}
          onChange={this.handleChange}
        ></input>
        <span class={`${name}__input`}></span>
        <span class={`${name}__label`}>{renderContent(this, 'default', 'label')}</span>
      </label>
    );
  },

  methods: {
    handleChange(e: Event) {
      const value = !this.checked$;
      emitEvent<Parameters<TdCheckboxProps['onChange']>>(this, 'change', value, { e });
      e.stopPropagation();
      this?.checkboxGroup?.$emit('checked-change', {
        checked: value,
        checkAll: this.checkAll,
        e,
        option: this.$props,
      });
    },
  },
});
