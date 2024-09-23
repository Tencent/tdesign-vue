import { mount } from '@vue/test-utils';
import { HeartFilledIcon } from 'tdesign-icons-vue';
import Rate from '@/src/rate/index.ts';

describe('Rate', () => {
  // test props api
  describe(':props', () => {
    it('', () => {
      const wrapper = mount({
        render() {
          return <Rate></Rate>;
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
    it('custom count', () => {
      const wrapper = mount({
        render() {
          return <Rate count={7} />;
        },
      });
      expect(wrapper.findAll('.t-rate__item').length).toBe(7);
    });
    it('half', () => {
      const wrapper = mount({
        render() {
          return <Rate direction="vertical" value={4.5} allowHalf />;
        },
      });

      expect(wrapper.find('.t-rate__item--half').exists()).toBeTruthy();
    });
    it('clear', async () => {
      const wrapper = mount({
        data() {
          return {
            value: 4,
          };
        },
        render() {
          return <Rate direction="vertical" value={this.value} onChange={(v) => (this.value = v)} allowClear />;
        },
      });

      const items = wrapper.findAll('.t-rate__item--full');
      expect(items.length).toBe(4);

      items.at(3).trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.value).toBe(undefined);
    });
    it('custom icon', () => {
      const wrapper = mount({
        render() {
          return <Rate value={4} icon={() => <HeartFilledIcon />} />;
        },
      });

      expect(wrapper.findComponent(HeartFilledIcon).exists()).toBeTruthy();
    });
  });
});
