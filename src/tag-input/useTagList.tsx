import { ref, SetupContext, toRefs } from '@vue/composition-api';
import {
  TagInputValue, TagInputChangeContext, TdTagInputProps, TagInputRemoveContext,
} from './type';
import { InputValue } from '../input';
import Tag from '../tag';
import useVModel from '../hooks/useVModel';
import { useTNodeJSX } from '../hooks/tnode';
import { useConfig } from '../config-provider/useConfig';
import { DragProps } from './interface';

export type ChangeParams = [TagInputChangeContext];

// handle tag add and remove
export default function useTagList(props: TdTagInputProps, context: SetupContext, getDragProps: DragProps) {
  const renderTNode = useTNodeJSX();
  const { classPrefix } = useConfig('classPrefix');

  const {
    value, onRemove, max, minCollapsedNum, size, disabled, readonly, tagProps,
  } = toRefs(props);

  // handle controlled property and uncontrolled property
  const [tagValue, setTagValue] = useVModel(value, props.defaultValue || [], props.onChange, 'change');
  // const { onChange } = props;
  const oldInputValue = ref<InputValue>();

  // 点击标签关闭按钮，删除标签
  const onClose = (p: { e?: MouseEvent; index: number; item: string | number }) => {
    const arr = [...tagValue.value];
    arr.splice(p.index, 1);
    setTagValue(arr, { trigger: 'tag-remove', ...p });
    const removeParams: TagInputRemoveContext = { ...p, trigger: 'tag-remove', value: arr };
    onRemove.value?.(removeParams);
    context.emit('remove', removeParams);
  };

  const clearAll = (context: { e: MouseEvent }) => {
    setTagValue([], { trigger: 'clear', e: context.e });
  };

  // 按下 Enter 键，新增标签
  const onInnerEnter = (value: InputValue, params: { e: KeyboardEvent }) => {
    const valueStr = String(value).trim();
    let newValue: TagInputValue = tagValue.value;
    const isLimitExceeded = max && tagValue.value?.length >= max.value;
    if (!isLimitExceeded && valueStr) {
      newValue = tagValue.value instanceof Array ? tagValue.value.concat(String(valueStr)) : [valueStr];
      setTagValue(newValue, {
        trigger: 'enter',
        index: newValue.length - 1,
        item: valueStr,
        e: params.e,
      });
    }
    const enterEventParams = { ...params, inputValue: value };
    props.onEnter?.(newValue, enterEventParams);
    context.emit('enter', newValue, enterEventParams);
  };

  const onInputBackspaceKeyUp = (value: InputValue) => {
    if (!tagValue.value || !tagValue.value.length) return;
    oldInputValue.value = value;
  };
  // 按下回退键，删除标签
  const onInputBackspaceKeyDown = (value: InputValue, p: { e: KeyboardEvent }) => {
    const { e } = p;
    if (!tagValue.value || !tagValue.value.length) return;
    // 回车键删除，输入框值为空时，才允许 Backspace 删除标签
    const isDelete = /(Backspace|NumpadDelete)/.test(e.code) || /(Backspace|NumpadDelete)/.test(e.key);
    if (!oldInputValue.value && isDelete) {
      const index = tagValue.value.length - 1;
      const item = tagValue.value[index];
      const trigger = 'backspace';
      const newValue = tagValue.value.slice(0, -1);
      const params: Omit<TagInputRemoveContext, 'value'> = {
        e,
        index,
        item,
        trigger,
      };
      setTagValue(newValue, params);
      const removeParams: TagInputRemoveContext = { ...params, value: newValue };
      onRemove.value?.(removeParams);
      context.emit('remove', removeParams);
    }
    oldInputValue.value = value;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderLabel = ({ displayNode, label }: { displayNode: any; label: any }, h: Vue.CreateElement) => {
    const newList = minCollapsedNum.value ? tagValue.value.slice(0, minCollapsedNum.value) : tagValue.value;
    const list = displayNode
      ? [displayNode]
      : newList?.map?.((item, index) => {
        const tagContent = renderTNode('tag', { params: { value: item } });
        const TagNode = (
            <Tag
              key={index}
              size={size.value}
              disabled={disabled.value}
              onClose={(context: { e: MouseEvent }) => onClose({ e: context.e, item, index })}
              closable={!readonly.value && !disabled.value}
              props={tagProps.value}
            >
              {tagContent ?? item}
            </Tag>
        );
        const itemDrag = getDragProps?.(index, item);

        return itemDrag && itemDrag.draggable ? (
            <span
              class={`${classPrefix.value}-tag-input__drag_wrapper`}
              draggable={true}
              onDragstart={itemDrag.onDragstart}
              onDragover={itemDrag.onDragover}
              onDragend={itemDrag.onDragend}
              onDrop={itemDrag.onDrop}
            >
              {TagNode}
            </span>
        ) : (
          TagNode
        );
      }) || [];
    if (![null, undefined, ''].includes(label)) {
      list.unshift(
        <div class={`${classPrefix.value}-tag-input__prefix`} key="label">
          {label}
        </div>,
      );
    }
    // 超出省略
    if (newList.length !== tagValue.value.length) {
      const len = tagValue.value.length - newList.length;
      const more = renderTNode('collapsedItems', {
        params: {
          value: tagValue.value,
          count: tagValue.value.length - minCollapsedNum.value,
          collapsedTags: tagValue.value.slice(minCollapsedNum.value, tagValue.value.length),
        },
      });
      list.push(more ?? <Tag key="more">+{len}</Tag>);
    }
    return list;
  };

  return {
    tagValue,
    clearAll,
    onClose,
    onInnerEnter,
    onInputBackspaceKeyUp,
    onInputBackspaceKeyDown,
    renderLabel,
  };
}
