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
      stepChildren: [],
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
      if (this.direction) {
        console.warn('TDesign Steps Warn: `direction` is going to be deprecated. please use `layout` instead. ');
      }
      const layout = this.layout || this.direction || 'horizontal';
      return [
        name,
        `${name}--${layout}`,
        `${name}--${this.theme}-anchor`,
        {
          [`${name}--${this.sequence}`]: layout === 'vertical',
        },
      ];
    },
  },
  render() {
    let options: Array<TdStepItemProps>;
    if (this.options && this.options.length) {
      options = this.options;
    } else {
      const nodes = this.$scopedSlots.default && this.$scopedSlots.default(null);
      options = this.getOptionListBySlots(nodes);
    }
    options.forEach((item, index) => {
      if (item?.value !== undefined) {
        this.indexMap[item.value] = index;
      }
    });
    const content = options.map((item, index) => (
        <t-step-item
          props={{ ...item }}
          current={this.current}
          key={item.value || index}
          status={this.handleStatus(item, index)}
        ></t-step-item>
    ));
    return <div class={this.baseClass}>{content}</div>;
  },
  methods: {
    getOptionListBySlots(nodes: VNode[]) {
      const arr: Array<TdStepItemProps> = [];
      nodes?.forEach((node) => {
        const option = node?.componentOptions?.propsData;
        option && arr.push(option);
      });
      return arr;
    },
    handleStatus(item: TdStepItemProps, index: number) {
      if (item.status && item.status !== 'default') return item.status;
      if (this.current === 'FINISH') return 'finish';
      // value 不存在时，使用 index 进行区分每一个步骤
      if (item.value === undefined && index < this.current) return 'finish';
      // value 存在，找匹配位置
      if (item.value !== undefined) {
        const matchIndex = this.indexMap[this.current];
        if (matchIndex === undefined) {
          console.warn('TDesign Steps Warn: The current `value` is not exist.');
          return 'wait';
        }
        if (index < matchIndex) return 'finish';
      }
      const key = item.value === undefined ? index : item.value;
      if (key === this.current) return 'process';
      return 'default';
    },
    addItem(item: InstanceType<typeof TStepItem>) {
      const index = this.stepChildren.length;
      // eslint-disable-next-line
      item.index = index;
      this.stepChildren.push(item);
    },
    removeItem(item: InstanceType<typeof TStepItem>) {
      this.stepChildren = this.stepChildren.filter((t) => t !== item);
    },
    handleChange(cur: TdStepsProps['current'], prev: TdStepsProps['current'], e: MouseEvent) {
      emitEvent<Parameters<TdStepsProps['onChange']>>(this, 'change', cur, prev, { e });
    },
  },
});
