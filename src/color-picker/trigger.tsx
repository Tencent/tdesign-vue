import {
  defineComponent, PropType, ref, watch,
} from '@vue/composition-api';
import { Input as TInput } from '../input';
import { InputNumber as TInputNumber } from '../input-number';
import { Color } from './utils';
import { TdColorPickerProps } from './type';
import { useBaseClassName } from './hooks';
import { TdColorHandler } from './interfaces';

export default defineComponent({
  name: 'DefaultTrigger',
  components: {
    TInput,
    TInputNumber,
  },
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputProps: {
      type: Object as PropType<TdColorPickerProps['inputProps']>,
      default: () => ({
        autoWidth: true,
      }),
    },
    handleTriggerChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const value = ref(props.color);

    watch(
      () => [props.color],
      () => (value.value = props.color),
    );

    const handleChange = (input: string) => {
      if (input === props.color) {
        return;
      }
      if (!Color.isValid(input)) {
        value.value = props.color;
      } else {
        value.value = input;
      }
      props.handleTriggerChange(value.value);
    };

    return {
      baseClassName,
      value,
      handleChange,
    };
  },

  render() {
    const { baseClassName } = this;
    const inputSlots = {
      label: () => (
        <div class={[`${baseClassName}__trigger--default__color`, `${baseClassName}--bg-alpha`]}>
          <span
            class={['color-inner']}
            style={{
              background: this.value,
            }}
          ></span>
        </div>
      ),
    };
    return (
      <div class={`${baseClassName}__trigger--default`}>
        <t-input
          {...{
            props: {
              ...this.inputProps,
            },
          }}
          scopedSlots={inputSlots}
          v-model={this.value}
          disabled={this.disabled}
          onBlur={this.handleChange}
        />
      </div>
    );
  },
});
