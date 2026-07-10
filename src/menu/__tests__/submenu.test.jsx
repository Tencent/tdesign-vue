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
  describe('popup hover timing', () => {
    const getPopupWrapper = (submenuProvide = {}) => {
      const popupMenu = {
        ...Menu,
        mode: ref('popup'),
        isHead: true,
        open: vi.fn(),
      };

      return mount(Submenu, {
        propsData: {
          value: '1',
        },
        provide: {
          TdMenu: popupMenu,
          TdSubmenu: submenuProvide,
        },
      });
    };

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays hiding the popup after mouse leave', async () => {
      vi.useFakeTimers();
      const wrapper = getPopupWrapper();

      wrapper.vm.handleMouseEnter();
      vi.advanceTimersByTime(0);
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).toContain('t-is-opened');

      wrapper.vm.handleMouseLeave({ relatedTarget: document.body });
      vi.advanceTimersByTime(99);
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).toContain('t-is-opened');

      vi.advanceTimersByTime(1);
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).not.toContain('t-is-opened');

      wrapper.destroy();
    });

    it('keeps the popup open when cursor enters before hide delay', async () => {
      vi.useFakeTimers();
      const cancelHideTimer = vi.fn();
      const wrapper = getPopupWrapper({ cancelHideTimer });

      wrapper.vm.handleMouseEnter();
      vi.advanceTimersByTime(0);
      await wrapper.vm.$nextTick();

      wrapper.vm.handleMouseLeave({ relatedTarget: document.body });
      vi.advanceTimersByTime(50);
      wrapper.vm.handleEnterPopup();
      vi.advanceTimersByTime(50);
      await wrapper.vm.$nextTick();

      expect(wrapper.classes()).toContain('t-is-opened');
      expect(cancelHideTimer).toHaveBeenCalled();

      wrapper.destroy();
    });

    it('closes sibling popups immediately when another submenu opens', async () => {
      vi.useFakeTimers();
      const popupMenu = {
        ...Menu,
        mode: ref('popup'),
        isHead: true,
        open: vi.fn(),
        popupSubmenus: new Set(),
        vMenu: {
          select: (value) => [value],
          add: vi.fn(),
        },
      };
      const first = mount(Submenu, {
        propsData: { value: '1' },
        provide: { TdMenu: popupMenu },
      });
      const second = mount(Submenu, {
        propsData: { value: '2' },
        provide: { TdMenu: popupMenu },
      });

      first.vm.handleMouseEnter();
      vi.advanceTimersByTime(0);
      await first.vm.$nextTick();
      expect(first.classes()).toContain('t-is-opened');

      first.vm.handleMouseLeave({ relatedTarget: document.body });
      vi.advanceTimersByTime(50);
      second.vm.handleMouseEnter();
      vi.advanceTimersByTime(0);
      await first.vm.$nextTick();
      await second.vm.$nextTick();

      expect(first.classes()).not.toContain('t-is-opened');
      expect(second.classes()).toContain('t-is-opened');

      first.destroy();
      second.destroy();
    });
  });

  // test props api
  describe('props', () => {
    it(':name', () => {
      const wrapper = mount({
        provide: {
          TdMenu: Menu,
        },
        render() {
          return <Submenu name="1"></Submenu>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
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
      expect(wrapper.element).toMatchSnapshot();
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
      expect(wrapper.element).toMatchSnapshot();
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
      expect(wrapper.element).toMatchSnapshot();
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
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
