import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { Collapse, CollapsePanel } from '../index';

describe('Collapse', () => {
  describe(':props', () => {
    test(':borderless', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { borderless: false };
          },
          template: `
            <t-collapse :borderless="borderless">
                <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
            </t-collapse>
        `,
        }),
      );

      expect(wrapper.classes()).not.toContain('t--border-less');

      await wrapper.setData({ borderless: true });
      expect(wrapper.classes()).toContain('t--border-less');
    });

    test(':defaultExpandAll', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          template: `
            <t-collapse :default-expand-all="true">
                <t-collapse-panel ref="1" value="1" header="标题1" default="内容1" />
                <t-collapse-panel ref="2" value="2" header="标题2" default="内容2" />
            </t-collapse>
        `,
        }),
      );

      const panel1 = wrapper.findComponent({ ref: '1' });
      const panel2 = wrapper.findComponent({ ref: '2' });

      expect(panel1.find('.t-collapse-panel__body').attributes().style).toBeUndefined();
      expect(panel2.find('.t-collapse-panel__body').attributes().style).toBeUndefined();
    });

    test(':disabled', async () => {
      const mockFn = jest.fn();
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { disabled: false };
          },
          methods: {
            handleChange: mockFn,
          },
          template: `
            <t-collapse :disabled="disabled" @change="handleChange">
                <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
            </t-collapse>
        `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');

      expect(mockFn).toHaveBeenCalled();

      await wrapper.setData({ disabled: true });
      await panel.find('.t-collapse-panel__header').trigger('click');

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test(':expandIcon', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { expandIcon: true };
          },
          template: `
            <t-collapse :expand-icon="expandIcon">
                <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
            </t-collapse>
        `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      expect(panel.find('.t-collapse-panel__header svg').exists()).toBeTruthy();

      await wrapper.setData({ expandIcon: false });
      expect(panel.find('.t-collapse-panel__header svg').exists()).toBeFalsy();
    });

    test(':expandIconPlacement', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { expandIconPlacement: 'left' };
          },
          template: `
            <t-collapse :expand-icon-placement="expandIconPlacement">
                <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
            </t-collapse>
        `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      expect(panel.find('.t-collapse-panel__header svg').classes()).toContain('t-collapse-panel__icon--left');

      await wrapper.setData({ expandIconPlacement: 'right' });
      expect(panel.find('.t-collapse-panel__header svg').classes()).toContain('t-collapse-panel__icon--right');
    });

    test(':expandMutex', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { value: [] };
          },
          template: `
            <t-collapse expand-mutex v-model="value">
                <t-collapse-panel ref="1" value="1" header="标题1" default="内容1" />
                <t-collapse-panel ref="2" value="2" header="标题2" default="内容2" />
            </t-collapse>
        `,
        }),
      );

      const panel1 = wrapper.findComponent({ ref: '1' });
      const panel2 = wrapper.findComponent({ ref: '2' });
      await panel1.find('.t-collapse-panel__header').trigger('click');

      expect(wrapper.vm.value).toHaveLength(1);
      expect(wrapper.vm.value).toContain('1');

      await panel2.find('.t-collapse-panel__header').trigger('click');

      expect(wrapper.vm.value).toHaveLength(1);
      expect(wrapper.vm.value).toContain('2');
    });

    test(':expandOnRowClick', async () => {
      const mockFn = jest.fn();
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { expandOnRowClick: true };
          },
          methods: {
            handleChange: mockFn,
          },
          template: `
            <t-collapse :expand-on-row-click="expandOnRowClick" @change="handleChange">
                <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
            </t-collapse>
        `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(mockFn).toHaveBeenCalled();

      await wrapper.setData({ expandOnRowClick: false });

      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(mockFn).toHaveBeenCalledTimes(1);

      await panel.find('.t-collapse-panel__header svg').trigger('click');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test(':defaultValue', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          template: `
                <t-collapse :default-value="['1']">
                    <t-collapse-panel ref="1" value="1" header="标题1" default="内容1" />
                    <t-collapse-panel ref="2" value="2" header="标题2" default="内容2" />
                </t-collapse>
            `,
        }),
      );

      const panel1 = wrapper.findComponent({ ref: '1' });
      const panel2 = wrapper.findComponent({ ref: '2' });

      expect(panel1.find('.t-collapse-panel__body').attributes().style).toBeUndefined();
      expect(panel2.find('.t-collapse-panel__body').attributes().style).toBe('display: none;');
    });
  });

  describe('@event', () => {
    test('change', async () => {
      const mockFn = jest.fn();
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          methods: {
            handleChange: mockFn,
          },
          template: `
                <t-collapse @change="handleChange">
                    <t-collapse-panel ref="1" value="1" header="标题" default="内容" />
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(mockFn).toHaveBeenCalled();
    });
  });
});

describe('CollapsePanel', () => {
  describe(':props', () => {
    test(':default、content、header、headerRightContent', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          template: `
                <t-collapse default-expand-all>
                    <t-collapse-panel ref="1" value="1" header="标题" header-right-content="右侧" default="内容1" />
                    <t-collapse-panel ref="2" value="2" header="标题" default="内容2" />
                </t-collapse>
            `,
        }),
      );

      const panel1 = wrapper.findComponent({ ref: '1' });
      const panel2 = wrapper.findComponent({ ref: '2' });
      expect(panel1.find('.t-collapse-panel__content').text()).toBe('内容1');
      expect(panel1.find('.t-collapse-panel__header').text()).toBe('标题右侧');
      expect(panel2.find('.t-collapse-panel__content').text()).toBe('内容2');
    });

    test(':destroyOnCollapse', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return {
              destroyOnCollapse: false,
            };
          },
          template: `
                <t-collapse default-expand-all>
                    <t-collapse-panel ref="1" value="1" header="标题" default="内容1" :destroy-on-collapse="destroyOnCollapse" />
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(panel.find('.t-collapse-panel__content').exists()).toBeTruthy();

      await wrapper.setData({ destroyOnCollapse: true });
      await panel.find('.t-collapse-panel__header').trigger('click');
      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(panel.find('.t-collapse-panel__content').exists()).toBeFalsy();
    });

    test(':disabled', async () => {
      const mockFn = jest.fn();
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { disabled: false };
          },
          methods: {
            handleChange: mockFn,
          },
          template: `
              <t-collapse @change="handleChange">
                  <t-collapse-panel ref="1" value="1" header="标题" default="内容" :disabled="disabled" />
              </t-collapse>
          `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');

      expect(mockFn).toHaveBeenCalled();

      await wrapper.setData({ disabled: true });
      await panel.find('.t-collapse-panel__header').trigger('click');

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test(':expandIcon', async () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          data() {
            return { expandIcon: true };
          },
          template: `
                <t-collapse>
                    <t-collapse-panel ref="1" value="1" header="标题" default="内容" :expand-icon="expandIcon" />
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      expect(panel.find('.t-collapse-panel__header svg').exists()).toBeTruthy();

      await wrapper.setData({ expandIcon: false });
      expect(panel.find('.t-collapse-panel__header svg').exists()).toBeFalsy();
    });

    test(':value', async () => {
      const mockFn = jest.fn();
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          methods: {
            handleChange: mockFn,
          },
          template: `
                <t-collapse @change="handleChange">
                    <t-collapse-panel ref="1" value="abc" header="标题" default="内容" />
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      await panel.find('.t-collapse-panel__header').trigger('click');
      expect(mockFn).toHaveBeenCalledWith(['abc']);
    });
  });

  describe('<slot>', () => {
    test('default、header、headerRightContent', () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          template: `
                <t-collapse>
                    <t-collapse-panel ref="1" value="1">
                        <h4 slot="header">标题</h4>
                        <span slot="headerRightContent">操作</span>
                        <div>内容</div>
                    </t-collapse-panel>
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      expect(panel.find('.t-collapse-panel__content > div').html()).toBe('<div>内容</div>');
      expect(panel.find('.t-collapse-panel__header-content > h4').html()).toBe('<h4>标题</h4>');
      expect(panel.find('.t-collapse-panel__header-right > span').html()).toBe('<span>操作</span>');
    });

    test('content', () => {
      const wrapper = mount(
        Vue.extend({
          components: {
            't-collapse': Collapse,
            't-collapse-panel': CollapsePanel,
          },
          template: `
                <t-collapse>
                    <t-collapse-panel ref="1" value="1" header="标题">
                        <div slot="content">内容</div>
                    </t-collapse-panel>
                </t-collapse>
            `,
        }),
      );

      const panel = wrapper.findComponent({ ref: '1' });
      expect(panel.find('.t-collapse-panel__content > div').html()).toBe('<div>内容</div>');
    });
  });
});
