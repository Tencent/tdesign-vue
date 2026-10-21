import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Cascader from '@/src/cascader/index.ts';

const h = new Vue().$createElement;

const options = [
  { value: 'a', label: 'A', children: [{ value: 2, label: 'A2' }] },
  { value: 'b', label: 'B', children: [{ value: 4, label: 'B2' }] },
];

describe('Cascader invalid multiple values', () => {
  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])('finishes loading with showAllLevels=%s and custom valueDisplay=%s', async (showAllLevels, customDisplay) => {
    const errorHandler = vi.fn();
    const previousErrorHandler = Vue.config.errorHandler;
    let wrapper;
    try {
      wrapper = mount(Cascader, {
        propsData: {
          value: ['missing', 2, 4],
          options: [],
          loading: true,
          multiple: true,
          showAllLevels,
        },
        scopedSlots: customDisplay
          ? { valueDisplay: ({ value }) => h('span', { class: 'custom-values' }, value.join(',')) }
          : {},
      });
      expect(wrapper.find('.t-loading').exists()).toBe(true);
      Vue.config.errorHandler = errorHandler;

      // Simulate an asynchronous response with a selected ID absent from the options.
      await wrapper.setProps({ options, loading: false });

      expect(errorHandler.mock.calls.map(([error]) => error.message)).toEqual([]);
      expect(wrapper.find('.t-loading').exists()).toBe(false);
      if (customDisplay) {
        expect(wrapper.find('.custom-values').text()).toBe('missing,2,4');
      } else {
        expect(wrapper.findAll('.t-tag').wrappers.map((tag) => tag.text())).toEqual(
          showAllLevels ? ['A/A2', 'B/B2'] : ['A2', 'B2'],
        );
      }
      expect(wrapper.props('value')).toEqual(['missing', 2, 4]);

      // The same guard must apply when every selected ID becomes invalid.
      await wrapper.setProps({ value: ['missing', 1, 3] });
      expect(errorHandler.mock.calls.map(([error]) => error.message)).toEqual([]);
      expect(wrapper.find('.t-loading').exists()).toBe(false);
      if (customDisplay) {
        expect(wrapper.find('.custom-values').text()).toBe('missing,1,3');
      } else {
        expect(wrapper.findAll('.t-tag').length).toBe(0);
      }
    } finally {
      if (wrapper) wrapper.destroy();
      Vue.config.errorHandler = previousErrorHandler;
    }
  });
});
