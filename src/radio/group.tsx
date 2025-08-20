import { CreateElement, VNode } from 'vue';
import { isNumber, isString, throttle } from 'lodash-es';
import { CHECKED_CODE_REG } from '../_common/js/common';
import { TNodeReturnValue } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import { off, on } from '../utils/dom';
import { emitEvent } from '../utils/event';
import mixins from '../utils/mixins';
import Radio from './radio';
import RadioButton from './radio-button';
import props from './radio-group-props';
import type {
  RadioOption, RadioOptionObj, RadioValue, TdRadioGroupProps,
} from './type';

const classPrefixMixins = getClassPrefixMixins('radio-group');

export default mixins(classPrefixMixins).extend({
  name: 'TRadioGroup',
  props: {
    ...props,
  },

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
      groupResizeObserver: null,
      barStyle: { width: '0px', left: '0px' },
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

        const RadioComponent = this.theme === 'button' ? RadioButton : Radio;

        return (
          <RadioComponent
            props={option}
            key={`radio-group-options-${opt.value}-${index}`}
            name={this.name}
            checked={this.value === opt.value}
            disabled={'disabled' in opt ? opt.disabled : this.disabled}
            value={opt.value}
          >
            {typeof opt.label === 'function' ? opt.label(h) : opt.label}
          </RadioComponent>
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

    return (
      <div ref="radioGroupRef" class={groupClass}>
        {children}
      </div>
    );
  },

  watch: {
    value() {
      this.$nextTick(() => this.calcBarStyle());
    },
  },

  mounted() {
    this.calcBarStyle();
    this.groupResizeObserver = this.addResizeObserver(
      this.$el,
      throttle(async () => {
        this.$nextTick(() => this.calcBarStyle());
      }, 300),
    );
  },

  beforeDestroy() {
    this.removeKeyboardListeners();
    this.cleanupResizeObserver(this.groupResizeObserver, this.$el);
  },

  methods: {
    // 无障碍规划-键盘事件（在 group 中统一处理，不在 radio.tsx 中单独处理）
    addKeyboardListeners() {
      if (this.$refs.radioGroupRef) {
        on(this.$refs.radioGroupRef, 'keydown', this.checkRadioInGroup);
      }
    },

    removeKeyboardListeners() {
      if (this.$refs.radioGroupRef) {
        off(this.$refs.radioGroupRef, 'keydown', this.checkRadioInGroup);
      }
    },

    addResizeObserver(el: Element, callback: (data: ResizeObserverEntry[]) => void): ResizeObserver {
      const isSupport = typeof window !== 'undefined' && window.ResizeObserver;
      if (!isSupport) return;

      const containerObserver = new ResizeObserver(callback);
      containerObserver.observe(el);

      return containerObserver;
    },
    cleanupResizeObserver(observer: ResizeObserver, container: Element) {
      if (!observer || !container) return;
      observer.unobserve(container);
      observer.disconnect();
    },

    // 注意：此处会还原区分 数字 和 数字字符串
    checkRadioInGroup(e: KeyboardEvent) {
      const isCheckedCode = CHECKED_CODE_REG.test(e.key) || CHECKED_CODE_REG.test(e.code);
      if (isCheckedCode) {
        e.preventDefault();
        const inputNode = (e.target as HTMLElement).querySelector('input');
        const data = inputNode.dataset;
        if (inputNode.checked && data.allowUncheck) {
          this.handleRadioChange(undefined, { e });
        } else {
          // Number
          let value: number | string | boolean = !isNaN(Number(data.value)) ? Number(data.value) : data.value;
          // Boolean
          value = (typeof value === 'string' && { true: true, false: false }[value]) || value;
          // String
          value = typeof value === 'string' && value[0] === "'" ? value.replace(/'/g, '') : value;
          this.handleRadioChange(value, { e });
        }
      }
    },

    handleRadioChange(value: RadioValue, context: { e: Event }): void {
      emitEvent<Parameters<TdRadioGroupProps['onChange']>>(this, 'change', value, context);
    },

    calcDefaultBarStyle() {
      const defaultNode = (this.$refs.radioGroupRef as HTMLElement).cloneNode(true);
      const div = document.createElement('div');
      div.setAttribute('style', 'position: absolute; visibility: hidden;');
      div.appendChild(defaultNode);
      document.body.appendChild(div);

      const defaultCheckedRadio: HTMLElement = div.querySelector(this.checkedClassName);
      const { offsetWidth, offsetLeft } = defaultCheckedRadio;
      document.body.removeChild(div);
      return { offsetWidth, offsetLeft };
    },
    calcBarStyle(): void {
      if (this.variant === 'outline') return;

      const radioGroupEl = this.$refs.radioGroupRef as HTMLElement;
      if (!radioGroupEl) return;

      const checkedRadio: HTMLElement = radioGroupEl.querySelector(this.checkedClassName);
      if (!checkedRadio) return;

      let { offsetWidth, offsetLeft } = checkedRadio;
      // current node is not rendered，fallback to default render
      if (!offsetWidth) {
        const { offsetWidth: width, offsetLeft: left } = this.calcDefaultBarStyle();
        offsetWidth = width;
        offsetLeft = left;
      }
      const width = `${offsetWidth}px`;
      const left = `${offsetLeft}px`;
      if (this.barStyle.width === width && this.barStyle.left === left) return;
      this.barStyle = { width, left };
    },
  },
});
