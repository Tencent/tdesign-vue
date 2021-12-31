import glob from 'glob';
import { mount, config } from '@vue/test-utils';
import { createRenderer } from 'vue-server-renderer';

const transitionStub = () => ({
  render: (h) => h('div'),
});
config.stubs.transition = transitionStub();

function ssrSnapshotTest() {
  const files = glob.sync('./examples/*/demos/*.vue');
  describe('ssr snapshot test', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2020-12-28').getTime());
    });
    files.forEach((file) => {
      if (file.indexOf('temp') > -1) {
        return;
      }
      it(`renders ${file} correctly`, async () => {
        const demo = require(`../.${file}`);
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
