import Vue, { VNode } from 'vue';
import { PLACEMENT_OFFSET } from './const';
import TMessage from './message';
import { prefix } from '../config';
import { MessageOptions } from './type';
import { Styles } from '../common';

export const DEFAULT_Z_INDEX = 5000;

const getUniqueId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();

const name = `${prefix}-message__list`;

export const MessageList = Vue.extend({
  name,
  components: { TMessage },
  props: {
    zIndex: Number,
    placement: String,
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    styles(): Styles {
      return {
        ...PLACEMENT_OFFSET[this.placement],
        zIndex: this.zIndex !== DEFAULT_Z_INDEX ? this.zIndex : DEFAULT_Z_INDEX,
      };
    },
  },
  methods: {
    add(msg: MessageOptions): number {
      const mg = {
        ...msg,
        key: getUniqueId(),
        placement: this.placement,
      };
      this.list.push(mg);
      return this.list.length - 1;
    },
    remove(index: number) {
      this.list.splice(index, 1);
    },
    removeAll() {
      this.list = [];
    },
    getOffset(val: string | number) {
      if (!val) return;
      return isNaN(Number(val)) ? val : `${val}px`;
    },
    msgStyles(item: { offset: object }) {
      return (
        item.offset && {
          position: 'relative',
          left: this.getOffset(item.offset[0]),
          top: this.getOffset(item.offset[1]),
        }
      );
    },
    getListeners(index: number) {
      return {
        'close-btn-click': () => this.remove(index),
        'duration-end': () => this.remove(index),
      };
    },
  },
  render(): VNode {
    if (!this.list.length) return;
    return (
      <div class={name} style={this.styles}>
        {this.list.map((item, index) => (
          <t-message
            key={item.key}
            style={this.msgStyles(item)}
            {...{ props: item }}
            {...{ on: this.getListeners(index) }}
          />
        ))}
      </div>
    );
  },
});

export default MessageList;
