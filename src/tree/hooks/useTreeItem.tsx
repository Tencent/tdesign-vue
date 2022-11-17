import { CreateElement } from 'vue';
import { SetupContext } from '@vue/composition-api';
import { TypeVNode, TypeTreeItemProps } from '../interface';
import { usePrefixClass } from '../../hooks/useConfig';
import { ClassName } from '../../common';
import useItemEvents from './useItemEvents';
import useRenderIcon from './useRenderIcon';
import useRenderLabel from './useRenderLabel';
import useRenderLine from './useRenderLine';
import useRenderOperations from './useRenderOperations';

export default function useTreeItem(props: TypeTreeItemProps, context: SetupContext) {
  const { node } = props;
  const classPrefix = usePrefixClass().value;
  const componentName = usePrefixClass('tree').value;

  const { handleClick } = useItemEvents(props, context);
  const { renderIcon } = useRenderIcon(props);
  const { renderLabel } = useRenderLabel(props, context);
  const { renderLine } = useRenderLine(props);
  const { renderOperations } = useRenderOperations(props);

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
