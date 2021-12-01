import { mount } from '@vue/test-utils';
import extra from '@/examples/steps/demos/extra.vue';
import icon from '@/examples/steps/demos/icon.vue';
import NoSequence from '@/examples/steps/demos/no-sequence.vue';
import options from '@/examples/steps/demos/options.vue';
import sequence from '@/examples/steps/demos/sequence.vue';
import status from '@/examples/steps/demos/status.vue';
import VerticalNoSequence from '@/examples/steps/demos/vertical-no-sequence.vue';
import VerticalSequence from '@/examples/steps/demos/vertical-sequence.vue';

const mapper = {
  extra,
  icon,
  NoSequence,
  options,
  sequence,
  status,
  VerticalNoSequence,
  VerticalSequence,
};

describe('Steps', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Steps ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
