import props from './sticky-item-props';
import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item')).extend({
  name: 'TStickyItem',
  props: {
    ...props,
    type: String,
    onClick: Function,
    onHover: Function,
  },
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
    return (
      <div class={this.baseClass}>
        <div class={this.iconClass}>{icon}</div>
        {this.type === 'normal' ? <p>{this.label}</p> : <div></div>}
      </div>
    );
  },
  methods: {},
});
