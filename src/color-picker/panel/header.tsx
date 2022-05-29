import {
  defineComponent, PropType, ref, watch,
} from '@vue/composition-api';
import { CloseIcon } from 'tdesign-icons-vue';
import props from '../props';
import { COLOR_MODES } from '../const';
import { RadioGroup as TRadioGroup, RadioButton as TRadioButton } from '../../radio';
import { TdColorHandler, TdColorModes } from '../interfaces';
import { useBaseClassName } from '../hooks';

export default defineComponent({
  name: 'PanelHeader',
  components: {
    CloseIcon,
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
    const handleClosePopup = () => {
      props.togglePopup?.(false);
    };
    watch(
      () => props.mode,
      (v) => {
        modeValue.value = v;
      },
    );
    return {
      baseClassName,
      modeValue,
      handleClosePopup,
    };
  },
  render() {
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
        {this.closeBtn ? (
          <span
            role="button"
            class={[`${baseClassName}__icon`, `${baseClassName}__close`]}
            onClick={this.handleClosePopup}
          >
            <close-icon />
          </span>
        ) : null}
      </div>
    );
  },
});
