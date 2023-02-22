import { VNode } from 'vue';
import props from './props';
import TStickyItem from './sticky-item';
import { ClassName, Styles } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';
import { TdStickyItemProps } from './type';

export default mixins(getConfigReceiverMixins('sticky-tool')).extend({
  name: 'TStickyTool',
  components: {
    TStickyItem,
  },
  props: { ...props },
  computed: {
    classes(): ClassName {
      return [
        this.componentName,
        `${this.componentName}--${this.shape}`,
        `${this.componentName}--${this.shape}-shadow`,
        `${this.componentName}--${this.placement}`,
      ];
    },
    styles(): Styles {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        // left: this.getOffset(item.offset[0]),
        // top: this.getOffset(item.offset[1]),
      };
    },
  },
  render() {
    const nodes = this.$scopedSlots?.default && this.$scopedSlots.default(null);
    const list = this.getList();
    const content = list.map((item, index) => {
      const stickyItem = (
        <t-sticky-item
          props={{
            ...item,
            type: this.type,
            onClick: this.onClick,
            onHover: this.onHover,
          }}
          key={item.label || index}
        ></t-sticky-item>
      );

      if (nodes && nodes[index]) {
        const vnode = nodes[index];
        if (vnode.componentOptions) {
          vnode.componentOptions.propsData = item;
          return vnode;
        }
        return stickyItem;
      }
      return stickyItem;
    });
    return (
      <div class={this.classes} style={this.styles}>
        {content}
      </div>
    );
  },
  methods: {
    getList() {
      const nodes = this.$scopedSlots?.default && this.$scopedSlots.default(null);
      let list: Array<TdStickyItemProps>;
      if (this.list && this.list.length) {
        list = this.list;
      } else {
        list = this.getListBySlots(nodes);
      }
      return list;
    },
    getListBySlots(nodes: VNode[]) {
      const arr: Array<TdStickyItemProps> = [];
      nodes?.forEach((node) => {
        const option = node?.componentOptions?.propsData;
        if (!option) return;
        arr.push(option);
      });
      return arr;
    },
    getOffset(val: string | number) {
      if (!val) return;
      return isNaN(Number(val)) ? val : `${val}px`;
    },
  },
});
