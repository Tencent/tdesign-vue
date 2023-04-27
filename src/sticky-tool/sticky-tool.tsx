import { VNode } from 'vue';
import props from './props';
import TStickyItem from './sticky-item';
import type { ClassName, Styles } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';
import { emitEvent } from '../utils/event';

import type { TdStickyToolProps, TdStickyItemProps } from './type';

export default mixins(getConfigReceiverMixins('sticky-tool')).extend({
  name: 'TStickyTool',
  components: {
    TStickyItem,
  },
  props: { ...props },
  computed: {
    classes(): ClassName {
      return [this.componentName, `${this.componentName}--${this.shape}`];
    },
    styles(): Styles {
      const styles = this.getOffset();
      if (this.width) styles.width = typeof this.width === 'number' ? `${this.width}px` : this.width;
      return styles;
    },
  },
  render() {
    const nodes = this.$scopedSlots?.default && this.$scopedSlots.default(null);
    const list = this.getList();
    const content = list.map((item, index) => {
      const {
        type, shape, placement, popupProps, handleClick, handleHover,
      } = this;
      const itemProps = {
        ...item,
        type,
        shape,
        placement,
        basePopupProps: popupProps,
        baseWidth: this.styles.width,
        onClick: handleClick,
        onHover: handleHover,
        fatherCompName: this.componentName,
      };
      const stickyItem = <t-sticky-item props={itemProps} key={index}></t-sticky-item>;

      if (nodes && nodes[index]) {
        const vnode = nodes[index];
        if (vnode.componentOptions) {
          vnode.componentOptions.propsData = itemProps;
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
      if (this.list?.length) {
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
    getOffset(): Styles {
      // 默认偏移位置
      const position: Array<string | number> = this.offset ? [80, 24] : ['80px', '24px'];
      this.offset?.forEach((item, index) => {
        position[index] = isNaN(Number(item))
          ? `calc( ${position[index]}px + ${item})`
          : `${(position[index] as number) + (item as number)}px`;
      });
      const offsetStyle: Styles = {};
      this.placement.split('-').forEach((item, index) => {
        if (item !== 'center') {
          offsetStyle[item] = position[index];
        } else {
          offsetStyle.top = '50%';
          offsetStyle.transform = 'translate(0, -50%)';
        }
      });
      return offsetStyle;
    },
    handleClick(context: { e: MouseEvent; item: TdStickyItemProps }) {
      emitEvent<Parameters<TdStickyToolProps['onClick']>>(this, 'click', context);
    },
    handleHover(context: { e: MouseEvent; item: TdStickyItemProps }) {
      emitEvent<Parameters<TdStickyToolProps['onHover']>>(this, 'hover', context);
    },
  },
});
