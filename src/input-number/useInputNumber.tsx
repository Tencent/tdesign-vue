import {
  computed, ref, SetupContext, toRefs, watch,
} from '@vue/composition-api';
import useCommonClassName from '../hooks/useCommonClassName';
import useVModel from '../hooks/useVModel';
import { TdInputNumberProps } from './type';
// 计算逻辑，统一到 common 中，方便各框架复用（如超过 16 位的大数处理）
import {
  canAddNumber,
  canReduceNumber,
  formatToNumber,
  getMaxOrMinValidateResult,
  getStepValue,
} from '../_common/js/input-number/number';
import { isInputNumber } from '../_common/js/input-number/large-number';

/**
 * 独立一个组件 Hook 方便用户直接使用相关逻辑 自定义任何样式的数字输入框
 */
export default function useInputNumber(props: TdInputNumberProps, context: SetupContext) {
  const { classPrefix, sizeClassNames, statusClassNames } = useCommonClassName();
  const { value } = toRefs(props);
  // 统一处理受控、非受控、语法糖 v-model 等
  const [tValue, setTValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

  const userInput = ref('');
  const displayValue = ref();
  const tDisabled = ref(false);

  const isError = ref<'exceed-maximum' | 'below-minimum'>();

  watch(
    tValue,
    (val) => {
      userInput.value = String(val);
    },
    { immediate: true },
  );

  watch(
    () => [tValue, props.max, props.min],
    () => {
      // 没有输入完成，则无需校验
      if (tValue.value === '-') return;
      const error = getMaxOrMinValidateResult({
        number: tValue.value,
        largeNumber: props.largeNumber,
        max: props.max,
        min: props.min,
      });
      isError.value = error;
      props.onValidate?.({ error });
      context.emit('validate', { error });
    },
    { immediate: true },
  );

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

  const handleStepValue = (op: 'add' | 'reduce') => getStepValue({
    op,
    step: props.step,
    max: props.max,
    min: props.min,
    lastValue: tValue.value,
    largeNumber: props.largeNumber,
    decimalPlaces: props.decimalPlaces,
  });

  const handleReduce = (e: KeyboardEvent | MouseEvent) => {
    if (disabledReduce.value || props.readonly) return;
    const newValue = handleStepValue('reduce');
    setTValue(newValue, { type: 'reduce', e });
  };

  const handleAdd = (e: KeyboardEvent | MouseEvent) => {
    if (disabledAdd.value || props.readonly) return;
    const newValue = handleStepValue('add');
    setTValue(newValue, { type: 'add', e });
  };

  const onInnerInputChange = (val: string, e: InputEvent) => {
    userInput.value = val;
    // 大数-字符串；普通数-数字
    let newVal = props.largeNumber || isNaN(Number(val)) || !val ? val : Number(val);
    newVal = isInputNumber(val) ? newVal : tValue.value;
    if (newVal !== tValue.value && val !== '-') {
      setTValue(newVal, { type: 'input', e });
    }
  };

  const handleBlur = (value: string, ctx: { e: FocusEvent }) => {
    const newValue = formatToNumber(value, {
      decimalPlaces: props.decimalPlaces,
      largeNumber: props.largeNumber,
      format: props.format,
    });
    if (newValue !== value && String(newValue) !== value) {
      setTValue(newValue, { type: 'blur', e: ctx.e });
      props.onBlur?.(newValue, ctx);
      context.emit('blur', newValue, ctx);
    }
  };

  const handleFocus = (value: string, ctx: { e: FocusEvent }) => {
    props.onBlur?.(tValue.value, ctx);
    context.emit('blur', tValue.value, ctx);
  };

  const handleKeydown = (value: string, ctx: { e: KeyboardEvent }) => {
    const { e } = ctx;
    const keyEvent = {
      ArrowUp: handleAdd,
      ArrowDown: handleReduce,
    };
    const code = e.code || e.key;
    if (keyEvent[code] !== undefined) {
      keyEvent[code](e);
    }
    props.onKeydown?.(tValue.value, ctx);
    context.emit('keydown', tValue.value, ctx);
  };

  const handleKeyup = (value: string, ctx: { e: KeyboardEvent }) => {
    props.onKeydown?.(tValue.value, ctx);
    context.emit('keydown', tValue.value, ctx);
  };

  const handleKeypress = (value: string, ctx: { e: KeyboardEvent }) => {
    props.onKeypress?.(tValue.value, ctx);
    context.emit('keypress', tValue.value, ctx);
  };

  const handleEnter = (value: string, ctx: { e: KeyboardEvent }) => {
    const newValue = formatToNumber(value, {
      decimalPlaces: props.decimalPlaces,
      largeNumber: props.largeNumber,
      format: props.format,
    });
    if (newValue !== value && String(newValue) !== value) {
      setTValue(newValue, { type: 'blur', e: ctx.e });
      props.onEnter?.(newValue, ctx);
      context.emit('enter', newValue, ctx);
    }
  };

  const listeners = {
    blur: handleBlur,
    focus: handleFocus,
    keydown: handleKeydown,
    keyup: handleKeyup,
    keypress: handleKeypress,
    enter: handleEnter,
  };

  return {
    classPrefix,
    wrapClasses,
    reduceClasses,
    addClasses,
    displayValue,
    tDisabled,
    isError,
    listeners,
    userInput,
    tValue,
    handleReduce,
    handleAdd,
    onInnerInputChange,
  };
}
