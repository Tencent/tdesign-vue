/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import alignVue from '@/src/form/_example/align.vue';
import baseVue from '@/src/form/_example/base.vue';
import clearValidateVue from '@/src/form/_example/clear-validate.vue';
import customValidatorVue from '@/src/form/_example/custom-validator.vue';
import disabledVue from '@/src/form/_example/disabled.vue';
import errorMessageVue from '@/src/form/_example/error-message.vue';
import layoutVue from '@/src/form/_example/layout.vue';
import loginVue from '@/src/form/_example/login.vue';
import resetVue from '@/src/form/_example/reset.vue';
import sizeVue from '@/src/form/_example/size.vue';
import validateComplicatedDataVue from '@/src/form/_example/validate-complicated-data.vue';
import validateMessageVue from '@/src/form/_example/validate-message.vue';
import validatorStatusVue from '@/src/form/_example/validator-status.vue';
import validatorVue from '@/src/form/_example/validator.vue';

MockDate.set('2020-12-28');

const mapper = {
  alignVue,
  baseVue,
  clearValidateVue,
  customValidatorVue,
  disabledVue,
  errorMessageVue,
  layoutVue,
  loginVue,
  resetVue,
  sizeVue,
  validateComplicatedDataVue,
  validateMessageVue,
  validatorStatusVue,
  validatorVue,
};

describe('Form', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Form ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
