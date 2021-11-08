import { mount } from '@vue/test-utils';
import Tree from '@/src/tree/index.ts';
import { delay } from './kit';

describe('Tree:lazy-load', () => {
  jest.useRealTimers();
  describe('props.load', () => {
    it('可以定义 load 方法延迟加载数据', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }, {
                value: `${node.value}.2`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        render() {
          return (
            <Tree
              data={this.data}
              expandAll
              load={this.load}
              lazy={false}
              transition={false}
            ></Tree>
          );
        },
      });
      await delay(200);
      expect(
        wrapper
          .find('[data-value="t1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1.1.1"]')
          .exists(),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.2.2"]')
          .exists(),
      ).toBe(true);
    });

    it('延迟加载的节点，也能响应预设的 value', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
            value: ['t1.1.1'],
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }, {
                value: `${node.value}.2`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        render() {
          return (
            <Tree
              data={this.data}
              value={this.value}
              load={this.load}
              expandAll
              checkable
              lazy={false}
              transition={false}
            ></Tree>
          );
        },
      });
      await delay(200);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-indeterminate'),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-indeterminate'),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(true);
    });

    it('checkStrictly 为 true 时，延迟加载的节点状态不影响上游节点', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
            value: ['t1.1.1'],
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }, {
                value: `${node.value}.2`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        render() {
          return (
            <Tree
              data={this.data}
              value={this.value}
              load={this.load}
              expandAll
              checkable
              checkStrictly
              lazy={false}
              transition={false}
            ></Tree>
          );
        },
      });
      await delay(200);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-indeterminate'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-indeterminate'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(false);
      expect(
        wrapper
          .find('[data-value="t1.1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(true);
    });
  });

  describe('props.lazy', () => {
    it('lazy 属性为 true 时，点击展开节点时加载数据', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }, {
                value: `${node.value}.2`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        render() {
          return (
            <Tree
              data={this.data}
              expandAll
              load={this.load}
              lazy={true}
              transition={false}
            ></Tree>
          );
        },
      });

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1.1"]')
          .exists(),
      ).toBe(false);
      wrapper
        .find('[data-value="t1"] .t-tree__icon')
        .trigger('click');

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1.1"]')
          .exists(),
      ).toBe(false);
      wrapper
        .find('[data-value="t1.1"] .t-tree__icon')
        .trigger('click');

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1.1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1.2"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.2.1"]')
          .exists(),
      ).toBe(false);
    });

    it('延迟加载的可选节点，默认继承父节点选中态', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        mounted() {
          const { tree } = this.$refs;
          tree.setItem('t1', {
            checked: true,
          });
        },
        render() {
          return (
            <Tree
              ref="tree"
              data={this.data}
              load={this.load}
              lazy={true}
              checkable={true}
              transition={false}
              valueMode={'all'}
            ></Tree>
          );
        },
      });

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(true);
      wrapper
        .find('[data-value="t1"] .t-tree__icon')
        .trigger('click');

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(true);
    });

    it('checkStrictly 为 true 时，延迟加载的节点不继承父节点选中态', async () => {
      const data = [{
        value: 't1',
        children: true,
      }];
      const wrapper = mount({
        data() {
          return {
            data,
          };
        },
        methods: {
          async load(node) {
            await delay(10);
            let nodes = [];
            if (node.level < 2) {
              nodes = [{
                value: `${node.value}.1`,
                children: true,
              }];
            }
            return nodes;
          },
        },
        mounted() {
          const { tree } = this.$refs;
          tree.setItem('t1', {
            checked: true,
          });
        },
        render() {
          return (
            <Tree
              ref="tree"
              data={this.data}
              load={this.load}
              lazy={true}
              checkable={true}
              checkStrictly={true}
              transition={false}
              valueMode={'all'}
            ></Tree>
          );
        },
      });

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(true);
      wrapper
        .find('[data-value="t1"] .t-tree__icon')
        .trigger('click');

      await delay(50);
      expect(
        wrapper
          .find('[data-value="t1.1"]')
          .exists(),
      ).toBe(true);
      expect(
        wrapper
          .find('[data-value="t1.1"] .t-checkbox')
          .classes('t-is-checked'),
      ).toBe(false);
    });
  });
});
