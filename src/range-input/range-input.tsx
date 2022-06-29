import {
  defineComponent, ref, toRefs, computed, getCurrentInstance,
} from '@vue/composition-api';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import Input from '../input';
import props from './props';
import { RangeInputValue, RangeInputPosition } from './type';

// hooks
import useVModel from '../hooks/useVModel';
import { usePrefixClass, useCommonClassName } from '../hooks/useConfig';
import { useTNodeJSX } from '../hooks/tnode';

function calcArrayValue(value: unknown | Array<unknown>) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value];
}

export default defineComponent({
  name: 'TRangeInput',
  props,

  setup(props) {
    const instance = getCurrentInstance();
    const { value } = toRefs(props);
    const { STATUS, SIZE } = useCommonClassName();
    const classPrefix = usePrefixClass();
    const COMPONENT_NAME = usePrefixClass('range-input');
    const renderTNodeJSX = useTNodeJSX();

    const focused = ref(false);
    const isHover = ref(false);
    const calcFormat = computed(() => calcArrayValue(props.format));
    const calcInputProps = computed(() => calcArrayValue(props.inputProps));
    const calcPlaceholder = computed(() => calcArrayValue(props.placeholder));
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

    const isShowClearIcon = computed(
      () => ((props.clearable && props.value?.length && !props.disabled) || props.showClearIconOnEmpty) && isHover.value,
    );

    const inputRefs = {
      firstInputRef: ref(),
      secondInputRef: ref(),
    };

    function handleClear(context: { e: MouseEvent }) {
      props.onClear?.(context);
      setInnerValue(['', ''], { ...context, trigger: 'clear', position: 'all' });
    }

    function handleEnter(rangeValue: RangeInputValue, context: { e: MouseEvent }) {
      props.onEnter?.(rangeValue, context);
      instance.emit('enter', rangeValue, context);
    }

    function handleFocus(rangeValue: RangeInputValue, context: { e: MouseEvent }) {
      focused.value = true;
      props.onFocus?.(rangeValue, context);
      instance.emit('focus', rangeValue, context);
    }

    function handleBlur(rangeValue: RangeInputValue, context: { e: MouseEvent }) {
      focused.value = false;
      props.onBlur?.(rangeValue, context);
      instance.emit('blur', rangeValue, context);
    }

    function handleMouseEnter(e: MouseEvent) {
      isHover.value = true;
      props?.onMouseenter?.({ e });
      instance.emit('monseenter', { e });
    }

    function handleMouseLeave(e: MouseEvent) {
      isHover.value = false;
      props?.onMouseleave?.({ e });
      instance.emit('monseleave', { e });
    }

    const exposeObj = {
      firstInputElement: inputRefs.firstInputRef.value,
      secondInputElement: inputRefs.secondInputRef.value,
      focus: (options: any) => {
        const { position = 'first' } = options || {};
        inputRefs[`${position}InputRef`].value?.focus();
      },
      blur: (options: any) => {
        const { position = 'first' } = options || {};
        inputRefs[`${position}InputRef`].value?.blur();
      },
      select: (options: any) => {
        const { position = 'first' } = options || {};
        inputRefs[`${position}InputRef`].value?.select();
      },
    };

    return {
      ...exposeObj,
      COMPONENT_NAME,
      SIZE,
      STATUS,
      focused,
      classPrefix,
      inputRefs,
      calcInputProps,
      calcFormat,
      calcPlaceholder,
      innerValue,
      isShowClearIcon,
      handleMouseEnter,
      handleMouseLeave,
      handleEnter,
      handleFocus,
      handleBlur,
      setInnerValue,
      renderTNodeJSX,
      handleClear,
    };
  },
  render() {
    const {
      COMPONENT_NAME,
      SIZE,
      STATUS,
      focused,
      handleMouseEnter,
      handleMouseLeave,
      handleEnter,
      handleFocus,
      handleBlur,
      setInnerValue,
      renderTNodeJSX,
      handleClear,
      classPrefix,
      inputRefs,
      calcInputProps,
      calcFormat,
      calcPlaceholder,
      innerValue,
      isShowClearIcon,
    } = this;

    const labelContent = renderTNodeJSX('label');
    const prefixIconContent = renderTNodeJSX('prefixIcon');
    const suffixContent = renderTNodeJSX('suffix');
    const suffixIconContent = renderTNodeJSX('suffixIcon');

    return (
      <div
        class={[
          COMPONENT_NAME,
          {
            [SIZE[this.size]]: this.size !== 'medium',
            [STATUS.disabled]: this.disabled,
            [STATUS.focused]: focused,
          },
        ]}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        <div class={`${COMPONENT_NAME}__inner`}>
          {prefixIconContent}
          {labelContent ? <div class={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
          <Input
            ref={inputRefs.firstInputRef}
            class={`${COMPONENT_NAME}__inner-left`}
            inputClass={{
              [`${classPrefix}-is-focused`]: this.activeIndex === 0,
            }}
            placeholder={calcPlaceholder[0]}
            disabled={this.disabled}
            readonly={this.readonly}
            format={calcFormat[0]}
            value={innerValue?.[0]}
            onClick={({ e }: { e: MouseEvent }) => this.onClick?.({ e, position: 'first' })}
            onClear={() => setInnerValue([], { position: 'first', trigger: 'input' })}
            onEnter={(val: string, { e }: { e: KeyboardEvent }) => handleEnter([val, innerValue?.[1]], { e, position: 'first' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onFocus={(val: string, { e }: { e: KeyboardEvent }) => handleFocus([val, innerValue?.[1]], { e, position: 'first' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onBlur={(val: string, { e }: { e: KeyboardEvent }) => handleBlur([val, innerValue?.[1]], { e, position: 'first' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onChange={(val: string, { e }: { e: InputEvent }) => setInnerValue([val, innerValue?.[1]], { e, position: 'first', trigger: 'input' })
            }
            {...{ props: calcInputProps[0] }}
          />

          <div class={`${COMPONENT_NAME}__inner-separator`}>{this.separator}</div>

          <Input
            ref={inputRefs.secondInputRef}
            class={`${COMPONENT_NAME}__inner-right`}
            inputClass={{
              [`${classPrefix}-is-focused`]: this.activeIndex === 1,
            }}
            placeholder={calcPlaceholder[1]}
            disabled={this.disabled}
            readonly={this.readonly}
            format={calcFormat[1]}
            value={innerValue?.[1]}
            onClick={({ e }: { e: MouseEvent }) => this.onClick?.({ e, position: 'second' })}
            onClear={() => setInnerValue([], { position: 'second', trigger: 'input' })}
            onEnter={(val: string, { e }: { e: KeyboardEvent }) => handleEnter([innerValue?.[0], val], { e, position: 'second' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onFocus={(val: string, { e }: { e: KeyboardEvent }) => handleFocus([innerValue?.[0], val], { e, position: 'second' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onBlur={(val: string, { e }: { e: KeyboardEvent }) => handleBlur([innerValue?.[0], val], { e, position: 'second' } as {
                e: any;
                position: RangeInputPosition;
              })
            }
            onChange={(val: string, { e }: { e: InputEvent }) => setInnerValue([innerValue?.[0], val], { e, position: 'second', trigger: 'input' })
            }
            {...{ props: calcInputProps[1] }}
          />
          {suffixContent ? <div class={`${COMPONENT_NAME}__suffix`}>{suffixContent}</div> : null}
          {suffixIconContent && (
            <span class={`${COMPONENT_NAME}__suffix ${COMPONENT_NAME}__suffix-icon`}>
              {isShowClearIcon ? (
                <CloseCircleFilledIcon class={`${COMPONENT_NAME}__suffix-clear`} onClick={handleClear} />
              ) : (
                suffixIconContent
              )}
            </span>
          )}
        </div>
        {this.tips && <div class={`${COMPONENT_NAME}__tips`}>{this.tips}</div>}
      </div>
    );
  },
});
