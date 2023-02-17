import { computed, toRefs } from '@vue/composition-api';
import { TypeTreeProps, TypeTreeState } from '../interface';
import { Styles } from '../../common';
import { usePrefixClass } from '../../hooks/useConfig';

export function formatCSSUnit(unit: string | number) {
  if (!unit) return unit;
  return isNaN(Number(unit)) ? unit : `${unit}px`;
}

export default function useTreeStyles(props: TypeTreeProps, state: TypeTreeState) {
  const componentName = usePrefixClass('tree').value;
  const classPrefix = usePrefixClass().value;
  const treeState = state;
  const { virtualConfig } = treeState;

  const { height, maxHeight } = toRefs(props);
  const isVirtual = virtualConfig?.isVirtualScroll.value;

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
    if (isVirtual) {
      list.push(`${componentName}--vscroll`);
    }
    return list;
  });

  const treeContentStyles = computed<Styles>(() => ({
    height: formatCSSUnit(height.value),
    maxHeight: formatCSSUnit(maxHeight.value),
  }));

  const scrollStyles = computed<Styles>(() => {
    const transform = `translateY(${virtualConfig?.translateY.value}px)`;
    const posStyle = isVirtual
      ? {
        transform,
        '-ms-transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform,
      }
      : undefined;
    return {
      ...posStyle,
    };
  });

  const cursorStyles = computed<Styles>(() => {
    const translate = `translate(0, ${virtualConfig?.scrollHeight.value}px)`;
    return {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };
  });

  return {
    treeClasses,
    treeContentStyles,
    scrollStyles,
    cursorStyles,
  };
}
