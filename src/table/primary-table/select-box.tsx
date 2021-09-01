import Vue from 'vue';
import { Checkbox, CheckboxProps } from '../../checkbox';
import { Radio, RadioProps } from '../../radio';
import { prefix } from '../../config';

const inputType = {
  multiple: Checkbox,
  single: Radio,
};
type SelectionProps = RadioProps | CheckboxProps;

export default Vue.extend({
  name: `${prefix}-select-box`,
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      validator: (value): boolean => ['multiple', 'single'].includes(value),
      default: 'multiple',
    },
    checkProps: {
      type: Object,
      default(): SelectionProps {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {};
  },
  render(h) {
    const {
      checked, indeterminate, type, checkProps, disabled, $listeners,
    } = this;
    return h(inputType[type], {
      props: {
        checked,
        ...checkProps,
      },
      attrs: {
        style: 'display: inline-block',
        indeterminate,
        type: inputType[type],
        disabled,
      },
      on: { ...$listeners },
    });
  },
});
