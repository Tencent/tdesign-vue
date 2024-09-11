import { get as lodashGet, set as lodashSet } from 'lodash';
import { TreeOptionData, TreeKeysType } from '../common';

export function getNodeDataByValue(
  values: Array<string | number>,
  data: TreeOptionData[],
  keys: TreeKeysType,
): TreeOptionData[] {
  const getTreeNodeData = (
    values: Array<string | number>,
    data: TreeOptionData[],
    keys: TreeKeysType,
    results: Map<any, TreeOptionData> = new Map(),
  ) => {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const index = values.findIndex((val) => lodashGet(item, keys.value) === val);
      if (index !== -1) {
        // results.push(item);
        results.set(values[index], item);
      }
      if (Array.isArray(item.children) && item.children?.length) {
        getTreeNodeData(values, item.children, keys, results);
      }
      if (results.size >= values.length) {
        return results;
      }
    }
    return results;
  };

  const results = getTreeNodeData(values, data, keys);

  // some value can not find in data (data might be empty)
  if (values.length && results.size < values.length) {
    values.forEach((value) => {
      if (!results.get(value)) {
        const obj = {};
        lodashSet(obj, keys.label, value);
        lodashSet(obj, keys.value, value);
        results.set(value, obj);
      }
    });
  }

  return values.map((value) => results.get(value));
}

export default {};
