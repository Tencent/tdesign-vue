import {
  defineComponent, PropType, ref, watch,
} from 'vue';
import { COLOR_MODES } from '../../_common/js/color-picker/constants';
import { useConfig } from '../../hooks';
import { RadioButton as TRadioButton, RadioGroup as TRadioGroup } from '../../radio';
import { useBaseClassName } from '../hooks';
import type { TdColorHandler, TdColorModes } from '../interfaces';
import props from '../props';

export default defineComponent({
  name: 'PanelHeader',
  components: {
    TRadioGroup,
    TRadioButton,
  },
  props: {
    ...props,
    mode: {
      type: String as PropType<TdColorModes>,
      default: 'color',
    },
    handleModeChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    const { globalConfig } = useConfig('colorPicker');
    const baseClassName = useBaseClassName();
    const modeValue = ref(props.mode);
    watch(
      () => props.mode,
      (v) => {
        modeValue.value = v;
      },
    );
    return {
      globalConfig,
      baseClassName,
      modeValue,
      COLOR_MODES,
    };
  },
  render() {
    if (this.colorModes?.length === 1) {
      return null;
    }
    const { baseClassName } = this;
    return (
      <div class={`${baseClassName}__head`}>
        <div class={`${baseClassName}__mode`}>
          <TRadioGroup
            variant="default-filled"
            size="small"
            disabled={this.disabled}
            v-model={this.modeValue}
            onChange={this.handleModeChange}
          >
            {this.colorModes.map((key) => (
              <TRadioButton key={key} value={key}>
                {Reflect.get(this.globalConfig, COLOR_MODES[key as keyof typeof COLOR_MODES])}
              </TRadioButton>
            ))}
          </TRadioGroup>
        </div>
      </div>
    );
  },
});
