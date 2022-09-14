import { mount } from '@vue/test-utils';
import Jumper from '@/src/jumper/index.ts';

describe('Jumper', () => {
  describe(':props', () => {
    it(':disabled', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          disabled: true,
        },
      });
      expect(wrapper.findAll('button[disabled="disabled"]')).toHaveLength(3);

      await wrapper.setProps({
        disabled: {
          prev: true,
          current: false,
          next: false,
        },
      });
      expect(wrapper.findAll('button[disabled="disabled"]')).toHaveLength(1);
    });

    it(':layout', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          layout: 'horizontal',
        },
      });
      expect(wrapper.findAll('.t-icon-chevron-right')).toHaveLength(1);
      expect(wrapper.findAll('.t-icon-chevron-up')).toHaveLength(0);

      await wrapper.setProps({
        layout: 'vertical',
      });
      expect(wrapper.findAll('.t-icon-chevron-right')).toHaveLength(0);
      expect(wrapper.findAll('.t-icon-chevron-up')).toHaveLength(1);
    });

    it(':showCurrent', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          showCurrent: false,
        },
      });
      expect(wrapper.find('.t-jumper__current').exists()).toEqual(false);
      await wrapper.setProps({
        showCurrent: true,
      });
      expect(wrapper.find('.t-jumper__current').exists()).toEqual(true);
    });

    it(':size', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          size: 'small',
        },
      });
      expect(wrapper.findAll('.t-size-s')).toHaveLength(3);
      expect(wrapper.findAll('.t-size-m')).toHaveLength(0);
      await wrapper.setProps({
        size: 'medium',
      });
      expect(wrapper.findAll('.t-size-s')).toHaveLength(0);
      expect(wrapper.findAll('.t-size-m')).toHaveLength(3);
    });

    it(':tips', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          tips: true,
        },
      });
      expect(wrapper.find('button').attributes('title')).toEqual('上一页');
      await wrapper.setProps({
        tips: {
          prev: 'prev',
          current: 'current',
          next: 'next',
        },
      });
      expect(wrapper.find('button').attributes('title')).toEqual('prev');
    });

    it(':variant', async () => {
      const wrapper = mount(Jumper, {
        propsData: {
          variant: 'outline',
        },
      });
      expect(wrapper.classes()).toContain('t-jumper--outline');
      expect(wrapper.find('button').classes()).toContain('t-button--variant-outline');
      await wrapper.setProps({
        variant: 'text',
      });
      expect(wrapper.classes()).not.toContain('t-jumper--outline');
      expect(wrapper.find('button').classes()).not.toContain('t-button--variant-outline');
    });
  });

  describe('@event', () => {
    it('@change', () => {
      const onChange = jest.fn();
      const wrapper = mount(Jumper, {
        propsData: {
          onChange,
        },
      });
      const prevBtn = wrapper.find('.t-jumper__prev');
      prevBtn.trigger('click');

      expect(wrapper.emitted().change.length).toEqual(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        e: expect.any(Object),
        trigger: 'prev',
      });

      const currentBtn = wrapper.find('.t-jumper__current');
      currentBtn.trigger('click');
      expect(wrapper.emitted().change.length).toEqual(2);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith({
        e: expect.any(Object),
        trigger: 'current',
      });

      const nextBtn = wrapper.find('.t-jumper__next');
      nextBtn.trigger('click');
      expect(wrapper.emitted().change.length).toEqual(3);
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith({
        e: expect.any(Object),
        trigger: 'next',
      });
    });
  });
});
