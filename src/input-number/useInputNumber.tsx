import Vue from 'vue';
import {
  computed, ref, SetupContext, toRefs, watch,
} from '@vue/composition-api';
import useCommonClassName from '../hooks/useCommonClassName';
import useVModel from '../hooks/useVModel';
import { InputNumberValue, TdInputNumberProps } from './type';
// 计算逻辑，统一到 common 中，方便各框架复用（如超过 16 位的大数处理）
import {
  canAddNumber,
  canInputNumber,
  canReduceNumber,
  getMaxOrMinValidateResult,
  getStepValue,
  formatThousandths,
  canSetValue,
  formatUnCompleteNumber,
  largeNumberToFixed,
} from '../_common/js/input-number/number';
import useFormDisabled from '../hooks/useFormDisabled';
import { InputProps } from '..';

/**
 * 独立一个组件 Hook 方便用户直接使用相关逻辑 自定义任何样式的数字输入框
 */
export default function useInputNumber(props: TdInputNumberProps, context: SetupContext) {
  const { classPrefix, sizeClassNames, statusClassNames } = useCommonClassName();
  const { value, max, min } = toRefs(props);
  // 统一处理受控、非受控、语法糖 v-model 等
  const [tValue, setTValue] = useVModel(value, props.defaultValue, props.onChange, 'change');
  const inputRef = ref<Vue>();
  const userInput = ref('');

  const { formDisabled } = useFormDisabled();
  const tDisabled = computed(() => props.disabled || formDisabled.value);

  const isError = ref<'exceed-maximum' | 'below-minimum'>();

  const disabledReduce = computed(
    () => tDisabled.value || !canReduceNumber(tValue.value, props.min, props.largeNumber),
  );

  const disabledAdd = computed(() => tDisabled.value || !canAddNumber(tValue.value, props.max, props.largeNumber));

  const wrapClasses = computed(() => [
    `${classPrefix.value}-input-number`,
    sizeClassNames[props.size],
    {
      [statusClassNames.disabled]: tDisabled.value,
      [`${classPrefix.value}-is-controls-right`]: props.theme === 'column',
      [`${classPrefix.value}-input-number--${props.theme}`]: props.theme,
      [`${classPrefix.value}-input-number--auto-width`]: props.autoWidth,
    },
  ]);

  const reduceClasses = computed(() => [
    `${classPrefix.value}-input-number__decrease`,
    { [statusClassNames.disabled]: disabledReduce.value },
  ]);

  const addClasses = computed(() => [
    `${classPrefix.value}-input-number__increase`,
    { [statusClassNames.disabled]: disabledAdd.value },
  ]);

  const getUserInput = (value: InputNumberValue) => {
    if (!value && value !== 0) return '';
    let inputStr = value || value === 0 ? String(value) : '';
    if (!inputRef.value?.$el?.contains(document.activeElement)) {
      const num = formatUnCompleteNumber(inputStr, {
        decimalPlaces: props.decimalPlaces,
        largeNumber: props.largeNumber,
        isToFixed: true,
      });
      inputStr = num || num === 0 ? String(num) : '';
      if (props.format) {
        inputStr = String(props.format(value, { fixedNumber: inputStr }));
      }
    }
    return inputStr;
  };

  watch(
    tValue,
    (val) => {
      const { largeNumber, decimalPlaces } = props;
      const inputValue = [undefined, null].includes(val) ? '' : String(val);
      // userInput.value 为非合法数字，则表示用户正在输入，此时无需处理
      if (!largeNumber && !Number.isNaN(userInput.value)) {
        if (parseFloat(userInput.value) !== val) {
          userInput.value = getUserInput(inputValue);
        }
        const fixedNumber = Number(largeNumberToFixed(inputValue, decimalPlaces, largeNumber));
        if (
          decimalPlaces !== undefined
          && ![undefined, null].includes(val)
          && Number(fixedNumber) !== Number(tValue.value)
        ) {
          setTValue(fixedNumber, { type: 'props', e: undefined });
        }
      }
      if (largeNumber) {
        userInput.value = getUserInput(inputValue);
        if (decimalPlaces !== undefined && largeNumberToFixed(inputValue, decimalPlaces, largeNumber) !== val) {
          setTValue(userInput.value, { type: 'props', e: undefined });
        }
      }
    },
    { immediate: true },
  );

  watch(
    [tValue, max, min],
    () => {
      // @ts-ignore 没有输入完成，则无需校验
      if ([undefined, '', null].includes(tValue.value)) return;
      const { max, min, largeNumber } = props;
      const error = getMaxOrMinValidateResult({
        value: tValue.value,
        largeNumber,
        max,
        min,
      });
      isError.value = error;
      props.onValidate?.({ error });
      context.emit('validate', { error });
    },
    { immediate: true },
  );

  const handleStepValue = (op: 'add' | 'reduce') => {
    const newValue = getStepValue({
      op,
      step: props.step,
      max: props.max,
      min: props.min,
      lastValue: tValue.value,
      largeNumber: props.largeNumber,
    });
    const { largeNumber, max, min } = props;
    const overLimit = getMaxOrMinValidateResult({
      value: newValue,
      largeNumber,
      max,
      min,
    });
    return {
      overLimit,
      newValue,
    };
  };

  const handleReduce = (e: KeyboardEvent | MouseEvent) => {
    if (disabledReduce.value || props.readonly) return;
    const r = handleStepValue('reduce');
    if (r.overLimit && !props.allowInputOverLimit) return;
    setTValue(r.newValue, { type: 'reduce', e });
  };

  const handleAdd = (e: KeyboardEvent | MouseEvent) => {
    if (disabledAdd.value || props.readonly) return;
    const r = handleStepValue('add');
    if (r.overLimit && !props.allowInputOverLimit) return;
    setTValue(r.newValue, { type: 'add', e });
  };

  const onInnerInputChange = (inputValue: string, { e }: { e: InputEvent }) => {
    // 千分位处理
    const val = formatThousandths(inputValue);
    if (!canInputNumber(val, props.largeNumber)) return;

    userInput.value = val;

    if (props.largeNumber) {
      setTValue(val, { type: 'input', e });
      return;
    }

    if (canSetValue(String(val), Number(tValue.value))) {
      const newVal = val === '' ? undefined : Number(val);
      setTValue(newVal, { type: 'input', e });
    }
  };

  /**
   * 1. 处理数字输入超出限制；
   * 2. 处理未输入完成的数字；如：2e/2+/2.等
   * 3. 格式化数字/数字小数点
   */
  const emitBlur = (value: InputNumberValue, ctx: { e: FocusEvent }) => {
    props.onBlur?.(value, ctx);
    context.emit('blur', value, ctx);
  };

  const handleBlur = (value: string, ctx: { e: FocusEvent }) => {
    const {
      largeNumber, max, min, decimalPlaces,
    } = props;
    if (!props.allowInputOverLimit && tValue.value !== undefined) {
      const r = getMaxOrMinValidateResult({
        value: tValue.value,
        largeNumber,
        max,
        min,
      });
      if (r === 'below-minimum') {
        setTValue(min, { type: 'blur', e: ctx.e });
        emitBlur(min, ctx);
        return;
      }
      if (r === 'exceed-maximum') {
        setTValue(max, { type: 'blur', e: ctx.e });
        emitBlur(max, ctx);
        return;
      }
    }
    const newValue = formatUnCompleteNumber(String(value), {
      decimalPlaces,
      largeNumber,
    });
    userInput.value = getUserInput(newValue);
    if (newValue !== tValue.value) {
      setTValue(newValue, { type: 'blur', e: ctx.e });
    }
    emitBlur(newValue, ctx);
  };

  const handleFocus = (value: string, ctx: { e: FocusEvent }) => {
    userInput.value = tValue.value || tValue.value === 0 ? String(tValue.value) : '';
    props.onFocus?.(value, ctx);
    context.emit('focus', value, ctx);
  };

  const handleKeydown = (value: string, ctx: { e: KeyboardEvent }) => {
    const { e } = ctx;
    const keyEvent = {
      ArrowUp: handleAdd,
      ArrowDown: handleReduce,
    };
    const code = (e.code || e.key) as keyof typeof keyEvent;
    if (keyEvent[code] !== undefined) {
      keyEvent[code](e);
    }
    props.onKeydown?.(value, ctx);
    context.emit('keydown', value, ctx);
  };

  const handleKeyup = (value: string, ctx: { e: KeyboardEvent }) => {
    props.onKeyup?.(value, ctx);
    context.emit('keyup', value, ctx);
  };

  const handleKeypress = (value: string, ctx: { e: KeyboardEvent }) => {
    props.onKeypress?.(value, ctx);
    context.emit('keypress', value, ctx);
  };

  const handleEnter = (value: string, ctx: { e: KeyboardEvent }) => {
    userInput.value = getUserInput(value);
    const newValue = formatUnCompleteNumber(value, {
      decimalPlaces: props.decimalPlaces,
      largeNumber: props.largeNumber,
    });
    props.onEnter?.(newValue, ctx);
    context.emit('enter', newValue, ctx);
  };

  const handleClear: InputProps['onClear'] = ({ e }) => {
    setTValue(undefined, { type: 'clear', e });
    userInput.value = '';
  };

  const focus = () => {
    (inputRef.value as any).focus();
  };

  const blur = () => {
    (inputRef.value as any).blur();
  };

  const listeners = {
    blur: handleBlur,
    focus: handleFocus,
    keydown: handleKeydown,
    keyup: handleKeyup,
    keypress: handleKeypress,
    enter: handleEnter,
    click: focus,
    clear: handleClear,
  };

  return {
    classPrefix,
    wrapClasses,
    reduceClasses,
    addClasses,
    tDisabled,
    isError,
    listeners,
    userInput,
    tValue,
    inputRef,
    formDisabled,
    focus,
    blur,
    handleReduce,
    handleAdd,
    onInnerInputChange,
  };
}
