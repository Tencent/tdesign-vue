import { prefix } from '../config';
import props from './props';
import TStepItem from './step-item';
import { ClassName } from '../common';
import mixins from '../utils/mixins';
import getLocalReceiverMixins from '../locale/local-receiver';
import { TdStepsProps } from './type';
import { emitEvent } from '../utils/event';

const name = `${prefix}-steps`;
export default mixins(getLocalReceiverMixins('steps')).extend({
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
  computed: {
    baseClass(): ClassName {
      if (this.direction) {
        console.warn('TDesign Steps Warn: `direction` is going to be deprecated. please use `layout` instead. ');
      }
      return [
        name,
        `${name}--${this.direction || this.layout}`,
        `${name}--${this.theme}-anchor`,
        {
          [`${name}--${this.sequence}`]: this.layout === 'vertical',
        },
      ];
    },
  },
  render() {
    let content;
    if (this.options && this.options.length) {
      content = this.options.map((item, index) => (
        <t-step-item
          props={{ ...item }}
          current={this.current}
          key={item.value || index}
        ></t-step-item>
      ));
    } else {
      content = this.$scopedSlots.default && this.$scopedSlots.default(null);
    }
    return <div class={this.baseClass}>{content}</div>;
  },
  methods: {
    addItem(item: InstanceType<typeof TStepItem>) {
      const index = this.stepChildren.length;
      // eslint-disable-next-line
      item.index = index;
      if (item.value !== undefined) {
        this.indexMap[item.value] = index;
      }
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
