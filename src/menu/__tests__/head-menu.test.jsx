/* eslint-disable class-methods-use-this, no-param-reassign */
import { mount } from '@vue/test-utils';
import { HeadMenu, Menu, MenuItem } from '@/src/menu';

// every component needs four parts: props/events/slots/functions.
describe('HeadMenu', () => {
  // test props api
  describe('props', () => {
    it(':theme', () => {
      const wrapper = mount({
        render() {
          return <HeadMenu theme={'light'}></HeadMenu>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it(':active', () => {
      const wrapper = mount({
        render() {
          return <HeadMenu value={'2-1'}></HeadMenu>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it(':height', () => {
      const wrapper = mount({
        render() {
          return <HeadMenu height={'750px'}></HeadMenu>;
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('keeps hidden head menu items hidden when a side menu exists', async () => {
      const NativeResizeObserver = window.ResizeObserver;
      let resize;
      window.ResizeObserver = class {
        constructor(callback) {
          resize = callback;
        }

        observe() {}

        unobserve() {}

        disconnect() {}
      };

      const MenuContent = {
        props: {
          visible: Boolean,
          value: String,
        },
        render() {
          return (
            <div class={`${this.value}-menu-content`} style={{ display: this.visible ? '' : 'none' }}>
              <MenuItem value={this.value}>{this.value}</MenuItem>
            </div>
          );
        },
      };
      const wrapper = mount({
        render() {
          return (
            <div>
              <Menu>
                <MenuContent visible value="side" />
              </Menu>
              <HeadMenu expandType="popup">
                <MenuContent value="header" />
              </HeadMenu>
            </div>
          );
        },
      });
      await wrapper.vm.$nextTick();

      const inner = wrapper.find('.t-head-menu__inner').element;
      Object.defineProperty(inner, 'clientWidth', { configurable: true, value: 300 });
      resize([]);

      expect(wrapper.find('.side-menu-content').element.style.display).toBe('');
      expect(wrapper.find('.header-menu-content').element.style.display).toBe('none');
      expect(wrapper.find('.t-head-menu__submenu--more').element.style.display).toBe('none');

      wrapper.destroy();
      window.ResizeObserver = NativeResizeObserver;
    });
  });

  describe('slot', () => {
    it('<logo>', () => {
      const wrapper = mount(HeadMenu, {
        slots: {
          logo: '<div></div>',
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('<default>', () => {
      const wrapper = mount(HeadMenu, {
        slots: {
          default: '<div></div>',
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('<options>', () => {
      const wrapper = mount(HeadMenu, {
        slots: {
          options: '<div></div>',
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
