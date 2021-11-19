import { mount } from '@vue/test-utils';
import base from '@/examples/popup/demos/base.vue';
import container from '@/examples/popup/demos/container.vue';
import destroy from '@/examples/popup/demos/destroy.vue';
import disabled from '@/examples/popup/demos/disabled.vue';
import placement from '@/examples/popup/demos/placement.vue';
import style from '@/examples/popup/demos/style.vue';
import triggerElement from '@/examples/popup/demos/trigger-element.vue';
import trigger from '@/examples/popup/demos/trigger.vue';
import visible from '@/examples/popup/demos/visible.vue';

const mapper = {
  base,
  container,
  destroy,
  disabled,
  placement,
  style,
  triggerElement,
  trigger,
  visible,
};

describe('Progress', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
