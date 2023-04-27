import baseProps from './sticky-item-props';
import TdStickyToolProps from './props';
import type { TdStickyItemProps } from './type';
import type { ClassName, Styles } from '../common';
import Popup from '../popup';
import PopupProps from '../popup/props';
import { renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins('sticky-item'), getGlobalIconMixins()).extend({
  name: 'TStickyItem',
  props: {
    ...baseProps,
    type: TdStickyToolProps.type,
    shape: TdStickyToolProps.shape,
    placement: TdStickyToolProps.placement,
    basePopupProps: PopupProps,
    baseWidth: TdStickyToolProps.width,
    onClick: TdStickyToolProps.onClick,
    onHover: TdStickyToolProps.onHover,
    fatherCompName: String,
  },
  computed: {
    baseClass(): ClassName {
      return [`${this.componentName}`, `${this.componentName}--${this.type}`, `${this.componentName}--${this.shape}`];
    },
    labelClass(): ClassName {
      return [`${this.componentName}__label`];
    },
    popupPlacement(): String {
      return this.placement.indexOf('right') !== -1 ? 'left' : 'right';
    },
    styles(): Styles {
      const styles: Styles = {};
      if (this.baseWidth) {
        const selfWidth = this.type === 'normal' ? '56px' : '40px';
        styles.margin = `calc((${this.baseWidth} - ${selfWidth})/2)`;
      }
      return styles;
    },
  },
  render() {
    const icon = renderTNodeJSX(this, 'icon');
    const label = renderTNodeJSX(this, 'label');
    const popup = renderTNodeJSX(this, 'popup');
    return (
      <Popup
        overlayInnerClassName={`${this.fatherCompName}-popup-content`}
        trigger={this.trigger}
        hideEmptyPopup={true}
        placement={this.popupPlacement}
        content={() => popup}
        props={this.popupProps || this.basePopupProps}
      >
        <div
          class={this.baseClass}
          style={this.styles}
          onClick={this.handleClickItem}
          onMouseenter={this.handleHoverItem}
        >
          {icon}
          {this.type === 'normal' ? <div class={this.labelClass}>{label}</div> : null}
        </div>
      </Popup>
    );
  },
  methods: {
    handleClickItem(e: MouseEvent) {
      const item: TdStickyItemProps = {};
      Object.keys(baseProps).forEach((i) => (item[i] = this[i]));
      this.onClick({ e, item });
    },
    handleHoverItem(e: MouseEvent) {
      const item: TdStickyItemProps = {};
      Object.keys(baseProps).forEach((i) => (item[i] = this[i]));
      this.onHover({ e, item });
    },
  },
});
