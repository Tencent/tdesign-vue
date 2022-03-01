import {
  SetupContext, computed, ref, toRefs, getCurrentInstance,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import { TdSelectInputProps, SelectInputChangeContext, SelectInputKeys } from './type';
import TagInput, { TagInputValue, InputValueChangeContext } from '../tag-input';
import { SelectInputCommonProperties } from './interface';
import { InputValue } from '../input';
import useDefault from '../hooks/useDefault';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent }) => void;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

export default function useMultiple(props: TdSelectInputProps, context: SetupContext) {
  const { inputValue } = toRefs(props);
  const instance = getCurrentInstance();
  const tagInputRef = ref();
  const [tInputValue, setTInputValue] = useDefault(
    inputValue,
    props.defaultInputValue,
    props.onInputChange,
    context.emit,
    'inputValue',
  );
  const iKeys = computed<SelectInputKeys>(() => ({ ...DEFAULT_KEYS, ...props.keys }));
  const tags = computed<TagInputValue>(() => {
    if (!(props.value instanceof Array)) {
      return isObject(props.value) ? [props.value[iKeys.value.label]] : [props.value];
    }
    return props.value.map((item) => (isObject(item) ? item[iKeys.value.label] : item));
  });

  const tPlaceholder = computed<string>(() => (!tags.value || !tags.value.length ? props.placeholder : ''));

  const onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
    // 避免触发浮层的显示或隐藏
    if (context.trigger === 'tag-remove') {
      context.e?.stopPropagation();
    }
    props.onTagChange?.(val, context);
    instance.emit('tag-change', val, context);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectMultiple = (p: RenderSelectMultipleParams, h: any) => (
    <TagInput
      ref="tagInputRef"
      scopedSlots={context.slots}
      label={props.label}
      autoWidth={props.borderless || props.autoWidth}
      minCollapsedNum={props.minCollapsedNum}
      collapsedItems={props.collapsedItems}
      tag={props.tag}
      valueDisplay={props.valueDisplay}
      placeholder={tPlaceholder.value}
      value={tags.value}
      inputValue={tInputValue.value || ''}
      onChange={onTagInputChange}
      on={{
        'input-change': (val: InputValue, context: InputValueChangeContext) => {
          // 筛选器统一特性：筛选器按下回车时不清空输入框
          if (context?.trigger === 'enter') return;
          setTInputValue(val, { trigger: context.trigger, e: context.e });
        },
      }}
      onClear={(context: { e: MouseEvent }) => {
        context.e.stopPropagation();
        p.onInnerClear;
      }}
      tagProps={props.tagProps}
      onBlur={(val: TagInputValue, context: { inputValue: InputValue; e: FocusEvent }) => {
        // 筛选器统一特性：失去焦点时，清空输入内容
        setTInputValue('', { ...context, trigger: 'blur' });
        instance.emit('blur', props.value, { ...context, tagInputValue: val });
      }}
      onFocus={(val: TagInputValue, context: { inputValue: InputValue; e: FocusEvent }) => {
        props.onFocus?.(props.value, { ...context, tagInputValue: val });
        instance.emit('focus', props.value, { ...context, tagInputValue: val });
      }}
      props={{ ...props.tagInputProps, ...p.commonInputProps, readonly: !props.allowInput }}
    />
  );

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    renderSelectMultiple,
  };
}
