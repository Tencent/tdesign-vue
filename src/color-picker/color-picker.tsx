import { defineComponent, toRefs } from 'vue';
import useVModel from '../hooks/useVModel';
import { type PopupProps, Popup as TPopup } from '../popup';
import { renderTNodeJSXDefault } from '../utils/render-tnode';
import { useBaseClassName } from './hooks';
import { TdColorContext } from './interfaces';
import ColorPanel from './panel';
import props from './props';
import DefaultTrigger from './trigger';

export default defineComponent({
  name: 'TColorPicker',
  components: {
    TPopup,
    ColorPanel,
    DefaultTrigger,
  },
  props: {
    ...props,
  },
  setup(props) {
    const baseClassName = useBaseClassName();

    const { value } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

    const handleChange = (value: string, context: TdColorContext) => {
      setInnerValue(value, context);
    };

    const handlePaletteChange = (context: TdColorContext) => {
      props.onPaletteBarChange(context);
    };

    return {
      baseClassName,
      innerValue,
      setInnerValue,
      handleChange,
      handlePaletteChange,
    };
  },
  render() {
    const {
      popupProps, disabled, innerValue, baseClassName, handleChange, handlePaletteChange,
    } = this;

    const renderPopupContent = () => {
      if (disabled) {
        return null;
      }
      return (
        <ColorPanel
          {...{
            props: {
              ...this.$props,
              value: innerValue,
            },
          }}
          on={{ change: handleChange, handlePaletteChange }}
          ref="refColorPanel"
        />
      );
    };

    const popProps = {
      placement: 'bottom-left' as const,
      trigger: 'click' as const,
      overlayClassName: [baseClassName],
      ...((popupProps as PopupProps) || {}),
    };
    return (
      <TPopup
        {...{
          props: {
            ...popProps,
          },
        }}
        content={renderPopupContent}
      >
        <div class={`${baseClassName}__trigger`}>
          {renderTNodeJSXDefault(
            this,
            'default',
            <DefaultTrigger
              borderless={this.borderless}
              color={this.innerValue}
              disabled={disabled}
              clearable={this.clearable}
              input-props={this.inputProps}
              handleTriggerChange={this.setInnerValue}
              size={this.size}
            />,
          )}
        </div>
      </TPopup>
    );
  },
});
