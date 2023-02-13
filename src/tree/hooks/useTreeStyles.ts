import { computed, toRefs } from '@vue/composition-api';
import { TypeTreeProps } from '../interface';
import { Styles } from '../../common';
import { usePrefixClass } from '../../hooks/useConfig';

export function formatCSSUnit(unit: string | number) {
  if (!unit) return unit;
  return isNaN(Number(unit)) ? unit : `${unit}px`;
}

export default function useTreeStyles(props: TypeTreeProps) {
  const componentName = usePrefixClass('tree').value;
  const classPrefix = usePrefixClass().value;

  const { height, maxHeight } = toRefs(props);

  const treeClasses = computed(() => {
    const list: Array<string> = [componentName];
    const {
      disabled, hover, transition, checkable, draggable, expandOnClickNode,
    } = props;
    if (disabled) {
      list.push(`${classPrefix}-is-disabled`);
    }
    if (hover) {
      list.push(`${componentName}--hoverable`);
    }
    if (checkable) {
      list.push(`${componentName}--checkable`);
    }
    if (draggable) {
      list.push(`${componentName}--draggable`);
    }
    if (transition) {
      list.push(`${componentName}--transition`);
    }
    if (expandOnClickNode) {
      list.push(`${componentName}--block-node`);
    }
    return list;
  });

  const treeContentStyles = computed<Styles>(() => ({
    height: formatCSSUnit(height.value),
    maxHeight: formatCSSUnit(maxHeight.value),
  }));

  return {
    treeClasses,
    treeContentStyles,
  };
}
