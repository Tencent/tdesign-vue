import { defineComponent, ref } from '@vue/composition-api';
import omit from 'lodash/omit';
import Popup, { PopupVisibleChangeContext } from '../popup/index';
import DropdownMenu from './dropdown-menu';
import { DropdownOption, TdDropdownProps } from './type';
import props from './props';
import { usePrefixClass } from '../hooks/useConfig';
import { useTNodeJSX } from '../hooks/tnode';
import useDropdownOptions from './hooks/useDropdownOptions';

export default defineComponent({
  name: 'TDropdown',
  props: { ...props },
  setup(props: TdDropdownProps, { emit }) {
    const dropdownClass = usePrefixClass('dropdown');
    const isPopupVisible = ref(false);

    const handleMenuClick = (data: DropdownOption, context: { e: MouseEvent }) => {
      if (props.hideAfterItemClick) {
        isPopupVisible.value = false;
        props.popupProps?.onVisibleChange?.(false, context);
      }
      props?.onClick?.(data, context);
      emit('click', data, context);
    };

    const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
      isPopupVisible.value = visible;
      props.popupProps?.onVisibleChange?.(visible, context);
    };

    return {
      dropdownClass,
      handleMenuClick,
      isPopupVisible,
      handleVisibleChange,
    };
  },
  render() {
    const popupParams = {
      disabled: this.disabled,
      placement: this.placement,
      trigger: this.trigger,
      ...omit(this.popupProps, 'onVisibleChange'),
      overlayInnerClassName: [
        this.dropdownClass,
        (this.popupProps as TdDropdownProps['popupProps'])?.overlayInnerClassName,
      ],
    };
    const renderTNodeJSX = useTNodeJSX();
    const options = useDropdownOptions(this.$props, this.$slots);
    const trigger = renderTNodeJSX('default')?.[0];

    return (
      <Popup
        {...{
          props: {
            destroyOnClose: true,
            visible: this.isPopupVisible,
            onVisibleChange: this.handleVisibleChange,
            expandAnimation: true,
            ...popupParams,
          },
        }}
      >
        <DropdownMenu
          slot="content"
          {...{
            props: {
              ...this.$props,
              options: options.value,
              onClick: this.handleMenuClick,
            },
          }}
        />
        {trigger}
      </Popup>
    );
  },
});
