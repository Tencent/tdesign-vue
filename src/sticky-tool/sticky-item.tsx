import { VNode } from 'vue';
import props from './props';
import { ClassName } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item')).extend({
  name: 'TStickyItem',
  props: { ...props },
  computed: {
    classes(): ClassName {
      return [
        this.componentName,
        `${this.componentName}--${this.shape}`,
        `${this.componentName}--${this.shape}-shadow`,
      ];
    },
  },
  render() {
    return <div class={this.classes}></div>;
  },
  methods: {},
});
