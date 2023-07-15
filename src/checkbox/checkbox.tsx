import { defineComponent, ref, toRefs, inject, watch } from '@vue/composition-api';
import props from './props';
import useVModel from '../hooks/useVModel';
import { renderContent, useFormDisabled } from '../hooks';
// import useRipple from '../hooks/useRipple';
import { useCommonClassName, usePrefixClass } from '../hooks/useConfig';
import { CheckboxGroupInjectionKey } from './constants';
import checkboxStore, { ObserverListenerParams } from './store';

export default defineComponent({
  name: 'TCheckbox',
  props: {
    ...props,
    needRipple: Boolean,
    stopLabelTrigger: Boolean,
  },

  setup(props) {
    // const labelRef = ref<HTMLElement>();
    if (props.needRipple) {
      // useRipple(labelRef);
    }
    const { STATUS } = useCommonClassName();
    const { formDisabled } = useFormDisabled();

    const { checked, checkAll, disabled } = toRefs(props);
    const [innerChecked, setInnerChecked] = useVModel(
      checked,
      props.defaultChecked,
      props.onChange,
      'change',
      'checked',
    );

    const checkboxGroupData = inject(CheckboxGroupInjectionKey, undefined);

    /**
     * Warn: Do not use computed to set tName,
     * otherwise checkbox group will render all checkbox items on every checked or unchecked.
     */
    const tName = ref<string>();
    // watch(
    //   () => [props.name, checkboxGroupData?.value.name].join('_'),
    //   () => {
    //     const name = props.name || checkboxGroupData?.value.name;
    //     if (name) {
    //       tName.value = name;
    //     }
    //   },
    //   { immediate: true },
    // );

    // checked
    const tChecked = ref(false);
    const handleParentCheckedChange = ({ parentIsCheckAll, parentChecked }: ObserverListenerParams) => {
      const { value, checkAll } = props;
      if (checkAll) {
        tChecked.value = parentIsCheckAll;
      } else {
        tChecked.value = parentChecked.includes(value);
      }
    }

    watch([innerChecked], () => {
      // CheckboxGroup does not exist, self checked works
      if (!checkboxStore.checked) {
        tChecked.value = innerChecked.value;
      }
    }, { immediate: true });

    // const getChecked = () => {
    //   const { value, checkAll } = props;
    //   if (checkAll) return checkboxGroupData?.value.isCheckAll;
    //   return checkboxGroupData?.value ? checkboxGroupData.value.checkedValues.includes(value) : innerChecked.value;
    // };
    // watch(
    //   () => [
    //     innerChecked.value,
    //     checkboxGroupData?.value.isCheckAll,
    //     checkboxGroupData?.value.checkedValues?.join(','),
    //   ].join('_'),
    //   () => {
    //     console.log('tChecked');
    //     tChecked.value = getChecked();
    //   },
    //   { immediate: true },
    // );

    // Warn: Do not use computed to set tDisabled
    // Form.disabled < CheckboxGroup.disabled < Checkbox.disabled
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

    // TODO: checkboxGroupData.value?.maxExceeded can not use like this, it will cause performance problem
    // watch(
    //   [checkAll, disabled, tChecked],
    //   () => {
    //     tDisabled.value = getDisabled();
    //   },
    //   { immediate: true },
    // );

    // const tIndeterminate = ref(false);
    // watch(
    //   () => [props.checkAll, props.indeterminate, checkboxGroupData?.value.indeterminate].join('_'),
    //   () => {
    //     tIndeterminate.value = props.checkAll ? checkboxGroupData?.value.indeterminate : props.indeterminate;
    //   },
    //   { immediate: true },
    // );

    /** update labelClasses, do not use computed to get labelClasses */
    const COMPONENT_NAME = usePrefixClass('checkbox');
    const labelClasses = ref({});
    watch(
      // [tChecked, tDisabled, tIndeterminate],
      [tChecked, tDisabled],
      () => {
        labelClasses.value = [
          `${COMPONENT_NAME.value}`,
          {
            [STATUS.value.checked]: tChecked.value,
            [STATUS.value.disabled]: tDisabled.value,
            // [STATUS.value.indeterminate]: tIndeterminate.value,
            [STATUS.value.indeterminate]: props.indeterminate,
          },
        ];
      },
      { immediate: true },
    );

    checkboxStore.subscribe(props.value, (data: ObserverListenerParams) => {
      switch(data.type) {
        case 'checked':
          handleParentCheckedChange(data);
          break;
        case 'disabled':
          handleParentDisabled(data);
          break;
        default:
          break;
      }
    });

    const handleChange = (e: Event) => {
      if (props.readonly) return;
      const checked = !tChecked.value;
      setInnerChecked(checked, { e });
      if (checkboxGroupData?.value.handleCheckboxChange) {
        checkboxGroupData.value.onCheckedChange({ checked, checkAll: props.checkAll, e, option: props });
      }
    };

    const handleLabelClick = (e: MouseEvent) => {
      // 在tree等组件中使用  阻止label触发checked 与expand冲突
      if (props.stopLabelTrigger) e.preventDefault();
    };

    return {
      labelClasses,
      COMPONENT_NAME,
      tDisabled,
      // tIndeterminate,
      tName,
      handleChange,
      handleLabelClick,
    };
  },

  render() {
    return (
      <label class={this.labelClasses} ref="labelRef">
        <input
          type="checkbox"
          class={`${this.COMPONENT_NAME}__former`}
          disabled={this.tDisabled}
          readonly={props.readonly}
          // indeterminate={this.tIndeterminate}
          name={this.tName}
          value={props.value ? props.value : undefined}
          checked={this.tName}
          onChange={this.handleChange}
        ></input>
        <span class={`${this.COMPONENT_NAME}__input`}></span>
        <span class={`${this.COMPONENT_NAME}__label`} onClick={this.handleLabelClick}>
          {renderContent(this, 'default', 'label')}
        </span>
      </label>
    );
  }
});
