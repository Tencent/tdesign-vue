import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Steps from '../index';

// 手写 <t-step-item value="..."> 时，indexMap 只在 watch(options) 里构建，
// options 为空就永远不建，current 匹配不到，所有步骤都停在 default（issue #3694）。
describe('Steps slots', () => {
  it('matches current by value when the items are written by hand', async () => {
    const wrapper = mount({
      render() {
        return (
          <Steps current="second">
            <t-step-item title="First" value="first" />
            <t-step-item title="Second" value="second" />
            <t-step-item title="Third" value="third" />
          </Steps>
        );
      },
    });
    await nextTick();

    const steps = wrapper.findComponent(Steps).vm;
    const options = steps.getOptions();
    expect(options.length).toBe(3);
    // current=second 时，第一个应为 finish，第二个 process
    expect(steps.handleStatus(options[0], 0)).toBe('finish');
    expect(steps.handleStatus(options[1], 1)).toBe('process');
    expect(steps.handleStatus(options[2], 2)).toBe('default');
  });
});
