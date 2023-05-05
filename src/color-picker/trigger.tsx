import {
  defineComponent, PropType, ref, watch,
} from '@vue/composition-api';
import { Input as TInput } from '../input';
import { InputNumber as TInputNumber } from '../input-number';
import { Color } from './utils';
import { TdColorPickerProps } from './type';
import { useBaseClassName } from './hooks';
import { TdColorHandler } from './interfaces';
import useCommonClassName from '../hooks/useCommonClassName';

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
    clearable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<TdColorPickerProps['size']>,
      default: 'medium',
    },
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const value = ref(props.color);
    const { sizeClassNames } = useCommonClassName();
    watch(
      () => [props.color],
      () => (value.value = props.color),
    );

    const handleChange = (input: string) => {
      if (input === props.color) {
        return;
      }
      if (!Color.isValid(input) && input) {
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
      sizeClassNames,
    };
  },

  render() {
    const { baseClassName } = this;
    const inputSlots = {
      label: () => (
        <div class={[`${baseClassName}__trigger--default__color`, `${baseClassName}--bg-alpha`]}>
          <span
            class={[
              'color-inner',
              {
                [this.sizeClassNames[this.size]]: this.size !== 'medium',
              },
            ]}
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
          scopedSlots={inputSlots}
          v-model={this.value}
          clearable={this.clearable}
          disabled={this.disabled}
          onBlur={this.handleChange}
          {...{
            props: {
              ...this.inputProps,
            },
          }}
          size={this.size}
        />
      </div>
    );
  },
});
