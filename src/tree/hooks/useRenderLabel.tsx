import { CreateElement } from 'vue';
import { SetupContext } from '@vue/composition-api';
import { TypeVNode, TypeTreeItemProps } from '../interface';
import { usePrefixClass } from '../../hooks/useConfig';
import TCheckBox from '../../checkbox';
import { getTNode } from '../util';
import useItemEvents from './useItemEvents';

// 渲染节点文本与内容
export default function useRenderLabel(props: TypeTreeItemProps, context: SetupContext) {
  const classPrefix = usePrefixClass().value;
  const componentName = usePrefixClass('tree').value;

  const { handleChange } = useItemEvents(props, context);

  const renderLabel = (h: CreateElement): TypeVNode => {
    const { node, treeScope, expandOnClickNode } = props;
    const { scopedSlots } = treeScope;
    const treeProps = treeScope?.treeProps || {};
    const { label, disableCheck } = treeProps;
    const checkProps = treeProps?.checkProps || {};

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
      if (node.vmIsLocked && !node.vmIsRest) {
        checkboxDisabled = true;
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
          props={itemCheckProps}
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
          title={node.label}
        >
          {inner}
        </span>
      ) : (
        <span key="2" class={labelClasses} title={node.label}>
          {inner}
        </span>
      );
    }

    return labelNode;
  };

  return {
    renderLabel,
  };
}
