import {
  defineComponent, ref, toRefs, inject, watch, onBeforeUnmount,
} from '@vue/composition-api';
import props from './props';
import useVModel from '../hooks/useVModel';
import { renderContent, useFormDisabled } from '../hooks';
import { useCommonClassName, usePrefixClass } from '../hooks/useConfig';
import { CheckboxGroupInjectionKey } from './constants';
import { getCheckboxStore, ObserverListenerParams } from './store';
import useCheckboxLazyLoad from './useCheckboxLazyLoad';

export default defineComponent({
  name: 'TCheckbox',
  props: {
    ...props,
    needRipple: Boolean,
    stopLabelTrigger: Boolean,
    storeKey: String,
  },

  setup(props) {
    const checkboxStore = getCheckboxStore(props.storeKey);
    const labelRef = ref<HTMLElement>();
    if (props.needRipple) {
      // useRipple(labelRef);
    }
    const { STATUS } = useCommonClassName();
    const { formDisabled } = useFormDisabled();

    const {
      checked, indeterminate, disabled, value, lazyLoad,
    } = toRefs(props);
    const [innerChecked, setInnerChecked] = useVModel(
      checked,
      props.defaultChecked,
      props.onChange,
      'change',
      'checked',
    );

    const checkboxGroupData = inject(CheckboxGroupInjectionKey, undefined);

    // checked
    const tIndeterminate = ref(false);
    const tChecked = ref(false);
    const handleParentCheckedChange = ({
      parentIsCheckAll,
      parentChecked,
      parentIsIndeterminate,
    }: ObserverListenerParams) => {
      const { value, checkAll } = props;
      if (checkAll) {
        tChecked.value = parentIsCheckAll;
        tIndeterminate.value = parentIsIndeterminate;
      } else {
        tChecked.value = parentChecked.includes(value);
      }
    };

    watch(
      [innerChecked],
      () => {
        // CheckboxGroup does not exist, self checked works
        if (!checkboxStore.parentExist) {
          tChecked.value = innerChecked.value;
        }
      },
      { immediate: true },
    );

    watch(
      [indeterminate],
      ([val]) => {
        // CheckboxGroup does not exist, self indeterminate works
        if (!checkboxStore.parentExist) {
          tIndeterminate.value = val;
        }
      },
      { immediate: true },
    );

    const tName = ref<string>();

    // Warn: Do not use computed to set tDisabled
    // Priority: Form.disabled < CheckboxGroup.disabled < Checkbox.disabled
    const tDisabled = ref<boolean>(false);
    const handleParentDisabled = ({ parentDisabled, parentMaxExceeded }: ObserverListenerParams) => {
      const { checkAll, disabled } = props;
      if (!checkAll && !tChecked.value && parentMaxExceeded) {
        tDisabled.value = true;
        return;
      }
      if (disabled !== undefined) {
        tDisabled.value = disabled;
        return;
      }
      if (parentDisabled !== undefined) {
        tDisabled.value = parentDisabled;
        return;
      }
      if (formDisabled.value !== undefined) {
        tDisabled.value = formDisabled.value;
        return;
      }
      return false;
    };

    watch(
      [disabled],
      ([val]) => {
        if (!checkboxStore.parentExist) {
          tDisabled.value = val;
        }
      },
      { immediate: true },
    );

    /** update labelClasses, do not use computed to get labelClasses */
    const COMPONENT_NAME = usePrefixClass('checkbox');
    const labelClasses = ref({});
    watch(
      [tChecked, tDisabled, tIndeterminate],
      ([tChecked, tDisabled, tIndeterminate]) => {
        labelClasses.value = [
          `${COMPONENT_NAME.value}`,
          {
            [STATUS.value.checked]: tChecked,
            [STATUS.value.disabled]: tDisabled,
            [STATUS.value.indeterminate]: tIndeterminate,
          },
        ];
      },
      { immediate: true },
    );

    const subscribeParentData = (val: string | number | boolean) => {
      checkboxStore.subscribe(val, (data: ObserverListenerParams) => {
        if (data.type === 'checked') {
          handleParentCheckedChange(data);
        } else if (data.type === 'checkbox') {
          handleParentDisabled(data);
          if (data.checkboxName) {
            tName.value = data.checkboxName;
          }
        }
      });
    };

    subscribeParentData(props.checkAll ? 'CHECK_ALL' : value.value);

    onBeforeUnmount(() => {
      checkboxStore.unSubscribe(props.checkAll ? 'CHECK_ALL' : value.value);
    });

    const handleChange = (e: Event) => {
      if (props.readonly) return;
      const checked = !tChecked.value;
      setInnerChecked(checked, { e });
      if (checkboxGroupData?.value.handleCheckboxChange) {
        checkboxGroupData.value.onCheckedChange({
          checked,
          checkAll: props.checkAll,
          e,
          option: props,
        });
      }
    };

    const handleLabelClick = (e: MouseEvent) => {
      // 在tree等组件中使用  阻止label触发checked 与expand冲突
      if (props.stopLabelTrigger) e.preventDefault();
    };

    const { showCheckbox } = useCheckboxLazyLoad(labelRef, lazyLoad);

    return {
      labelRef,
      labelClasses,
      COMPONENT_NAME,
      tDisabled,
      tIndeterminate,
      tName,
      tChecked,
      innerChecked,
      showCheckbox,
      handleChange,
      handleLabelClick,
    };
  },

  render() {
    return (
      <label class={this.labelClasses} ref="labelRef" tabindex="0">
        {!this.showCheckbox
          ? null
          : [
              <input
                type="checkbox"
                class={`${this.COMPONENT_NAME}__former`}
                disabled={this.tDisabled}
                readonly={this.readonly}
                indeterminate={this.tIndeterminate}
                name={this.tName || this.name || undefined}
                value={this.value ? this.value : undefined}
                checked={this.tChecked}
                on={{ change: this.handleChange }}
                key="input"
                tabindex="-1"
              ></input>,
              <span class={`${this.COMPONENT_NAME}__input`} key="input-span"></span>,
              <span class={`${this.COMPONENT_NAME}__label`} key="label" onClick={this.handleLabelClick}>
                {renderContent(this, 'default', 'label')}
              </span>,
          ]}
      </label>
    );
  },
});
