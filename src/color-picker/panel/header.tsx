import {
  defineComponent, PropType, ref, watch,
} from '@vue/composition-api';
import props from '../props';
import { COLOR_MODES } from '../const';
import { RadioGroup as TRadioGroup, RadioButton as TRadioButton } from '../../radio';
import { TdColorHandler, TdColorModes } from '../interfaces';
import { useBaseClassName } from '../hooks';

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
    togglePopup: {
      type: Function as PropType<TdColorHandler>,
    },
    handleModeChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const modeValue = ref(props.mode);
    watch(
      () => props.mode,
      (v) => {
        modeValue.value = v;
      },
    );
    return {
      baseClassName,
      modeValue,
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
          {this.colorModes?.length === 1 ? (
            COLOR_MODES[this.colorModes[0]]
          ) : (
            <t-radio-group
              variant="default-filled"
              size="small"
              disabled={this.disabled}
              v-model={this.modeValue}
              onChange={this.handleModeChange}
            >
              {Object.keys(COLOR_MODES).map((key) => (
                <t-radio-button key={key} value={key}>
                  {COLOR_MODES[key]}
                </t-radio-button>
              ))}
            </t-radio-group>
          )}
        </div>
      </div>
    );
  },
});
