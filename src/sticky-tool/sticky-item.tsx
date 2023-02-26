import props from './sticky-item-props';
import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item'), getGlobalIconMixins()).extend({
  name: 'TStickyItem',
  props: {
    ...props,
    type: {
      type: String,
      default: 'normal',
    },
    shape: {
      type: String,
      default: 'square',
    },
    onClick: Function,
    onHover: Function,
  },
  computed: {
    baseClass(): ClassName {
      return [`${this.componentName}`, `${this.componentName}--${this.type}`, `${this.componentName}--${this.shape}`];
    },
    iconClass(): ClassName {
      return [`${this.componentName}__icon`];
    },
    labelClass(): ClassName {
      return [`${this.componentName}__label`];
    },
  },
  render() {
    const icon = renderTNodeJSX(this, 'icon');
    return (
      <div class={this.baseClass}>
        <div class={this.iconClass}>{icon}</div>
        {this.type === 'normal' ? <div class={this.labelClass}>{this.label}</div> : null}
      </div>
    );
  },
  methods: {},
});
