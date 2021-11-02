import Vue, { VNode, CreateElement } from 'vue';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import props from './radio-group-props';
import { RadioOptionObj, RadioOption, RadioValue } from './type';
import { prefix } from '../config';
import Radio, { radioBtnName } from './radio';
import { TNodeReturnValue } from '../common';
import CLASSNAMES from '../utils/classnames';

const name = `${prefix}-radio-group`;

export default Vue.extend({
  name: 'TRadioGroup',
  props: { ...props },

  components: {
    Radio,
  },

  provide(): Record<string, any> {
    return {
      radioGroup: this,
    };
  },

  data() {
    return {
      barStyle: {},
      observer: null,
    };
  },

  render(h: CreateElement): VNode {
    const { $scopedSlots } = this;
    let children: TNodeReturnValue = $scopedSlots.default && $scopedSlots.default(null);

    if (this.options && this.options.length) {
      children = this.options.map((option: RadioOption, index) => {
        let opt = option as RadioOptionObj;
        if (isNumber(option) || isString(option)) {
          opt = { value: option, label: option.toString() };
        }
        return (
          <Radio
            key={`radio-group-options-${opt.value}-${index}`}
            name={this.name}
            checked={this.value === opt.value}
            disabled={'disabled' in opt ? opt.disabled : this.disabled}
            value={opt.value}
          >
            {typeof opt.label === 'function' ? opt.label(h) : opt.label}
          </Radio>
        );
      });
    }

    // TODO 移除 buttonStyle api, 改用 variant
    if (this.buttonStyle === 'solid') {
      console.error('TDesign Radio Warn: buttonStyle will be deprecated, please use `variant` instead.');
    }
    const groupClass = [`${name}`, `${name}-${this.size}`, {
      [`${name}-outline`]: this.variant === 'outline',
      [`${name}-filled`]: this.buttonStyle === 'solid' || this.variant.includes('filled'),
      [`${name}-primary-filled`]: this.variant === 'primary-filled',
    }];
    if (this.buttonStyle === 'solid' || this.variant.includes('filled')) {
      children && children.push(<div style={this.barStyle} class={`${name}-filled-bg-block`}></div>);
    }

    return <div class={groupClass}>{children}</div>;
  },

  watch: {
    value() {
      this.$nextTick(() => this.calcBarStyle());
    },
  },

  mounted() {
    this.calcBarStyle();

    const observer = new MutationObserver(this.calcBarStyle);
    observer.observe(this.$el, { childList: true, attributes: true, subtree: true });
    this.observer = observer;
  },

  beforeDestroy() {
    this.observer.disconnect();
  },

  methods: {
    handleRadioChange(value: RadioValue, context: { e: Event }) {
      this.$emit('change', value, context);
      typeof this.onChange === 'function' && this.onChange(value, context);
    },
    calcBarStyle() {
      if (this.buttonStyle !== 'solid' && this.variant === 'outline') return;

      const checkedRadio: HTMLElement = this.$el.querySelector(`.${radioBtnName}.${CLASSNAMES.STATUS.checked}`);
      if (!checkedRadio) return;
      const { offsetWidth, offsetLeft } = checkedRadio;
      this.barStyle = { width: `${offsetWidth}px`, left: `${offsetLeft}px` };
    },
  },
});
