import { defineComponent, toRefs } from '@vue/composition-api';
import props from './props';
import ColorPanel from './panel';
import { usePrefixClass } from '../config-provider/useConfig';
import useVModel from '../hooks/useVModel';
import { TdColorContext } from './interfaces';

export default defineComponent({
  name: 'TColorPickerPanel',
  components: {
    ColorPanel,
  },
  inheritAttrs: false,
  props: {
    ...props,
  },
  setup(props) {
    const prefix = usePrefixClass();
    const { value } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

    const handleChange = (value: string, context: TdColorContext) => {
      setInnerValue(value, context);
    };

    return {
      prefix,
      innerValue,
      setInnerValue,
      handleChange,
    };
  },
  render() {
    const { prefix, innerValue, handleChange } = this;
    return (
      <color-panel
        {...{
          props: {
            ...this.$props,
            closeBtn: false,
            popupProps: null,
            value: innerValue,
          },
        }}
        on={{ change: handleChange }}
        class={`${prefix}-is-inline`}
      />
    );
  },
});
