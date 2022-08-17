import { VNode } from 'vue';
import Popup from '../popup';
import DropdownMenu from './dropdown-menu';
import { emitEvent } from '../utils/event';
import { DropdownOption } from './type';
import props from './props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('dropdown');

export default mixins(classPrefixMixins).extend({
  name: 'TDropdown',
  props: {
    ...props,
  },
  provide() {
    return {
      dropdown: this,
    };
  },
  methods: {
    handleMenuClick(data: DropdownOption, context: { e: MouseEvent }) {
      if (this.hideAfterItemClick) {
        const { popupElem }: any = this.$refs;
        popupElem.handleClose();
      }
      emitEvent(this, 'click', data, context);
    },
  },
  render() {
    const trigger: VNode[] | VNode | string = this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    const contentSlot: VNode[] | VNode | string = this.$scopedSlots.dropdown ? this.$scopedSlots.dropdown(null) : '';

    const popupProps = {
      props: {
        ...this.$attrs,
        ...this.popupProps,
        disabled: this.disabled,
        placement: this.placement,
        trigger: this.trigger,
        overlayClassName:
          this.popupProps && this.popupProps.overlayClassName
            ? [this.componentName, this.popupProps.overlayClassName]
            : this.componentName,
      },
      ...this.popupProps,
      ref: 'popup',
    };

    return (
      <Popup {...popupProps} ref="popupElem" expandAnimation={true}>
        <template slot="content" role="dropdown">
          {contentSlot || <DropdownMenu />}
        </template>
        {trigger}
      </Popup>
    );
  },
});
