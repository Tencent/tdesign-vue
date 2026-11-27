import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../config-provider';
import { defaultGlobalConfig } from '../context';

// provide() 里直接取了 computed 的值。Vue 2 的 provide 不是响应式的，
// 注入方拿到的是首次求值的快照，之后改 globalConfig 内部组件读不到（issue #3673）。
describe('ConfigProvider reactivity', () => {
  it('updates the injected config when globalConfig changes', async () => {
    const wrapper = mount({
      data() {
        return { cfg: { dialog: { ...defaultGlobalConfig.dialog, confirm: 'Confirm' } } };
      },
      render() {
        return (
          <ConfigProvider globalConfig={this.cfg}>
            <div class="child">child</div>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    await nextTick();

    const provider = wrapper.findComponent(ConfigProvider).vm;
    expect(provider._provided.globalConfig.dialog.confirm).toBe('Confirm');

    // 切换语言
    wrapper.vm.cfg = { dialog: { ...defaultGlobalConfig.dialog, confirm: '确定' } };
    await nextTick();
    await nextTick();

    expect(provider._provided.globalConfig.dialog.confirm).toBe('确定');
  });
});
