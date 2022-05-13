import { VNode } from 'vue';
import { prefix } from '../config';
import props from './props';
import TStepItem from './step-item';
import { ClassName } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';
import { TdStepsProps, TdStepItemProps } from './type';
import { emitEvent } from '../utils/event';

const name = `${prefix}-steps`;
export default mixins(getConfigReceiverMixins('steps')).extend({
  name: 'TSteps',
  components: {
    TStepItem,
  },
  props: { ...props },
  data() {
    return {
      indexMap: {},
    };
  },
  provide(): { steps: any } {
    return {
      steps: this,
    };
  },
  watch: {
    options: {
      immediate: true,
      handler() {
        if (!this.options) return;
        this.options.forEach((item, index) => {
          if (item.value !== undefined) {
            this.indexMap[item.value] = index;
          }
        });
      },
    },
  },
  computed: {
    baseClass(): ClassName {
      return [
        name,
        `${name}--${this.layout}`,
        `${name}--${this.sequence}`,
        `${name}--${this.handleTheme()}-anchor`,
        `${name}--${this.separator}-separator`,
      ];
    },
  },
  render() {
    const nodes = this.$scopedSlots?.default && this.$scopedSlots.default(null);
    const options = this.getOptions();
    const content = options.map((item, index) => {
      const stepIndex = this.sequence === 'reverse' ? options.length - index - 1 : index;
      const propsData = {
        ...item,
        index: stepIndex,
        status: this.handleStatus(item, index),
      };

      const stepItem = (
        <t-step-item
          props={{
            ...item,
            index: stepIndex,
            status: this.handleStatus(item, index),
          }}
          key={item.value || index}
        ></t-step-item>
      );

      if (nodes && nodes[index]) {
        const vnode = nodes[index];
        if (vnode.componentOptions) {
          vnode.componentOptions.propsData = propsData;
          return vnode;
        }
        return stepItem;
      }
      return stepItem;
    });
    return <div class={this.baseClass}>{content}</div>;
  },
  methods: {
    getOptions() {
      const nodes = this.$scopedSlots?.default && this.$scopedSlots.default(null);
      let options: Array<TdStepItemProps>;
      if (this.options && this.options.length) {
        options = this.sequence === 'reverse' ? this.options.reverse() : this.options;
      } else {
        options = this.getOptionListBySlots(nodes);
      }
      return options;
    },
    getOptionListBySlots(nodes: VNode[]) {
      const arr: Array<TdStepItemProps> = [];
      nodes?.forEach((node) => {
        const option = node?.componentOptions?.propsData;
        if (!option) return;
        this.sequence === 'reverse' ? arr.unshift(option) : arr.push(option);
      });
      return arr;
    },
    handleTheme() {
      let { theme } = this;
      const options = this.getOptions();
      options.forEach((item) => {
        if (item?.icon !== undefined) {
          // icon > theme
          theme = 'default';
        }
      });
      return theme;
    },
    handleStatus(item: TdStepItemProps, index: number) {
      if (item.status && item.status !== 'default') return item.status;
      if (this.current === 'FINISH') return 'finish';
      // value 不存在时，使用 index 进行区分每一个步骤
      if (item.value === undefined) {
        if (this.sequence === 'positive' && index < this.current) return 'finish';
        if (this.sequence === 'reverse' && index > this.current) return 'finish';
      }
      // value 存在，找匹配位置
      if (item.value !== undefined) {
        const matchIndex = this.indexMap[this.current];
        if (matchIndex === undefined) {
          console.warn('TDesign Steps Warn: The current `value` is not exist.');
          return 'default';
        }
        if (this.sequence === 'positive' && index < matchIndex) return 'finish';
        if (this.sequence === 'reverse' && index > matchIndex) return 'finish';
      }
      const key = item.value === undefined ? index : item.value;
      if (key === this.current) return 'process';
      return 'default';
    },
    handleChange(cur: TdStepsProps['current'], prev: TdStepsProps['current'], e: MouseEvent) {
      emitEvent<Parameters<TdStepsProps['onChange']>>(this, 'change', cur, prev, { e });
    },
  },
});
