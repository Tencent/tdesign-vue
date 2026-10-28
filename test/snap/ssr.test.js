import glob from 'glob';
import { mount, config } from '@vue/test-utils';
import { createRenderer } from 'vue-server-renderer';

const transitionStub = () => ({
  render: (h) => h('div'),
});
config.stubs.transition = transitionStub();

const IGNORE_ASYNC_EXAMPLE_LIST = ['./src/table/_example/pagination-ajax.vue'];

function ssrSnapshotTest() {
  const files = glob
    .sync('./src/**/_example/*.vue')
    .filter((filePath) => !IGNORE_ASYNC_EXAMPLE_LIST.includes(filePath));
  describe('ssr snapshot test', () => {
    beforeAll(() => {
      vi.useFakeTimers().setSystemTime(new Date('2021-12-31').getTime());
    });
    files.forEach((file) => {
      if (file.indexOf('temp') > -1) {
        return;
      }
      it(`renders ${file} correctly`, async () => {
        const demo = await import(`../.${file}`);
        const realDemoComp = demo.default ? demo.default : demo;
        const wrapper = mount(realDemoComp);
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
          if (err) {
            throw err;
          }
          expect(str).toMatchSnapshot();
        });
      }, 2000);
    });
  });
}

ssrSnapshotTest();
