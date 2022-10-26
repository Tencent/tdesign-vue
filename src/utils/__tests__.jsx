import { mount } from '@vue/test-utils';
// import Button from '@/src/button/index.ts';
import { emitEvent } from '@/src/utils/event';

const Component = {
  props: {
    onClick: Function,
    onValueChange: Function,
  },
  render() {
    return <div>test</div>;
  },
};

describe('utils/event', () => {
  describe('emitEvent', () => {
    it('Emit event ', async () => {
      const onClick = vi.fn();
      const onValueChange = vi.fn();

      const wrapper = mount(Component, {
        listeners: {
          click: onClick,
          'value-change': onValueChange,
        },
      });
      emitEvent(wrapper.vm, 'click');
      emitEvent(wrapper.vm, 'value-change');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().click).toBeTruthy();
      expect(wrapper.emitted()['value-change']).toBeTruthy();
    });

    it('Call event function ', async () => {
      const handleValueChange = vi.fn();
      const handleClick = vi.fn();

      const wrapper = mount(Component, {
        propsData: {
          onValueChange: handleValueChange,
          onClick: handleClick,
        },
      });
      emitEvent(wrapper.vm, 'click');
      emitEvent(wrapper.vm, 'value-change');
      await wrapper.vm.$nextTick();
      expect(handleClick).toHaveBeenCalled();
      expect(handleValueChange).toHaveBeenCalled();
    });
  });
});
