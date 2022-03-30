import Vue from 'vue/types';

export function updateTable(parentRef: Vue, level = 0) {
  if (!parentRef || !parentRef.$children || level >= 6) return;
  const children = parentRef.$children;
  for (let i = 0, len = children.length; i < len; i++) {
    const node = children[i];
    const name = node?.$options?.name;
    // @ts-ignore
    if (name && /(TTable|TBaseTable|TPrimaryTable|TEnhancedTable)/i.test(name) && node.refreshTable) {
      // @ts-ignore
      node.refreshTable();
      return;
    }
    if (node?.$children?.length) {
      updateTable(node, level + 1);
    }
  }
}

export function updateElement(parentRef: Vue) {
  updateTable(parentRef);
}

// 由于父元素进行 display: none 的切换时，子元素无法检测到自身变化，因此需要在父元素中刷新子元素状态，如：表格的固定列
export default function useDestroyOnClose(parentRef: Vue) {
  const updateElement = () => {
    updateTable(parentRef);
  };
  return {
    updateElement,
  };
}
