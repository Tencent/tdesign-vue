import { TreeKeysType } from '../tree';
import { TreeOptionData } from '../common';

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
      const index = values.findIndex((val) => item[keys.value] === val);
      if (index !== -1) {
        // results.push(item);
        results.set(values[index], item);
      }
      if (item.children?.length) {
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
        results.set(value, { [keys.label]: value, [keys.value]: value });
      }
    });
  }

  return values.map((value) => results.get(value));
}

export default {};
