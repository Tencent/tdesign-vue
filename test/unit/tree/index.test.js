import { mount } from '@vue/test-utils';
import Tree from '@/src/tree/index.ts';

/**
 * tree 针对性测试命令
 * ```bash
 * # 执行单测
 * npx jest --config script/test/jest.unit.conf.js --coverage ./test/unit/tree
 * # 更新单测快照
 * npx jest --config script/test/jest.unit.conf.js --updateSnapshot ./test/unit/tree
 * ```
 */

describe('Tree:init', () => {
  describe(':props.data', () => {
    it('`data` is undefined', () => {
      const wrapper = mount({
        render() {
          return (
            <Tree data={null}>
              <div slot="empty" id="tree-empty">
                暂无数据
              </div>
            </Tree>
          );
        },
      });
      expect(wrapper.find('#tree-empty').exists()).toBe(true);
    });

    it('`data` get tree data', () => {
      const data = [
        {
          value: 't1',
          children: [{
            value: 't1.1',
          }],
        },
        {
          value: 't2',
        },
      ];
      const wrapper = mount({
        render() {
          return (
            <Tree data={data}>
              <div slot="empty" id="tree-empty">
                暂无数据
              </div>
            </Tree>
          );
        },
      });
      expect(wrapper.find('#tree-empty').exists()).toBe(false);
      expect(wrapper.find('[data-value="t1"]').exists()).toBe(true);
      expect(wrapper.find('[data-value="t1.1"]').exists()).toBe(false);
      expect(wrapper.find('[data-value="t2"]').exists()).toBe(true);
    });
  });
});
