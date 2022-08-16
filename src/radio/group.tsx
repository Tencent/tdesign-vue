import { VNode, CreateElement } from 'vue';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import props from './radio-group-props';
import {
  TdRadioGroupProps, RadioOptionObj, RadioOption, RadioValue,
} from './type';
import Radio from './radio';
import { TNodeReturnValue } from '../common';
import { emitEvent } from '../utils/event';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('radio-group');

export default mixins(classPrefixMixins).extend({
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
      barStyle: { width: '0px', left: '0px' },
      observer: null,
    };
  },

  computed: {
    checkedClassName(): string {
      return `.${this.classPrefix}-radio-button.${this.commonStatusClassName.checked}`;
    },
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
            props={option}
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

    const groupClass = [
      `${this.componentName}`,
      this.commonSizeClassName[this.size],
      {
        [`${this.componentName}__outline`]: this.variant === 'outline',
        [`${this.componentName}--filled`]: this.variant.includes('filled'),
        [`${this.componentName}--primary-filled`]: this.variant === 'primary-filled',
      },
    ];
    if (this.variant.includes('filled')) {
      children && children.push(<div style={this.barStyle} class={`${this.componentName}__bg-block`}></div>);
    }

    return <div class={groupClass}>{children}</div>;
  },

  watch: {
    value() {
      this.$nextTick(() => this.calcBarStyle());
    },
  },

  created() {
    this.$on('checked-change', this.handleRadioChange);
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
    handleRadioChange(value: RadioValue, context: { e: Event }): void {
      emitEvent<Parameters<TdRadioGroupProps['onChange']>>(this, 'change', value, context);
    },
    calcDefaultBarStyle(): void {
      const defaultNode = this.$el.cloneNode(true);
      const div = document.createElement('div');
      div.setAttribute('style', 'position: absolute; visibility: hidden;');
      div.appendChild(defaultNode);
      document.body.appendChild(div);

      const defaultCheckedRadio: HTMLElement = div.querySelector(this.checkedClassName);
      const { offsetWidth, offsetLeft } = defaultCheckedRadio;
      this.barStyle = { width: `${offsetWidth}px`, left: `${offsetLeft}px` };
      document.body.removeChild(div);
    },
    calcBarStyle(): void {
      if (this.variant === 'outline') return;

      const checkedRadio: HTMLElement = this.$el.querySelector(this.checkedClassName);
      if (!checkedRadio) return;

      const { offsetWidth, offsetLeft } = checkedRadio;
      // current node is not rendered，fallback to default render
      if (!offsetWidth) {
        this.calcDefaultBarStyle();
      } else {
        this.barStyle = { width: `${offsetWidth}px`, left: `${offsetLeft}px` };
      }
    },
  },
});
