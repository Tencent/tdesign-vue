import { mount } from '@vue/test-utils';

jest.resetModules();
let text = '';
jest.mock('@/src/utils/clipboard', () => (arg) => text = arg);

// every component needs four parts: props/events/slots/functions.
describe('AnchorTarget', () => {
  const { AnchorTarget } = require('@/src/anchor/index');
  // test props api
  describe('test copy', () => {
    const wrapper = mount(AnchorTarget, {
      propsData: {
        id: 'test-target',
      },
    });

    const a = wrapper.find('.t-icon-file-copy');
    a.trigger('click');
    expect(text).toEqual(`${location.href}#test-target`);
  });

  // test slots
  describe('<slot>', () => {
    it('should render default slot', async () => {
      const wrapper = mount(AnchorTarget, {
        propsData: {
          id: 'test-target',
          tag: 'h1',
        },
        slots: {
          default: 'this is default slots',
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
