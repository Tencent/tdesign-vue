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

describe('Tree', () => {
  describe(':props', () => {
    describe(':prop.data', () => {
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

    describe(':prop.expandAll', () => {
      it('expandAll is true', () => {
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
              <Tree data={data} expandAll></Tree>
            );
          },
        });
        expect(wrapper.find('[data-value="t1.1"]').exists()).toBe(true);
      });
    });

    describe(':prop.onActive', () => {
      it('onActive get callback', (done) => {
        const data = [
          { value: 't1' },
          { value: 't2' },
        ];
        const onActive = (actived, context) => {
          expect(actived.length).toBe(1);
          expect(actived[0]).toBe('t2');
          expect(context.node.value).toBe('t2');
          done();
        };
        mount({
          mounted() {
            this.$refs.tree.setItem('t2', {
              actived: true,
            });
          },
          render() {
            return (
              <Tree
                ref="tree"
                data={data}
                activable
                onActive={onActive}
              ></Tree>
            );
          },
        });
      }, 10);
    });

    describe(':prop.onExpand', () => {
      it('onExpand get callback', (done) => {
        const data = [{
          value: 't1',
          children: [{
            value: 't1.1',
          }],
        }, {
          value: 't2',
          children: [{
            value: 't2.1',
          }],
        },
        ];
        const onExpand = (expanded, context) => {
          expect(expanded.length).toBe(1);
          expect(expanded[0]).toBe('t2');
          expect(context.node.value).toBe('t2');
          done();
        };
        mount({
          mounted() {
            this.$refs.tree.setItem('t2', {
              expanded: true,
            });
          },
          render() {
            return (
              <Tree
                ref="tree"
                data={data}
                onExpand={onExpand}
              ></Tree>
            );
          },
        });
      }, 10);
    });

    describe(':prop.onChange', () => {
      it('onChange get callback', (done) => {
        const data = [{
          value: 't1',
          children: [{
            value: 't1.1',
          }],
        }, {
          value: 't2',
          children: [{
            value: 't2.1',
          }],
        }];
        const onChange = (checked, context) => {
          expect(checked.length).toBe(1);
          expect(checked[0]).toBe('t2.1');
          expect(context.node.value).toBe('t2');
          done();
        };
        mount({
          mounted() {
            this.$refs.tree.setItem('t2', {
              checked: true,
            });
          },
          render() {
            return (
              <Tree
                ref="tree"
                data={data}
                checkable
                onChange={onChange}
              ></Tree>
            );
          },
        });
      }, 10);
    });

    describe(':prop.onLoad', () => {
      it('onLoad get callback', (done) => {
        const data = [{
          lablel: '1',
          value: 't1',
          children: true,
        }];

        const onLoad = (context) => {
          expect(context.node.value).toBe('t1');
          done();
        };

        const loadData = node => new Promise((resolve) => {
          setTimeout(() => {
            let nodes = [];
            if (node.level < 1) {
              nodes = [{
                value: `${node.value}.1`,
                label: `${node.label}.1`,
                children: true,
              }];
            }
            resolve(nodes);
          }, 1);
        });

        mount({
          render() {
            return (
              <Tree
                ref="tree"
                data={data}
                expand-all
                lazy={false}
                load={loadData}
                onLoad={onLoad}
              ></Tree>
            );
          },
        });
      }, 10);
    });
  });
});
