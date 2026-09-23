import { defineComponent, computed, ref, SetupContext } from '@vue/composition-api';
import { ChevronDownIcon as TdChevronDownIcon } from 'tdesign-icons-vue';

import { DropdownOption } from './type';
import DropdownProps from './props';
import DropdownMenu from './dropdown-menu';

import { useTNodeJSX } from '../hooks/tnode';
import { useGlobalIcon } from '../hooks/useGlobalIcon';
import { usePrefixClass } from '../hooks/useConfig';
import Popup, { PopupVisibleChangeContext } from '../popup';
import useDropdownOptions from './hooks/useDropdownOptions';

export default defineComponent({
  name: 'TDropdown',
  props: { ...DropdownProps },
  setup(props: { options?: Array<DropdownOption> }, { emit, slots }: SetupContext) {
    const dropdownClass = usePrefixClass('dropdown');
    const isPopupVisible = ref(false);
    const { ChevronDownIcon } = useGlobalIcon({ ChevronDownIcon: TdChevronDownIcon });
    const options = useDropdownOptions(props, slots);

    const handleMenuClick = (data: DropdownOption, context: { e: MouseEvent }) => {
      props?.onClick?.(data, context);
      emit('click', data, context);
    };

    const handleMenuHover = (data: DropdownOption, context: { e: MouseEvent }) => {
      props?.onHover?.(data, context);
      emit('hover', data, context);
    };

    const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
      if (!visible) {
        (options.value as Array<DropdownOption>).forEach((option) => {
          if (option.children) {
            option.children.forEach((child) => {
              child.expanded = false;
            });
          }
        });
      }
      if (props.hideAfterItemClick && !visible) isPopupVisible.value = false;
      emit('visible-change', visible, context);
    };

    return {
      dropdownClass,
      handleMenuClick,
      handleMenuHover,
      isPopupVisible,
      handleVisibleChange,
      options,
      ChevronDownIcon,
    };
  },
  render() {
    const renderTNodeJSX = useTNodeJSX();
    const slotsPanel = () =>
      renderTNodeJSX('dropdown', {
        params: {
          options: this.options,
        },
      });

    const popupParams = {
      props: {
        ...this.$attrs,
        visible: this.isPopupVisible,
      },
      on: {
        'visible-change': this.handleVisibleChange,
      },
    };

    const handleTrigger = (e: MouseEvent) => {
      if (this.disabled) return;
      this.isPopupVisible.value = !this.isPopupVisible.value;
      e.stopPropagation();
    };

    return (
      <Popup
        class={`${this.dropdownClass}__popup-wrapper`}
        trigger={this.trigger}
        placement="bottom-left"
        hideEmptyPopup={true}
        destroyOnClose={true}
        visible={this.isPopupVisible}
        scopedSlots={{
          content: () => {
            if (slotsPanel()) {
              return slotsPanel();
            }
            const { options } = this;
            return (
              <DropdownMenu
                {...{
                  props: {
                    options: options.value,
                    onClick: this.handleMenuClick,
                    onHover: this.handleMenuHover,
                  },
                }}
              />
            );
          },
        }}
        {...popupParams}
      >
        <div class={`${this.dropdownClass}__trigger`} onClick={handleTrigger}>
          {renderTNodeJSX('default')}
          {this.options && this.options.length > 0 ? (
            <this.ChevronDownIcon class={`${this.dropdownClass}__trigger-icon`} />
          ) : null}
        </div>
      </Popup>
    );
  },
});
