import Vue from 'vue';
import { prefix } from '../config';
import props from '../../types/steps/props';
import TStepItem from '../step-item/';

const name = `${prefix}-steps`;
export default Vue.extend({
  name,
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
      return [
        name,
        `${name}--${this.direction}`,
        `${name}--${this.theme}-anchor`,
        {
          [`${name}--${this.sequence}`]: this.direction === 'vertical',
        },
      ];
    },
    valueIndexMap() {
      const map = {};

      return map;
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
      this.stepChildren = this.stepChildren.filter(t => t !== item);
    },
  },
});
