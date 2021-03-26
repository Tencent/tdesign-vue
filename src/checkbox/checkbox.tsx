import Vue, { VueConstructor, VNode } from 'vue';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import checkboxProps from '@TdTypes/checkbox/props';

const name = `${prefix}-checkbox`;

interface CheckboxInstance extends Vue {
  checkboxGroup: any;
}

export default (Vue as VueConstructor<CheckboxInstance>).extend({
  name,
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  inject: {
    checkboxGroup: { default: undefined },
  },
  props: { ...checkboxProps },
  computed: {
    labelClasses(): ClassName {
      return [
        `${name}`,
        {
          [CLASSNAMES.STATUS.checked]: this.checked$,
          [CLASSNAMES.STATUS.disabled]: this.disabled$,
          [CLASSNAMES.STATUS.indeterminate]: this.indeterminate,
        },
      ];
    },
    isCheckAll(): boolean {
      return this.$attrs['data-name'] === 'TDESIGN_CHECK_ALL';
    },
    disabled$(): boolean {
      if (this.disabled !== undefined) return this.disabled;
      return !!(this.checkboxGroup && this.checkboxGroup.disabled);
    },
    name$(): string {
      return this.name || (this.checkboxGroup && this.checkboxGroup.name);
    },
    checked$(): boolean {
      if (this.isCheckAll) return this.checked;
      if (this.checkboxGroup) {
        const val = this.checkboxGroup.value;
        if (val instanceof Array) {
          return val.includes(this.value);
        }
      }
      return this.checked;
    },
  },

  render(): VNode {
    return (
      <label class={this.labelClasses}>
        <input
          type='checkbox'
          class={`${name}__former`}
          disabled={this.disabled$}
          readonly={this.readonly}
          indeterminate={this.indeterminate}
          name={this.name$}
          value={this.value}
          checked={this.checked$}
          onChange={this.handleChange}
        ></input>
        <span class={`${name}__input`}></span><span class={`${name}__label`}>
          {this.$scopedSlots.default && this.$scopedSlots.default(null)}
        </span>
      </label>
    );
  },

  methods: {
    handleChange(e: Event) {
      const target = e.target as HTMLInputElement;
      this.$emit('change', target.checked, { e });
      (typeof this.onChange === 'function') && this.onChange(target.checked, { e });
      e.stopPropagation();
      if (this.checkboxGroup && !this.isCheckAll) {
        this.checkboxGroup.handleCheckboxChange({ checked: target.checked, e, option: this.$props });
      }
    },
  },
});
