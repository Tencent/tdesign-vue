import { treeNodesEffect } from '@/src/cascader/core/effect';

// 单选 + filterable + trigger=hover：过滤之后 hover 应该能展开子级（issue #3749）
// 过滤结果里必须保留父节点，否则 hover 时没有可展开的节点
describe('Cascader filter keeps parent nodes', () => {
  const makeNode = (value, isLeaf, label, parents = []) => ({
    value,
    isLeaf: () => isLeaf,
    getModel: () => ({ value, label }),
    getPath: () => [{ value, label }],
    getParents: () => parents,
  });

  it('keeps a parent node whose child matches the keyword', () => {
    const parent = makeNode('1', false, '上海');
    const child = makeNode('1.1', true, '黄浦区', [parent]);
    const other = makeNode('2', false, '深圳');

    const treeStore = {
      nodes: [parent, child, other],
      getNodes: () => [parent, child, other],
    };
    const setTreeNodes = vi.fn();

    treeNodesEffect('黄浦', treeStore, setTreeNodes, undefined, false);

    const result = setTreeNodes.mock.calls[0][0];
    console.log('FILTERED:', JSON.stringify(result.map((n) => n.value)));
    // 子级命中，父级必须一起保留，否则 hover 无法展开
    expect(result.map((n) => n.value)).toContain('1.1');
    expect(result.map((n) => n.value)).toContain('1');
  });
});
