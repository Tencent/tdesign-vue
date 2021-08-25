import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import Popup from '../popup/index';
import DropdownMenu from './dropdown-menu';
import { emitEvent } from '../utils/event';
import { DropdownOption } from './type';
import props from './props';
import bus from './bus';

const name = `${prefix}-dropdown`;

let instanceCount = 0; // 组件实例数目

export default Vue.extend({
  name,
  props: {
    ...props,
  },
  data() {
    instanceCount += 1;
    return {
      busId: `${instanceCount}`,
    };
  },
  mounted() {
    bus.$on(`${this.busId}item-click`, (data: DropdownOption, e: MouseEvent) => {
      if (this.hideAfterItemClick) {
        const {
          popupElem,
        }: any = this.$refs;
        popupElem.doClose();
      }
      emitEvent(this, 'click', data, { e });
    });
  },
  render() {
    const trigger: VNode[] | VNode | string = this.$scopedSlots.default
      ? this.$scopedSlots.default(null) : '';

    const popupProps = {
      props: {
        ...this.$attrs,
        ...this.popupProps,
        disabled: this.disabled,
        showArrow: false,
        placement: this.placement,
        trigger: this.trigger,
        overlayClassName: name,
      },
      ref: 'popup',
    };

    return (
      <Popup {...popupProps} ref="popupElem" expandAnimation={true}>
        <template slot='content' role='dropdown'>
          <DropdownMenu
            busId={this.busId}
            options={this.options}
            maxHeight={this.maxHeight}
            maxColumnWidth={this.maxColumnWidth}
            minColumnWidth={this.minColumnWidth}
          />
        </template>
        {trigger}
      </Popup>
    );
  },
});
