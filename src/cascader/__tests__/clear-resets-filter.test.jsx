import { closeIconClickEffect } from '../core/effect';

// 点清空只重置了 visible/expend/value，没管 inputVal。
// 再打开面板时 treeNodesEffect 还是按上一次的搜索词过滤（issue #3695）。
describe('Cascader clear', () => {
  it('resets the search keyword as well', () => {
    const calls = [];
    const cascaderContext = {
      setVisible: (v) => calls.push(['visible', v]),
      setExpend: (v) => calls.push(['expend', v]),
      setValue: (v, t) => calls.push(['value', t]),
      setInputVal: (v) => calls.push(['inputVal', v]),
    };

    closeIconClickEffect(cascaderContext);

    // 搜索词必须一起清掉，否则再次打开面板还是上次的搜索结果
    expect(calls).toContainEqual(['inputVal', '']);
  });
});
