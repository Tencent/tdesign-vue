import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { TreeSelect } from '../index';

// multiple=false 时，data 里的函数式 label 应该被渲染出来（issue #3739）
const data = [
  { value: '1', label: (h) => h('span', { class: 'custom-label' }, '选项1') },
  { value: '2', label: '选项2' },
];

describe('TreeSelect function label', () => {
  it('renders a function label in single mode', async () => {
    const wrapper = mount({
      render() {
        return <TreeSelect data={data} value="1" multiple={false} />;
      },
    });
    await nextTick();
    await nextTick();
    const html = wrapper.html();
    console.log('HTML:', html.slice(0, 400));
    expect(wrapper.find('.custom-label').exists()).toBe(true);
    expect(wrapper.text()).toContain('选项1');
  });

  it('renders a function label in multiple mode (control)', async () => {
    const wrapper = mount({
      render() {
        return <TreeSelect data={data} value={['1']} multiple={true} />;
      },
    });
    await nextTick();
    await nextTick();
    console.log('MULTI HTML:', wrapper.html().slice(0, 400));
    expect(wrapper.text()).toContain('选项1');
  });
});
