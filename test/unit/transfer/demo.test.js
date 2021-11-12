import { mount } from '@vue/test-utils';
import path from 'path';

const rootDir = path.resolve(__dirname, '../../../');

function testDemo(demoName) {
  const demoFile = path.resolve(rootDir, 'examples/transfer/demos', `${demoName}.vue`);
  const demo = require(demoFile).default;
  it(`${demoName} demo works fine`, () => {
    const wrapper = mount(demo);
    expect(wrapper.element).toMatchSnapshot();
  });
}

// unit test for component in examples.
describe('Transfer', () => {
  testDemo('base');
  testDemo('checked');
  testDemo('custom');
  testDemo('disabled');
  testDemo('empty');
  testDemo('pagination');
  testDemo('search');
  testDemo('target-value');
  testDemo('tree');
});
