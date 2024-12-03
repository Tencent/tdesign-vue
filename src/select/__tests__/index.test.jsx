import { mount } from '@vue/test-utils';
import { Select, OptionGroup, Option } from '@/src/select/index.ts';
import { Popup } from '@/src/popup/index.ts';
import { Tag } from '@/src/tag/index.ts';
import { Button } from '@/src/button/index.ts';

describe('Select', () => {
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

    it(':collapsedItems', async () => {
      // const visible = ref(false);

      const disPlayCollapsedItems = (h, { collapsedSelectedItems, onClose }) => {
        console.log('collapsedSelectedItems', collapsedSelectedItems);
        if (!(collapsedSelectedItems instanceof Array)) return null;
        const count = collapsedSelectedItems.length;
        if (count <= 0) return null;
        return (
          <Popup visible={true}>
            {{
              content: () => collapsedSelectedItems.map((item, index) => (
                  <Button
                    key={item.value}
                    style={{ marginRight: '4px' }}
                    onClose={(context) => onClose({ e: context.e, index: 1 + index })}
                  >
                    {item.label}
                  </Button>
              )),
              default: () => <Tag>Function - More({count})</Tag>,
            }}
          </Popup>
        );
      };

      const currentOptions = [
        { label: '架构云', value: '1' },
        { label: '大数据', value: '2' },
        { label: '区块链', value: '3' },
      ];
      const wrapper = mount(
        {
          render() {
            return (
              <Select
                options={currentOptions}
                value={['1', '2']}
                minCollapsedNum={1}
                multiple
                scopedSlots={{ collapsedItems: disPlayCollapsedItems }}
              />
            );
          },
        },
        {
          attachTo: document.body,
        },
      );

      wrapper.vm.$nextTick();
      const tags = document.querySelectorAll('.t-tag');
      // 默认
      // expect(tags.length).toBe(2);
      expect(tags[0].textContent).toBe('架构云');
      // expect(tags[1].textContent).toBe('Function - More(1)');

      // collapsedItems popup 展示
      // 这里使用 triggerEvent 无法触发 mouseenter 事件展开 select popup
      // visible.value = true;
      // await wrapper.vm.$nextTick();
      // const buttons = document.querySelectorAll('.t-button');
      // expect(buttons.length).toBe(1);

      // 清理测试数据
      document.body.innerHTML = '';
    });

    // it(':collapsedItems click', async () => {
    //   const visible = ref(false);
    //   const minCollapsedNum = 1;

    //   const collapsedItems = (h, { collapsedSelectedItems, onClose }) => {
    //     if (!(collapsedSelectedItems instanceof Array)) return null;
    //     const count = collapsedSelectedItems.length;
    //     if (count <= 0) return null;
    //     return (
    //       <Popup
    //         visible={visible.value}
    //         v-slots={{
    //           content: () => (
    //             <>
    //               {collapsedSelectedItems.map((item, index) => (
    //                 <Button
    //                   key={item.value}
    //                   style={{ marginRight: '4px' }}
    //                   onClose={(context) => onClose({ e: context.e, index: minCollapsedNum + index })}
    //                 >
    //                   {item.label}
    //                 </Button>
    //               ))}
    //             </>
    //           ),
    //         }}
    //       >
    //         <Tag>Function - More({count})</Tag>,
    //       </Popup>
    //     );
    //   };

    //   const currentOptions = [
    //     { label: '架构云', value: '1' },
    //     { label: '大数据', value: '2' },
    //     { label: '区块链', value: '3' },
    //   ];
    //   let selectedOptions = [];
    //   const onChange = (_value, context) => {
    //     selectedOptions = context.selectedOptions;
    //   };

    //   const wrapper = mount(
    //     {
    //       render() {
    //         return (
    //           <Select
    //             class="multiple-select"
    //             options={currentOptions}
    //             popupProps={{ attach: 'multiple-select' }}
    //             minCollapsedNum={minCollapsedNum}
    //             multiple
    //             collapsedItems={collapsedItems}
    //             onChange={onChange}
    //           ></Select>
    //         );
    //       },
    //     },
    //     {
    //       attachTo: document.body,
    //     },
    //   );

    //   // 默认
    //   const tags = wrapper.findAll('.t-tag');
    //   expect(tags.length).toBe(0);

    //   //  第一次选择
    //   // 目前无法通过 triggerEvent 触发 mouseenter 事件展开 select popup
    //   await wrapper.setProps({ popupProps: { attach: 'multiple-select', visible: true } });
    //   await wrapper.vm.$nextTick();
    //   const groupNode1 = wrapper.findAll('.t-select-option');
    //   expect(groupNode1.length).toBe(3);

    //   await groupNode1[0].trigger('click');
    //   await wrapper.vm.$nextTick();
    //   const tags1 = wrapper.findAll('.t-tag');
    //   expect(tags1.length).toBe(1);
    //   expect(tags1[0].text()).toBe(currentOptions[0].label);

    //   //  第二次选择(选择options的第三个数据-区块链)
    //   await wrapper.setProps({ popupProps: { attach: 'multiple-select', visible: true } });
    //   await wrapper.vm.$nextTick();
    //   const groupNode2 = wrapper.findAll('.t-select-option');
    //   expect(groupNode2.length).toBe(3);

    //   await groupNode2[2].trigger('click');
    //   await wrapper.vm.$nextTick();
    //   const tags2 = wrapper.findAll('.t-tag');
    //   expect(tags2.length).toBe(2);
    //   expect(tags2[0].text()).toBe(currentOptions[0].label);
    //   expect(tags2[1].text()).toBe(`Function - More(${selectedOptions.length - minCollapsedNum})`);
    //   // 这里使用 triggerEvent 无法触发 mouseenter 事件展开 select popup
    //   visible.value = true;
    //   await wrapper.vm.$nextTick();
    //   const buttons1 = document.querySelectorAll('.t-button');
    //   expect(buttons1.length).toBe(1);
    //   expect(buttons1[0].textContent).toBe('区块链');

    //   //  第三次选择(选择options的第二个数据-大数据)
    //   await wrapper.setProps({ popupProps: { attach: 'multiple-select', visible: true } });
    //   await wrapper.vm.$nextTick();
    //   const groupNode3 = wrapper.findAll('.t-select-option');
    //   expect(groupNode3.length).toBe(3);

    //   await groupNode3[1].trigger('click');
    //   await wrapper.vm.$nextTick();
    //   const tags3 = wrapper.findAll('.t-tag');
    //   expect(tags3.length).toBe(2);
    //   expect(tags3[0].text()).toBe(currentOptions[0].label);
    //   expect(tags3[1].text()).toBe(`Function - More(${selectedOptions.length - minCollapsedNum})`);
    //   // 这里使用 triggerEvent 无法触发 mouseenter 事件展开 select popup
    //   visible.value = true;
    //   await wrapper.vm.$nextTick();
    //   const buttons2 = document.querySelectorAll('.t-button');
    //   expect(buttons2.length).toBe(2);
    //   expect(buttons2[0].textContent).toBe('区块链');
    //   expect(buttons2[1].textContent).toBe('大数据');

    //   // 清理测试数据
    //   document.body.innerHTML = '';
    // });
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
