import { CreateElement } from 'vue';
import { SetupContext } from '@vue/composition-api';
import { CaretRightSmallIcon as TdCaretRightSmallIcon } from 'tdesign-icons-vue';
import { TypeVNode, TypeTreeItemProps, TypeEventState } from '../interface';
import { usePrefixClass } from '../../hooks/useConfig';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import { ClassName } from '../../common';
import TreeNode from '../../_common/js/tree/tree-node';
import TCheckBox from '../../checkbox';
import TLoading from '../../loading';
import { getTNode } from '../util';

export default function useTreeItem(props: TypeTreeItemProps, context: SetupContext) {
  const { node } = props;
  const classPrefix = usePrefixClass().value;
  const componentName = usePrefixClass('tree').value;

  // 节点隐藏用 class 切换，不要写在 js 中
  const getItemStyles = (): string => {
    const { level } = node;
    const levelStyle = `--level: ${level};`;
    return levelStyle;
  };

  const getItemClassList = (): ClassName => {
    const list = [];
    list.push(`${componentName}__item`);
    list.push({
      [`${componentName}__item--open`]: node.expanded,
      [`${classPrefix}-is-active`]: node.isActivable() ? node.actived : false,
      [`${classPrefix}-is-disabled`]: node.isDisabled(),
    });
    if (node.visible) {
      list.push(`${componentName}__item--visible`);
    } else {
      list.push(`${componentName}__item--hidden`);
    }
    return list;
  };

  const handleChange = () => {
    const event = new Event('change');
    const state: TypeEventState = {
      event,
      node,
    };
    context.emit('change', state);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFolderIcon = (h: CreateElement) => {
    const { CaretRightSmallIcon } = useGlobalIcon({
      CaretRightSmallIcon: TdCaretRightSmallIcon,
    });
    return <CaretRightSmallIcon />;
  };

  const renderLine = (h: CreateElement): TypeVNode => {
    const { node, treeScope } = props;
    const { line, scopedSlots } = treeScope;
    const iconVisible = !!treeScope.icon;

    let lineNode = null;
    if (line === true) {
      if (scopedSlots?.line) {
        lineNode = scopedSlots.line({
          node: node?.getModel(),
        });
      } else if (node.parent && node.tree) {
        const { vmIsLeaf, vmIsFirst, level } = node;

        const lineClasses = [];

        // 每个节点绘制抵达上一层级的折线
        lineClasses.push(`${componentName}__line`);

        // 叶子节点，折线宽度延长，因为没有 icon 呈现
        // 任意节点，icon 不呈现时也是要延长折线宽度
        if (vmIsLeaf || !iconVisible) {
          lineClasses.push(`${componentName}__line--leaf`);
        }

        // 分支首节点，到上一节点的折线高度要缩短，让位给 icon 呈现
        // 如果 icon 隐藏了，则不必缩短折线高度
        if (vmIsFirst && iconVisible) {
          lineClasses.push(`${componentName}__line--first`);
        }

        // 如果节点的父节点，不是最后的节点
        // 则需要绘制节点延长线
        const shadowStyles: string[] = [];
        const parents = node.getParents();
        parents.pop();
        parents.forEach((pnode: TreeNode, index: number) => {
          if (!pnode.vmIsLast) {
            shadowStyles.push(`calc(-${index + 1} * var(--space)) 0 var(--color)`);
          }
        });

        const styles = {
          '--level': level ? String(level) : undefined,
          'box-shadow': shadowStyles.join(','),
        };

        lineNode = <span class={lineClasses} style={styles}></span>;
      }
    } else {
      lineNode = getTNode(line, {
        createElement: h,
        node,
      });
    }
    return lineNode as TypeVNode;
  };

  const renderIcon = (h: CreateElement) => {
    const { node, treeScope } = props;
    const { icon, scopedSlots } = treeScope;
    let isDefaultIcon = false;

    let iconNode = null;
    if (icon === true) {
      if (scopedSlots?.icon) {
        iconNode = scopedSlots.icon({
          node: node?.getModel(),
        });
      } else if (!node.vmIsLeaf) {
        isDefaultIcon = true;
        iconNode = getFolderIcon(h);
        if (node.loading && node.expanded) {
          iconNode = <TLoading />;
        }
      } else {
        iconNode = '';
      }
    } else if (icon) {
      iconNode = getTNode(icon, {
        createElement: h,
        node,
      });
    }

    const wrapIconNode = (
      <span
        class={[
          `${componentName}__icon`,
          `${classPrefix}-folder-icon`,
          isDefaultIcon ? `${componentName}__icon--default` : '',
        ]}
        trigger="expand"
        ignore="active"
      >
        {iconNode}
      </span>
    );
    return wrapIconNode;
  };

  const renderLabel = (h: CreateElement): TypeVNode => {
    const { treeScope, expandOnClickNode } = props;
    const { label, disableCheck, scopedSlots } = treeScope;
    const checkProps = treeScope.checkProps || {};

    let labelNode = null;
    if (label === true) {
      if (scopedSlots?.label) {
        labelNode = scopedSlots.label({
          node: node?.getModel(),
        });
      } else {
        labelNode = node.label || '';
      }
    } else {
      labelNode = getTNode(label, {
        createElement: h,
        node,
      });
    }

    const labelClasses = [
      `${componentName}__label`,
      {
        [`${classPrefix}-is-active`]: node.isActivable() ? node.actived : false,
      },
    ];

    if (node.vmCheckable) {
      let checkboxDisabled = false;
      if (typeof disableCheck === 'function') {
        checkboxDisabled = disableCheck(node.getModel());
      } else {
        checkboxDisabled = !!disableCheck;
      }
      if (node.isDisabled()) {
        checkboxDisabled = true;
      }
      const itemCheckProps = {
        ...checkProps,
        disabled: checkboxDisabled,
      };

      labelNode = (
        <TCheckBox
          // v-ripple={this.keepAnimation.ripple}
          class={labelClasses}
          checked={node.checked}
          indeterminate={node.indeterminate}
          disabled={node.isDisabled()}
          name={String(node.value)}
          onChange={handleChange}
          stopLabelTrigger={expandOnClickNode && Array.isArray(node.children) && node.children?.length > 0}
          ignore="expand,active"
          {...{ props: itemCheckProps }}
        >
          {labelNode}
        </TCheckBox>
      );
    } else {
      const inner = <span style="position: relative">{labelNode}</span>;
      // 使用key是为了避免元素复用，从而顺利移除ripple指令
      labelNode = node.isActivable() ? (
        <span
          key="1"
          // v-ripple={this.keepAnimation.ripple}
          class={labelClasses}
        >
          {inner}
        </span>
      ) : (
        <span key="2" class={labelClasses}>
          {inner}
        </span>
      );
    }

    return labelNode;
  };

  const renderOperations = (h: CreateElement): TypeVNode => {
    const { treeScope } = props;
    const { operations, scopedSlots } = treeScope;

    let opNode = null;
    if (scopedSlots?.operations) {
      opNode = scopedSlots.operations({
        node: node?.getModel(),
      });
    } else {
      opNode = getTNode(operations, {
        createElement: h,
        node,
      });
    }
    if (opNode) {
      opNode = (
        <span class={`${componentName}__operations`} ignore="active,expand">
          {opNode}
        </span>
      );
    }
    return opNode as TypeVNode;
  };

  const renderItem = (h: CreateElement) => {
    const itemNodes: TypeVNode[] = [];

    // 第一步是渲染图标
    const iconNode = renderIcon(h);

    // 渲染连线排在渲染图标之后，是为了确认图标是否存在
    const lineNode = renderLine(h);
    if (lineNode) {
      itemNodes.push(lineNode);
    }

    if (iconNode) {
      itemNodes.push(iconNode);
    }

    const labelNode = renderLabel(h);
    if (labelNode) {
      itemNodes.push(labelNode);
    }

    const opNode = renderOperations(h);
    if (opNode) {
      itemNodes.push(opNode);
    }

    return itemNodes;
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

  return {
    renderItemNode,
  };
}
