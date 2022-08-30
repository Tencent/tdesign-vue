/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import calendarVue from '@/src/config-provider/_example/calendar.vue';
import datePickerVue from '@/src/config-provider/_example/date-picker.vue';
import dialogVue from '@/src/config-provider/_example/dialog.vue';
import globalVue from '@/src/config-provider/_example/global.vue';
import inputVue from '@/src/config-provider/_example/input.vue';
import othersVue from '@/src/config-provider/_example/others.vue';
import paginationVue from '@/src/config-provider/_example/pagination.vue';
import popconfirmVue from '@/src/config-provider/_example/popconfirm.vue';
import tableVue from '@/src/config-provider/_example/table.vue';

MockDate.set('2020-12-28');

const mapper = {
  calendarVue,
  datePickerVue,
  dialogVue,
  globalVue,
  inputVue,
  othersVue,
  paginationVue,
  popconfirmVue,
  tableVue,
};

describe('ConfigProvider', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`ConfigProvider ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
