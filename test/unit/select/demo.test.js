import { mount } from '@vue/test-utils';
import base from '@/examples/select/demos/base.vue';
import collapsed from '@/examples/select/demos/collapsed.vue';
import creatable from '@/examples/select/demos/creatable.vue';
import customOptions from '@/examples/select/demos/custom-options.vue';
import customSelected from '@/examples/select/demos/custom-selected.vue';
import disabled from '@/examples/select/demos/disabled.vue';
import filterable from '@/examples/select/demos/filterable.vue';
import group from '@/examples/select/demos/group.vue';
import labelInValue from '@/examples/select/demos/label-in-value.vue';
import max from '@/examples/select/demos/max.vue';
import multiple from '@/examples/select/demos/multiple.vue';
import noborder from '@/examples/select/demos/noborder.vue';
import popupProps from '@/examples/select/demos/popup-props.vue';
import prefix from '@/examples/select/demos/prefix.vue';
import remoteSearch from '@/examples/select/demos/remote-search.vue';
import size from '@/examples/select/demos/size.vue';
import status from '@/examples/select/demos/status.vue';

const mapper = {
  base,
  collapsed,
  creatable,
  customOptions,
  customSelected,
  filterable,
  disabled,
  group,
  labelInValue,
  max,
  multiple,
  noborder,
  popupProps,
  prefix,
  remoteSearch,
  size,
  status,
};

describe('Steps', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Steps ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
