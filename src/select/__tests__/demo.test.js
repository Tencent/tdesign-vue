/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/select/_example/base.vue';
import collapsedVue from '@/src/select/_example/collapsed.vue';
import creatableVue from '@/src/select/_example/creatable.vue';
import customOptionsVue from '@/src/select/_example/custom-options.vue';
import customSelectedVue from '@/src/select/_example/custom-selected.vue';
import disabledVue from '@/src/select/_example/disabled.vue';
import filterableVue from '@/src/select/_example/filterable.vue';
import groupVue from '@/src/select/_example/group.vue';
import labelInValueVue from '@/src/select/_example/label-in-value.vue';
import maxVue from '@/src/select/_example/max.vue';
import multipleVue from '@/src/select/_example/multiple.vue';
import noborderVue from '@/src/select/_example/noborder.vue';
import panelVue from '@/src/select/_example/panel.vue';
import popupPropsVue from '@/src/select/_example/popup-props.vue';
import prefixVue from '@/src/select/_example/prefix.vue';
import remoteSearchVue from '@/src/select/_example/remote-search.vue';
import sizeVue from '@/src/select/_example/size.vue';
import statusVue from '@/src/select/_example/status.vue';
import virtualScrollVue from '@/src/select/_example/virtual-scroll.vue';

const mapper = {
  baseVue,
  collapsedVue,
  creatableVue,
  customOptionsVue,
  customSelectedVue,
  disabledVue,
  filterableVue,
  groupVue,
  labelInValueVue,
  maxVue,
  multipleVue,
  noborderVue,
  panelVue,
  popupPropsVue,
  prefixVue,
  remoteSearchVue,
  sizeVue,
  statusVue,
  virtualScrollVue,
};

describe('Select', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Select ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
