import { SetupContext } from '@vue/composition-api';
import { TypeTreeProps, TypeTreeState, TypeEventState } from '../interface';
import { getMark, emitEvent } from '../util';
import useTreeAction from './useTreeAction';

// tree 组件一般事件处理
export default function useTreeEvents(props: TypeTreeProps, context: SetupContext, state: TypeTreeState) {
  const { cache } = state;

  const { toggleExpanded, toggleActived, toggleChecked } = useTreeAction(props, context, state);

  const handleClick = (evtState: TypeEventState) => {
    const { mouseEvent, event, node } = evtState;
    if (!node) {
      return;
    }

    cache.mouseEvent = mouseEvent;

    let shouldExpand = props.expandOnClickNode;
    let shouldActive = !props.disabled && !node.disabled;
    ['trigger', 'ignore'].forEach((markName) => {
      const mark = getMark(markName, event.target as HTMLElement, event.currentTarget as HTMLElement);
      const markValue = mark?.value || '';
      if (markValue.indexOf('expand') >= 0) {
        if (markName === 'trigger') {
          shouldExpand = true;
        } else if (markName === 'ignore') {
          shouldExpand = false;
        }
      }
      if (markValue.indexOf('active') >= 0) {
        if (markName === 'ignore') {
          shouldActive = false;
        }
      }
    });

    if (shouldExpand) {
      toggleExpanded(node);
    }

    const evtCtx = {
      node: node.getModel(),
      e: mouseEvent,
    };

    if (shouldActive) {
      toggleActived(node);
      emitEvent<Parameters<TypeTreeProps['onClick']>>(props, context, 'click', evtCtx);
    }

    cache.mouseEvent = null;
  };

  const handleChange = (evtState: TypeEventState) => {
    const { disabled } = props;
    const { node } = evtState;
    if (!node || disabled || node.disabled) {
      return;
    }
    toggleChecked(node);
  };

  return {
    handleChange,
    handleClick,
  };
}
