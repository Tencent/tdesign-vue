import { VNode } from 'vue';
import mixins from '../utils/mixins';
import getLocalReceiverMixins from '../locale/local-receiver';
import { prefix } from '../config';
import props from './step-item-props';
import TIconCheck from '../icon/check';
import TIconClose from '../icon/close';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import Steps from '../steps/steps';
import isFunction from 'lodash/isFunction';
import { ClassName } from '../common';

const name = `${prefix}-steps-item`;

export interface StepItemType extends Vue {
  steps: InstanceType<typeof Steps>;
}

export default mixins(getLocalReceiverMixins<StepItemType>('steps')).extend({
  name,
  props: {
    ...props,
  },
  components: {
    TIconCheck,
    TIconClose,
  },
  inject: {
    steps: { default: undefined },
  },
  data() {
    return {
      index: -1,
    };
  },
  computed: {
    current(): string | number {
      return this.steps && this.steps.current;
    },
    status$(): string {
      if (this.status !== 'default') return this.status;
      // value 不存在时，使用 index 进行区分每一个步骤
      if (this.value === undefined && this.index < this.current) return 'finish';
      if (this.value !== undefined && this.index < this.steps.indexMap[this.current]) return 'finish';
      const key = this.value === undefined ? this.index : this.value ;
      if (key === this.current) return 'process';
      return 'wait';
    },
    baseClass(): ClassName {
      return [
        name,
        { [`${name}--${this.status$}`]: this.status$ },
      ];
    },
    iconClass(): ClassName {
      return [
        `${name}-icon`,
        { [`${name}--${this.status$}`]: this.status$ },
      ];
    },
    canClick(): boolean {
      return this.status$ !== 'process';
    },
  },
  mounted() {
    this.steps.addItem(this);
  },
  destroyed() {
    this.steps.removeItem(this);
  },
  methods: {
    renderIcon() {
      let defaultIcon;
      if (this.steps.theme === 'default') {
        let icon: VNode | string = '';
        switch (this.status$) {
          case 'finish':
            icon = <t-icon-check name="check" />;
            break;
          case 'error':
            if (isFunction(this.locale.errorIcon)) {
              icon = this.locale.errorIcon(this.$createElement);
            } else {
              icon = <t-icon-close name="close" />;
            }
            break;
            // default 包含 case 'process' 的情况
          default:
            icon = String(this.index + 1);
            break;
        }
        defaultIcon = <span class={`${name}-icon__number`}>{icon}</span>;
      }
      return renderTNodeJSX(this, 'icon', defaultIcon);
    },
    onStepClick(e: MouseEvent) {
      const val = this.value === undefined ? this.index : this.value;
      this.steps.$emit('change', val, this.current, { e });
    },
  },
  render() {
    const content = renderContent(this, 'default', 'content');
    return (
      <div class={this.baseClass}>
        <div class={`${name}__inner ${this.canClick ? `${name}-canclick` : ''}`} onClick={this.onStepClick} >
          <div class={this.iconClass}>{this.renderIcon()}</div>
          <div class={`${name}-content`}>
            <div class={`${name}-title`}>{renderTNodeJSX(this, 'title')}</div>
            <div class={`${name}-description`}>{content}</div>
            <div class={`${name}-extra`}>{renderTNodeJSX(this, 'extra')}</div>
          </div>
        </div>
      </div>
    );
  },
});
