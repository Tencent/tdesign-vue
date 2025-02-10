import {
  defineComponent, PropType, ref, watch,
} from 'vue';
import { upperCase } from 'lodash-es';
import { TdColorHandler } from '../../../color-picker/interfaces';
import { TdColorPickerProps } from '../../type';
import props from '../../props';
import { FORMATS } from '../../../_common/js/color-picker/constants';
import { Color } from '../../utils';
import { Select as TSelect, Option as TOption } from '../../../select';
import { Input as TInput } from '../../../input';
import FormatInputs from './inputs';
import { useBaseClassName } from '../../hooks';
import type { TdSelectInputProps } from '../../../select-input/type';

export default defineComponent({
  name: 'FormatPanel',
  components: {
    TSelect,
    TInput,
    TOption,
    FormatInputs,
  },
  inheritAttrs: false,
  props: {
    ...props,
    color: {
      type: Object as PropType<Color>,
    },
    handleFormatModeChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
    handleFormatInputChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const formatModel = ref<TdColorPickerProps['format']>(props.format);
    watch(
      () => [props.format],
      () => (formatModel.value = props.format),
    );

    /**
     * 格式化类型改变触发
     * @param v
     */
    const handleModeChange = (v: TdColorPickerProps['format']) => {
      formatModel.value = v;
      props.handleFormatModeChange(v);
    };

    return {
      formatModel,
      baseClassName,
      handleModeChange,
    };
  },
  render(h) {
    const { baseClassName, handleModeChange } = this;
    const newProps = {
      ...this.$props,
      format: this.formatModel,
    };
    const selectInputProps = {
      ...((this.selectInputProps as Object) || {}),
    };
    return (
      <div class={`${baseClassName}__format`}>
        <div class={`${baseClassName}__format--item`}>
          <t-select
            size="small"
            class={`${baseClassName}__format-mode-select`}
            selectInputProps={{ ...selectInputProps }}
            popupProps={{
              overlayClassName: `${baseClassName}__select-options`,
              ...(selectInputProps as TdSelectInputProps).popupProps,
            }}
            v-model={this.formatModel}
            onChange={handleModeChange}
            disabled={this.disabled}
          >
            {FORMATS.map((item) => (
              <t-option key={item} value={item} label={upperCase(item)} style={{ fontSize: '12px' }} />
            ))}
          </t-select>
        </div>
        <div class={`${baseClassName}__format--item`}>
          {h('format-inputs', {
            props: newProps,
          })}
        </div>
      </div>
    );
  },
});
