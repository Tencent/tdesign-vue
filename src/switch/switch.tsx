import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import Loading from '../loading';
import { SwitchValue } from './type';
import props from './props';
import { ClassName, TNodeReturnValue } from '../common';

const name = `${prefix}-switch`;

export default Vue.extend({
  name: 'TSwitch',

  props: { ...props },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      // 表单控制禁用态时的变量
      formDisabled: undefined,
    };
  },

  computed: {
    classes(): ClassName {
      return [
        `${name}`,
        CLASSNAMES.SIZE[this.size],
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
          [CLASSNAMES.STATUS.loading]: this.loading,
          [CLASSNAMES.STATUS.checked]: this.value === this.activeValue,
        },
      ];
    },
    nodeClasses(): ClassName {
      return [
        `${name}__handle`,
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
          [CLASSNAMES.STATUS.loading]: this.loading,
        },
      ];
    },
    contentClasses(): ClassName {
      return [
        `${name}__content`,
        CLASSNAMES.SIZE[this.size],
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
        },
      ];
    },
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    activeValue(): SwitchValue {
      if (this.customValue && this.customValue.length > 0) {
        return this.customValue[0];
      }
      return true;
    },
    inactiveValue(): SwitchValue {
      if (this.customValue && this.customValue.length > 1) {
        return this.customValue[1];
      }
      return false;
    },
    content(): TNodeReturnValue {
      if (typeof this.label === 'function') {
        return this.label(this.$createElement, { value: this.value });
      }
      if (typeof this.label === 'string') {
        return this.label;
      }
      if (Array.isArray(this.label)) {
        const label = this.value === this.activeValue ? this.label[0] : this.label[1];
        if (!label) return;
        if (typeof label === 'string') {
          return label;
        }
        if (typeof label === 'function') {
          return label(this.$createElement);
        }
      }
      if (this.$scopedSlots.label) {
        return this.$scopedSlots.label({ value: this.value });
      }
      return null;
    },
  },
  watch: {
    value: {
      handler(val: SwitchValue): void {
        if (this.customValue && this.customValue.length && !this.customValue.includes(val)) {
          throw `value is not in ${JSON.stringify(this.customValue)}`;
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleToggle(): void {
      const checked = this.value === this.activeValue ? this.inactiveValue : this.activeValue;
      typeof this.onChange === 'function' && this.onChange(checked);
      this.$emit('change', checked);
    },
    toggle(): void {
      if (this.tDisabled || this.loading) {
        return;
      }
      this.handleToggle();
    },
  },
  render(): VNode {
    const {
      loading, disabled, content, nodeClasses, classes, toggle, contentClasses,
    } = this;

    let switchContent: TNodeReturnValue;
    let loadingContent: TNodeReturnValue;

    if (loading) {
      loadingContent = <Loading size="small" />;
    } else if (content) {
      switchContent = content;
    }

    return (
      <div class={classes} disabled={disabled} onClick={toggle}>
        <span class={nodeClasses}>{loadingContent}</span>
        <div class={contentClasses}>{switchContent}</div>
      </div>
    );
  },
});
