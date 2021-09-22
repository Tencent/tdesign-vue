import { mount } from '@vue/test-utils';
import { ref } from '@vue/composition-api';
import { Submenu } from '@/src/menu';

const Menu = {
  theme: ref('light'),
  activeValue: ref(''),
  activeValues: ref([]),
  mode: ref('normal'),
};

// every component needs four parts: props/events/slots/functions.
describe('Submenu', () => {
  // test props api
  describe('props', () => {
    it(':name', () => {
      const wrapper = mount({
        provide: {
          TdMenu: Menu,
        },
        render() {
          return <Submenu name='1'></Submenu>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });

    it(':disabled', () => {
      const wrapper = mount({
        provide: {
          TdMenu: Menu,
        },
        render() {
          return <Submenu disabled={true}></Submenu>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('slot', () => {
    it('<icon>', () => {
      const wrapper = mount(Submenu, {
        slots: {
          icon: '<div></div>',
        },
        provide: {
          TdMenu: Menu,
        },
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('<default>', () => {
      const wrapper = mount(Submenu, {
        slots: {
          default: '<div></div>',
        },
        provide: {
          TdMenu: Menu,
        },
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('<title>', () => {
      const wrapper = mount(Submenu, {
        slots: {
          title: '<div></div>',
        },
        provide: {
          TdMenu: Menu,
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
