import { CreateElement } from 'vue';
import { CaretRightSmallIcon as TdCaretRightSmallIcon } from 'tdesign-icons-vue';
import { TypeTreeItemProps } from '../interface';
import { usePrefixClass } from '../../hooks/useConfig';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import TLoading from '../../loading';
import { getTNode } from '../util';

// 渲染节点图标
export default function useRenderIcon(props: TypeTreeItemProps) {
  const classPrefix = usePrefixClass().value;
  const componentName = usePrefixClass('tree').value;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFolderIcon = (h: CreateElement) => {
    const { CaretRightSmallIcon } = useGlobalIcon({
      CaretRightSmallIcon: TdCaretRightSmallIcon,
    });
    return <CaretRightSmallIcon />;
  };

  const handleMousedown = (evt: MouseEvent) => {
    // 在点击展开按钮 mousedown阶段 阻止冒泡 应用于处理如展开阻止下拉框失焦等场景
    evt.preventDefault();
  };

  const renderIcon = (h: CreateElement) => {
    const { node, treeScope } = props;
    const { scopedSlots } = treeScope;
    const treeProps = treeScope?.treeProps || {};
    const { icon } = treeProps;
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
        onmousedown={handleMousedown}
      >
        {iconNode}
      </span>
    );
    return wrapIconNode;
  };

  return {
    renderIcon,
  };
}
