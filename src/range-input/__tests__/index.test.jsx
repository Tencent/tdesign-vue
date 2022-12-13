import { mount } from '@vue/test-utils';
import { ChevronRight } from 'tdesign-icons-vue';
import RangeInput from '@/src/range-input/index.ts';

describe('Input', () => {
  describe(':props', () => {
    const value = ['first value', 'second value'];
    it(':value', () => {
      const wrapper = mount({
        render() {
          return <RangeInput value={value} />;
        },
      });
      const inputElemWrappers = wrapper.findAll('input');
      expect(inputElemWrappers.at(0).element.value).toEqual(value[0]);
      expect(inputElemWrappers.at(1).element.value).toEqual(value[1]);
    });

    it(':activeIndex', async () => {
      const wrapper = mount({
        render() {
          return <RangeInput activeIndex={1} />;
        },
      });
      const inputElemWrappers = wrapper.findAll('.t-input');
      expect(inputElemWrappers.at(1).classes()).toContain('t-is-focused');
    });

    it('inputProps', () => {
      const wrapper = mount(RangeInput, {
        propsData: {
          inputProps: { inputClass: 'test-inputClass' },
        },
      });
      expect(wrapper.find('.t-input').classes()).toContain('test-inputClass');
    });

    it('separator', () => {
      const wrapper = mount({
        render() {
          return <RangeInput separator={() => <ChevronRight />} />;
        },
      });
      expect(wrapper.find('.t-icon-chevron-right')).not.toBe(null);
    });
  });

  describe('@event', () => {
    it('@change', () => {
      const fn = vi.fn();
      const wrapper = mount({
        render() {
          return <RangeInput onChange={fn} />;
        },
      });
      const rangeInputWrapper = wrapper.findComponent(RangeInput);
      const inputElemWrapper = wrapper.find('input');
      inputElemWrapper.setValue('text');
      expect(rangeInputWrapper.emitted().change).toBeTruthy();
      expect(fn).toBeCalled();
    });
  });
});
