import {
  defineComponent, ref, toRefs, inject, watch, onBeforeUnmount, computed, nextTick,
} from 'vue';
import props from './props';
import {
  useVModel,
  useElementLazyRender,
  renderTNodeJSX,
  useFormDisabled,
  useCommonClassName,
  usePrefixClass,
} from '../hooks';
import { CheckboxGroupInjectionKey } from './constants';
import { getCheckboxStore, ObserverListenerParams } from './store';
import useKeyboardEvent from './hooks/useKeyboardEvent';

export default defineComponent({
  name: 'TCheckbox',
  props: {
    ...props,
    stopLabelTrigger: Boolean,
    storeKey: String,
    index: Number,
    // 传递给 Checkbox 组件额外的数据
    data: Object,
  },

  model: {
    prop: 'checked',
    event: 'change',
  },

  setup(props) {
    const { storeKey } = toRefs(props);
    const checkboxStore = computed(() => getCheckboxStore(storeKey.value));
    const labelRef = ref<HTMLElement>();
    const { STATUS } = useCommonClassName();
    const checkboxGroupExist = ref(false);

    const {
      checked, indeterminate, disabled, value, lazyLoad, label, data,
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
      checkboxGroupExist.value = checkboxStore.value.parentExist;
    };

    watch(
      [innerChecked, checkboxStore],
      () => {
        // CheckboxGroup does not exist, self checked works
        if (checkboxStore.value?.parentExist) {
          checkboxGroupExist.value = true;
        } else {
          tChecked.value = innerChecked.value;
        }
      },
      { immediate: true },
    );

    watch(
      [indeterminate, checkboxStore],
      ([val, checkboxStore]) => {
        // CheckboxGroup does not exist, self indeterminate works
        if (!checkboxStore?.parentExist) {
          tIndeterminate.value = val;
        }
      },
      { immediate: true },
    );

    const tName = ref<string>();

    // Warn: Do not use computed to set tDisabled
    // Priority: Form.disabled < CheckboxGroup.disabled < Checkbox.disabled
    const tDisabled = ref<boolean>();
    const { formDisabled } = useFormDisabled();
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
      tDisabled.value = disabled;
    };

    watch([checkboxStore], () => {
      if (!checkboxStore.value?.parentExist) {
        tDisabled.value = props.disabled;
      }
    });

    watch(
      [disabled],
      ([val]) => {
        tDisabled.value = val;
      },
      { immediate: true },
    );

    /** update labelClasses, do not use computed to get labelClasses */
    const COMPONENT_NAME = usePrefixClass('checkbox');
    const labelClasses = ref([]);
    watch(
      [tChecked, tIndeterminate],
      ([tChecked, tIndeterminate]) => {
        labelClasses.value = [
          `${COMPONENT_NAME.value}`,
          {
            [STATUS.value.checked]: tChecked,
            [STATUS.value.indeterminate]: tIndeterminate,
          },
        ];
      },
      { immediate: true },
    );

    const subscribeParentData = (val: string | number | boolean) => {
      checkboxStore.value.subscribe(val, (data: ObserverListenerParams) => {
        if (data.type === 'checked') {
          handleParentCheckedChange(data);
        } else if (data.type === 'checkbox') {
          /**
           * checked state can influence disabled state because of `max`,
           * therefore we need to update disabled state after checked state changed
           */
          nextTick(() => {
            handleParentDisabled(data);
          });
          if (data.checkboxName) {
            tName.value = data.checkboxName;
          }
        }
      });
    };

    watch(
      [data, label, storeKey],
      () => {
        if (!storeKey.value) return;
        subscribeParentData(props.checkAll ? 'CHECK_ALL' : value.value);
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      checkboxStore.value?.unSubscribe(props.checkAll ? 'CHECK_ALL' : value.value);
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

    const { showElement: showCheckbox } = useElementLazyRender(labelRef, lazyLoad);

    const { onCheckboxFocus, onCheckboxBlur } = useKeyboardEvent(handleChange);

    return {
      labelRef,
      labelClasses,
      COMPONENT_NAME,
      tDisabled,
      tIndeterminate,
      tName,
      tChecked,
      showCheckbox,
      formDisabled,
      STATUS,
      checkboxGroupExist,
      handleChange,
      handleLabelClick,
      onCheckboxFocus,
      onCheckboxBlur,
    };
  },

  render() {
    const disabled = this.tDisabled ?? this.formDisabled;
    const classes = this.labelClasses.concat({
      [this.STATUS.disabled]: disabled,
    });
    const slotsPrams = {
      data: this.data,
      index: this.index,
    };
    return (
      <label
        ref="labelRef"
        class={classes}
        tabindex={disabled ? undefined : '0'}
        onFocus={this.onCheckboxFocus}
        onBlur={this.onCheckboxBlur}
      >
        {!this.showCheckbox
          ? null
          : [
              <input
                type="checkbox"
                class={`${this.COMPONENT_NAME}__former`}
                disabled={disabled}
                readonly={this.readonly}
                indeterminate={this.tIndeterminate}
                name={this.tName || this.name || undefined}
                value={this.value ? this.value : undefined}
                checked={this.tChecked}
                onChange={this.handleChange}
                key="input"
                tabindex="-1"
              ></input>,
              <span class={`${this.COMPONENT_NAME}__input`} key="input-span"></span>,
              <span class={`${this.COMPONENT_NAME}__label`} key="label" onClick={this.handleLabelClick}>
                {renderTNodeJSX(this, 'default', { params: slotsPrams })
                  || renderTNodeJSX(this, 'label', { params: slotsPrams, slotFirst: this.checkboxGroupExist })}
              </span>,
          ]}
      </label>
    );
  },
});
