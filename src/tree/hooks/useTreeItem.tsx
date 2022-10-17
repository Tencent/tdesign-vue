import { CreateElement } from 'vue';
import {
  // ref,
  // nextTick,
  SetupContext,
  // Ref,
} from '@vue/composition-api';
import {
  // TypeVNode,
  // TreeNodeValue,
  TypeTreeItemProps,
  // TypeTreeState,
  TypeEventState,
  // TypeTargetNode,
} from '../interface';
import {
  // useConfig,
  usePrefixClass,
} from '../../hooks/useConfig';
import { ClassName } from '../../common';
// import TreeNode from '../../_common/js/tree/tree-node';
// import { getMark, getNode } from '../util';

export default function useTreeItem(props: TypeTreeItemProps, context: SetupContext) {
  const classPrefix = usePrefixClass().value;
  const componentName = usePrefixClass('tree').value;
  const { node } = props;

  const nodesMap = new Map();

  const getItemStyles = (): string => {
    const { level, visible } = node;
    const levelStyle = `--level: ${level};`;
    const hiddenStyle = 'display:none;';
    if (visible) return levelStyle;
    return `${hiddenStyle} ${levelStyle}`;
  };

  const getItemClassList = (): ClassName => {
    const { nested } = props;

    const list = [];
    list.push(`${componentName}__item`);
    list.push({
      [`${componentName}__item--open`]: node.expanded,
      [`${classPrefix}-is-active`]: node.isActivable() ? node.actived : false,
      [`${classPrefix}-is-disabled`]: node.isDisabled(),
    });
    if (!nested) {
      if (node.visible) {
        list.push(`${componentName}__item--visible`);
      } else {
        list.push(`${componentName}__item--hidden`);
      }
    }
    return list;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderItem = (h: CreateElement) => {
    const itemNode = <div></div>;
    return itemNode;
  };

  let clicked = false;
  const handleClick = (evt: MouseEvent) => {
    const { expandOnClickNode } = props;
    const srcTarget = evt.target as HTMLElement;
    const isBranchTrigger = node.children
      && expandOnClickNode
      && (srcTarget.className === `${classPrefix}-checkbox__input` || srcTarget.tagName.toLowerCase() === 'input');
    // checkbox 上也有 emit click 事件
    // 用这个逻辑避免重复的 click 事件被触发
    if (clicked || isBranchTrigger) return;

    // 处理expandOnClickNode时与checkbox的选中的逻辑冲突
    if (expandOnClickNode && node.children && srcTarget.className?.indexOf?.(`${classPrefix}-tree__label`) !== -1) evt.preventDefault();

    clicked = true;
    setTimeout(() => {
      clicked = false;
    });

    const state: TypeEventState = {
      mouseEvent: evt,
      event: evt,
      node,
      path: node.getPath(),
    };
    context.emit('click', state);
  };

  const renderItemNode = (h: CreateElement) => {
    const { level, value } = node;
    const styles = getItemStyles();
    const classList = getItemClassList();

    const itemNode = (
      <div
        class={classList}
        data-value={value}
        data-level={level}
        style={styles}
        onClick={(evt: MouseEvent) => handleClick(evt)}
      >
        {renderItem(h)}
      </div>
    );
    return itemNode;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderBranchNode = (h: CreateElement) => {
    const branchNode = <div></div>;
    return branchNode;
  };

  const clearNodesMap = () => {
    nodesMap.clear();
  };

  return {
    renderItemNode,
    renderBranchNode,
    clearNodesMap,
  };
}
