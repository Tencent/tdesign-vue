import Vue, { VNode, VueConstructor } from 'vue';
import { renderContent } from '../utils/render-tnode';
import checkboxProps from './props';
import Group from './group';
import { omit } from '../utils/helper';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';
import { TdCheckboxProps } from './type';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('checkbox');

export type CheckboxGroupInstance = InstanceType<typeof Group>;

interface CheckboxInstance extends Vue {
  checkboxGroup: CheckboxGroupInstance;
}

export default mixins(classPrefixMixins, Vue as VueConstructor<CheckboxInstance>).extend({
  name: 'TCheckbox',

  inheritAttrs: false,

  props: { ...checkboxProps, stopLabelTrigger: Boolean },

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
        `${this.componentName}`,
        {
          [this.commonStatusClassName.checked]: this.checked$,
          [this.commonStatusClassName.disabled]: this.disabled$,
          [this.commonStatusClassName.indeterminate]: this.indeterminate$,
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
          class={`${this.componentName}__former`}
          disabled={this.disabled$}
          readonly={this.readonly}
          indeterminate={this.indeterminate$}
          name={this.name$}
          value={this.value}
          checked={this.checked$}
          onChange={this.handleChange}
        ></input>

        <span class={`${this.componentName}__input`}></span>
        <span class={`${this.componentName}__label`} onClick={this.handleLabelClick}>
          {renderContent(this, 'default', 'label')}
        </span>
      </label>
    );
  },

  methods: {
    handleLabelClick(e: Event) {
      // 在tree等组件中使用  阻止label触发checked 与expand冲突
      if (this.stopLabelTrigger) e.preventDefault();
    },
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
