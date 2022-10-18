import { mount } from '@vue/test-utils';
import Timeline from '@/src/timeline/index.ts';

// every component needs four parts: props/events/slots/functions.
describe('Timeline', () => {
  // test props api
  describe(':props', () => {
    it('', () => {
      const wrapper = mount({
        render() {
          return <Timeline></Timeline>;
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // test events
  describe('@event', () => {});

  // test slots
  describe('<slot>', () => {
    it('', () => {});
  });

  // test exposure function
  describe('function', () => {
    it('', () => {});
  });
});
