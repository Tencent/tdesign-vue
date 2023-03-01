import props from './sticky-item-props';
import { ClassName } from '../common';
import Popup, { PopupProps } from '../popup';
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
  // data(){
  //   return {
  //     popupVisible: false,
  //   }
  // },
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
    const label = renderTNodeJSX(this, 'label');
    const popup = renderTNodeJSX(this, 'popup');
    return (
      <Popup
        // visible={this.popupVisible}
        trigger={this.trigger}
        hideEmptyPopup={true}
        content={this.popup}
        props={this.popupProps}
      >
        <div class={this.baseClass}>
          {icon}
          {this.type === 'normal' ? <div class={this.labelClass}>{label}</div> : null}
        </div>
      </Popup>
    );
  },
  methods: {},
});
