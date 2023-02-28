import props from './sticky-item-props';
import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item'), getGlobalIconMixins()).extend({
  name: 'TStickyItem',
  props: {
    ...props,
    type: String,
    shape: String,
    onClick: Function,
    onHover: Function,
  },
  computed: {
    baseClass(): ClassName {
      return [`${this.componentName}`, `${this.componentName}--${this.type}`, `${this.componentName}--${this.shape}`];
    },
    labelClass(): ClassName {
      return [`${this.componentName}__label`];
    },
  },
  render() {
    const icon = renderTNodeJSX(this, 'icon');
    return (
      <div class={this.baseClass}>
        {icon}
        {this.type === 'normal' ? <div class={this.labelClass}>{this.label}</div> : null}
      </div>
    );
  },
  methods: {},
});
