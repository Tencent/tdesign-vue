import { VNode } from 'vue';
import props from './props';
import { ClassName } from '../common';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item')).extend({
  name: 'TStickyItem',
  props: { ...props },
  computed: {
    baseClass(): ClassName {
      return [`${this.componentName}-item`, `${this.componentName}-item--${this.type}`];
    },
    iconClass(): ClassName {
      return [`${this.componentName}-item__icon`];
    },
  },
  render() {
    const icon = renderTNodeJSX(this, 'icon');
    return <div class={this.baseClass}>{icon}</div>;
  },
  methods: {},
});
