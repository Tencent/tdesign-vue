import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach } from 'vitest';
import { Select, OptionGroup, Option } from '@/src/select/index.ts';
import { Popup } from '@/src/popup/index.ts';
import { Tag } from '@/src/tag/index.ts';
import { Button } from '@/src/button/index.ts';

describe('Select', () => {
  beforeEach(() => {
    // 清理测试数据
    document.body.innerHTML = '';
  });

  // test props api
  describe(':props', () => {
    it(':disabled', () => {
      const wrapper = mount({
        render() {
          return <Select disabled={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':size', () => {
      const wrapper = mount({
        render() {
          return <Select size="large"></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':clearable', () => {
      const wrapper = mount({
        render() {
          return <Select clearable={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':multiple', () => {
      const wrapper = mount({
        render() {
          return <Select multiple={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':placeholder', () => {
      const wrapper = mount({
        render() {
          return <Select placeholder="please select"></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':creatable', () => {
      const wrapper = mount({
        render() {
          return <Select creatable={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':remote', () => {
      const wrapper = mount({
        render() {
          return <Select remote={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':loading', () => {
      const wrapper = mount({
        render() {
          return <Select loading={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':labelInValue', () => {
      const wrapper = mount({
        render() {
          return <Select labelInValue={false}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':reserveKeyword', () => {
      const wrapper = mount({
        render() {
          return <Select reserveKeyword={false}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it(':bordered', () => {
      const wrapper = mount({
        render() {
          return <Select bordered={true}></Select>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it(':collapsedItems ', async () => {
      const currentOptions = [
        { label: '架构云', value: '1' },
        { label: '大数据', value: '2' },
        { label: '区块链', value: '3' },
      ];

      const wrapper = mount({
        data() {
          return {
            visible: false,
          };
        },
        render(h) {
          return h(Select, {
            props: {
              options: currentOptions,
              value: ['1', '2'],
              minCollapsedNum: 1,
              multiple: true,
            },
            scopedSlots: {
              collapsedItems: (props) => {
                if (!(props.collapsedSelectedItems instanceof Array)) return null;
                const count = props.collapsedSelectedItems.length;
                if (count <= 0) return null;
                return h(Popup, { props: { visible: this.visible } }, [
                  h(
                    'template',
                    { slot: 'content' },
                    props.collapsedSelectedItems.map((item, index) => h(
                      Button,
                      {
                        key: item.value,
                        style: { marginRight: '4px' },
                        on: {
                          close: (context) => props.onClose({ e: context.e, index: 1 + index }),
                        },
                      },
                      item.label,
                    )),
                  ),
                  h(Tag, {}, `Function - More(${count})`),
                ]);
              },
            },
          });
        },
      });

      await wrapper.vm.$nextTick();
      const tags = wrapper.findAll('.t-tag');

      // 默认
      expect(tags.length).toBe(2);
      const tag0 = tags.at(0);
      const tag1 = tags.at(1);

      expect(tag0.text()).toBe('架构云');
      expect(tag1.text()).toBe('Function - More(1)');

      // collapsedItems popup 展示
      wrapper.setData({ visible: true });
      await wrapper.vm.$nextTick();
      const buttons = document.querySelectorAll('.t-button');
      expect(buttons.length).toBe(1);
      expect(buttons[0].textContent).toBe('大数据');
    });

    it(':collapsedItems click', async () => {
      // TODO: 选择数据 验证 collapsedItems 的变化
    });
  });

  describe('Select Option', () => {
    // test props api
    describe(':props', () => {
      it(':value', () => {
        const value = '1';
        const wrapper = mount({
          render() {
            return (
              <Select v-model={value}>
                <Option value={'1'} label={'1'}></Option>
              </Select>
            );
          },
        });
        expect(wrapper.element).toMatchSnapshot();
      });
      it(':label', () => {
        const value = '1';
        const wrapper = mount({
          render() {
            return (
              <Select v-model={value}>
                <Option value={'1'} label={'1'}></Option>
              </Select>
            );
          },
        });
        expect(wrapper.element).toMatchSnapshot();
      });
      it(':disabled', () => {
        const value = '1';
        const wrapper = mount({
          render() {
            return (
              <Select v-model={value}>
                <Option value={'1'} label={'1'} disabled={true}></Option>
              </Select>
            );
          },
        });
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });

  describe('Select OptionGroup', () => {
    // test props api
    describe(':props', () => {
      it(':value', () => {
        const value = '1';
        const wrapper = mount({
          render() {
            return (
              <Select v-model={value}>
                <OptionGroup label={'num'}>
                  <Option value={'1'} label={'1'}></Option>
                </OptionGroup>
                <OptionGroup label={'abc'}>
                  <Option value={'a'} label={'a'}></Option>
                </OptionGroup>
              </Select>
            );
          },
        });
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });
});
