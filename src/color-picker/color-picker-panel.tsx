import { defineComponent } from '@vue/composition-api';
import props from './props';
import ColorPanel from './panel';
import { usePrefixClass } from '../config-provider/useConfig';

export default defineComponent({
  name: 'TColorPickerPanel',
  components: {
    ColorPanel,
  },
  inheritAttrs: false,
  props: {
    ...props,
  },
  setup() {
    const prefix = usePrefixClass();
    return {
      prefix,
    };
  },
  render() {
    const { prefix } = this;
    return (
      <color-panel
        {...{
          props: {
            ...this.$props,
            closeBtn: false,
            popupProps: null,
          },
        }}
        class={`${prefix}-is-inline`}
      />
    );
  },
});
