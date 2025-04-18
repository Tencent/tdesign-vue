import Vue from 'vue';
import { cloneDeep, filter } from 'lodash-es';

import {
  TransferListOptionBase, TransferItemOption, TdTransferProps, TransferValue, DataOption,
} from './interface';

export { emitEvent } from '../utils/event';

export const TRANSFER_NAME = 'TTransfer';

export const SOURCE = 'source';
export const TARGET = 'target';

interface TreeNode {
  children?: Array<TreeNode>;
}

function findTopNode(vm: Vue): Vue {
  // 找到t-transfer这层父节点
  if (vm.$options.name === TRANSFER_NAME) {
    return vm;
  }
  if (vm.$parent) {
    return findTopNode(vm.$parent);
  }
  return vm;
}

function getTransferListOption<T>(prop: T | Array<T>): TransferListOptionBase<T> {
  if (Array.isArray(prop)) {
    return {
      source: prop[0],
      target: prop[1],
    };
  }
  return {
    source: prop,
    target: prop,
  };
}

function getDataValues(
  data: Array<TransferItemOption>,
  filterValues: Array<TransferValue>,
  {
    isTreeMode = false,
    include = true, // true=保留filterValues，false=删除filterValues中元素
    remainValue = [] as Array<TransferValue>,
  } = {},
): Array<TransferValue> {
  // 用于处理 tree 组件这种数据结构是树形的
  if (isTreeMode) {
    let result: Array<TransferValue> = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const isInclude = filterValues.includes(item.value) && !item.disabled;
        if (!include && isInclude) {
          continue; // 排除模式下子元素一律排除
        }

        // 只找叶子节点
        if (item?.children && item.children?.length > 0) {
          const childResult = getDataValues(item.children, filterValues, {
            isTreeMode,
            include,
          });
          result = result.concat(childResult);
        } else if ((include && isInclude) || (!include && !isInclude)) {
          result.push(item.value);
        }
      }
    }
    return result;
  }
  // 处理普通结构
  return data
    .filter((item) => {
      const isInclude = filterValues.includes(item.value);
      return (
        ((include && isInclude) || (!include && !isInclude)) && (!item.disabled || remainValue.includes(item.value))
      );
    })
    .map((item) => item.value);
}

function getTransferData(
  data: Array<DataOption>,
  keys: TdTransferProps['keys'],
  isTreeMode = false,
): Array<TransferItemOption> {
  const list: Array<TransferItemOption> = data.map((transferDataItem, index): TransferItemOption => {
    const labelKey = keys?.label || 'label';
    const valueKey = keys?.value || 'value';
    const disabledKey = keys?.disabled || 'disabled';
    if (transferDataItem[labelKey] === undefined) {
      throw `${labelKey} is not in DataOption ${JSON.stringify(transferDataItem)}`;
    }
    if (transferDataItem[valueKey] === undefined) {
      throw `${valueKey} is not in DataOption ${JSON.stringify(transferDataItem)}`;
    }
    const result: TransferItemOption = {
      label: transferDataItem[labelKey] as string,
      value: transferDataItem[valueKey],
      key: `key__value_${transferDataItem[valueKey]}_index_${index}`,
      disabled: transferDataItem[disabledKey] ?? false,
      data: transferDataItem,
    };
    if (isTreeMode && transferDataItem.children && transferDataItem.children.length > 0) {
      result.children = getTransferData(transferDataItem.children, keys, true);
    }
    return result;
  });
  return list;
}

function isAllNodeValid(data: TransferItemOption, filterValues: Array<TransferValue>, needMatch: boolean): boolean {
  if (filterValues.includes(data.value)) {
    return needMatch;
  }
  return false;
}

function isTreeNodeValid(data: TransferItemOption, filterValues: Array<TransferValue>, needMatch: boolean): boolean {
  if (filterValues.includes(data.value)) {
    return needMatch;
  }
  if (data?.children) {
    return data?.children.some((item) => isTreeNodeValid(item, filterValues, needMatch));
  }
  return !needMatch;
}

// 复制树并过滤节点
function cloneTreeWithFilter(
  sourceTree: TransferItemOption[],
  targetTree: TransferItemOption[],
  filterValues: Array<TransferValue>,
  needMatch: boolean,
) {
  sourceTree.forEach((item) => {
    let newNode: TransferItemOption;
    if (isAllNodeValid(item, filterValues, needMatch)) {
      // 如果当前节点直接命中，则复制所有子节点
      newNode = cloneDeep<TransferItemOption>(item);
      targetTree.push(newNode);
    } else if (isTreeNodeValid(item, filterValues, needMatch)) {
      // 如果有合法子节点，就复制这个节点
      newNode = {
        ...item,
      };
      delete newNode.children;
      targetTree.push(newNode);
      if (item.children) {
        newNode.children = [];
        cloneTreeWithFilter(item.children, newNode.children, filterValues, needMatch);
        if (newNode.children.length === 0) {
          delete newNode.children;
        }
      }
    }
  });
}

// 过滤列表，如果是树的话需要保持树的结构
function filterTransferData(
  data: Array<TransferItemOption>,
  filterValues: Array<TransferValue>,
  needMatch = true,
  isTreeMode = false,
) {
  if (!isTreeMode) {
    if (needMatch) {
      // 正向过滤。要保持filterValues顺序
      const dataMap = new Map(data.map((item) => [item.value, item]));
      return filterValues.map((value) => dataMap.get(value)).filter(Boolean);
    }
    // 反向过滤
    return data.filter((item) => {
      const isMatch = filterValues.includes(item.value);
      return !isMatch;
    });
  }

  const result: Array<TransferItemOption> = [];
  cloneTreeWithFilter(data, result, filterValues, needMatch);
  return result;
}

// 获取树节点的叶子数量
function getLeafCount(nodes: Array<TreeNode>): number {
  let total = 0;
  nodes.forEach((child) => {
    if (child.children && child.children.length > 0) {
      total += getLeafCount(child.children);
    } else {
      total += 1;
    }
  });
  return total;
}

// 递归过滤树结构
// sync from https://github.com/Tencent/tdesign-vue-next/pull/3336
function filterTreeData(tree: Array<TransferItemOption>, filterStr: string): Array<TransferItemOption> {
  const res = filter(cloneDeep(tree), (node) => {
    if (node.label.toLowerCase().indexOf(filterStr.toLowerCase()) > -1) {
      return true;
    }
    if (node?.children?.length > 0) {
      // eslint-disable-next-line no-param-reassign
      node.children = filterTreeData(node.children, filterStr);

      return node.children.length > 0;
    }
    return false;
  });
  return res;
}

export {
  findTopNode,
  getTransferListOption,
  getDataValues,
  getTransferData,
  cloneTreeWithFilter,
  filterTransferData,
  getLeafCount,
  filterTreeData,
};
