import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Input } from '../index';

// clearable 输入框在 hover 前后，DOM 结构应保持一致，
// 否则 inline 布局下宽度会抖动（issue #3884）
const flush = async () => {
  await nextTick();
  await nextTick();
};

describe('Input clearable width stability', () => {
  it('keeps the same suffix structure before and after hover', async () => {
    const wrapper = mount({
      data() {
        return { val: 'hello' };
      },
      render() {
        return <Input v-model={this.val} clearable />;
      },
    });
    await flush();

    const before = wrapper.element.outerHTML;
    const beforeSuffix = wrapper.findAll('.t-input__suffix-clear').length;
    const beforeHasSuffixClass = wrapper.element.className.includes('t-input--suffix');
    console.log('BEFORE-CLEAR-COUNT:', beforeSuffix);
    console.log('BEFORE-HAS-SUFFIX-CLASS:', beforeHasSuffixClass);

    // 模拟 hover
    await wrapper.find('.t-input').trigger('mouseenter');
    await flush();

    const afterSuffix = wrapper.findAll('.t-input__suffix-clear').length;
    const afterHasSuffixClass = wrapper.element.className.includes('t-input--suffix');
    console.log('AFTER-CLEAR-COUNT:', afterSuffix);
    console.log('AFTER-HAS-SUFFIX-CLASS:', afterHasSuffixClass);

    // 结构必须一致
    expect(afterSuffix).toBe(beforeSuffix);
    expect(afterHasSuffixClass).toBe(beforeHasSuffixClass);
  });

  it('hides the clear icon when not hovering', async () => {
    const wrapper = mount({
      data() {
        return { val: 'hello' };
      },
      render() {
        return <Input v-model={this.val} clearable />;
      },
    });
    await flush();

    const hidden = wrapper.findAll('.t-input__suffix-clear--hidden').length;
    console.log('HIDDEN-WHEN-NOT-HOVER:', hidden);
    expect(hidden).toBe(1);
  });

  it('shows the clear icon when hovering', async () => {
    const wrapper = mount({
      data() {
        return { val: 'hello' };
      },
      render() {
        return <Input v-model={this.val} clearable />;
      },
    });
    await flush();
    await wrapper.find('.t-input').trigger('mouseenter');
    await flush();

    const hidden = wrapper.findAll('.t-input__suffix-clear--hidden').length;
    console.log('HIDDEN-WHEN-HOVER:', hidden);
    expect(hidden).toBe(0);
  });
});
