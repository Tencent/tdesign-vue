import { defineComponent, ref, toRefs } from '@vue/composition-api';
import useVModel from '../hooks/useVModel';
import { renderTNodeJSXDefault } from '../utils/render-tnode';
import props from './props';
import { Popup as TPopup } from '../popup';
import ColorPanel from './panel';
import DefaultTrigger from './trigger';
import { TdColorContext } from './interfaces';
import { useBaseClassName } from './hooks';

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
    const visible = ref(false);
    const setVisible = (value: boolean) => (visible.value = value);

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
      visible,
      setVisible,
      setInnerValue,
      handleChange,
      handlePaletteChange,
    };
  },
  render() {
    const {
      popupProps, disabled, innerValue, baseClassName, setVisible, handleChange, handlePaletteChange,
    } = this;

    const renderPopupContent = () => {
      if (disabled) {
        return null;
      }
      return (
        <color-panel
          {...{
            props: {
              ...this.$props,
              value: innerValue,
            },
          }}
          togglePopup={setVisible}
          on={{ change: handleChange, handlePaletteChange }}
          ref="refColorPanel"
        />
      );
    };

    const popProps = {
      placement: 'bottom-left',
      ...((popupProps as any) || {}),
      trigger: 'click',
      attach: 'body',
      overlayClassName: [baseClassName],
      visible: this.visible,
      overlayStyle: {
        padding: 0,
      },
      onVisibleChange: (
        visible: boolean,
        context: {
          trigger: string;
        },
      ) => {
        if (context.trigger === 'document') {
          this.setVisible(false);
        }
      },
    };
    return (
      <t-popup
        {...{
          props: {
            ...popProps,
          },
        }}
        content={renderPopupContent}
      >
        <div class={`${baseClassName}__trigger`} onClick={() => setVisible(!this.visible)}>
          {renderTNodeJSXDefault(
            this,
            'default',
            <default-trigger
              color={this.innerValue}
              disabled={disabled}
              input-props={this.inputProps}
              handleTriggerChange={this.setInnerValue}
            />,
          )}
        </div>
      </t-popup>
    );
  },
});
