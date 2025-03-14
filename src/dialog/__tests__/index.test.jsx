/* eslint-disable @typescript-eslint/no-empty-function */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Dialog from '@/src/dialog/index.ts';

// every component needs four parts: props/events/slots/functions.
describe('Dialog', () => {
  // test props api
  describe(':props', () => {
    it('mode:modeless', () => {
      const wrapper = mount(Dialog, {
        propsData: { mode: 'modeless' },
      });
      expect(wrapper.find('.t-dialog__mask').exists()).toBe(false);
    });

    it('mode:normal', async () => {
      const wrapper = mount(Dialog, {
        propsData: { mode: 'normal' },
      });
      const ctx = wrapper.find('.t-dialog__ctx');
      await nextTick();
      expect(ctx.find('.t-dialog__position').exists()).toBeFalsy();
    });

    it('mode:full-screen', async () => {
      const wrapper = mount(Dialog, {
        propsData: { mode: 'full-screen' },
      });
      const ctx = wrapper.find('.t-dialog__ctx');
      await nextTick();
      expect(ctx.find('.t-dialog__position_fullscreen').exists()).toBeTruthy();
    });

    it('placement', () => {
      const dialog = mount(Dialog).find('.t-dialog__position');
      const centerDialog = mount(Dialog, {
        propsData: {
          placement: 'center',
          width: '500px',
        },
      });
      const dialogWidth = centerDialog.find('.t-dialog');
      const dialogPosition = centerDialog.find('.t-dialog__position');
      expect(dialog.classes()).toContain('t-dialog--top');
      const centerDialogClass = dialogPosition.classes();
      expect(centerDialogClass).not.toContain('t-dialog--top');
      expect(centerDialogClass).toContain('t-dialog--center');

      const centerDialogStyles = dialogWidth.attributes('style');
      expect(centerDialogStyles).toMatch(/width: 500px/);
    });

    it('top', () => {
      const wrapper = mount(Dialog, {
        propsData: {
          top: '200px',
          width: '200px',
        },
      });
      const dialogWidth = wrapper.find('.t-dialog');
      const dialog = wrapper.find('.t-dialog__position');
      const classes = dialog.classes();
      const styles = dialog.attributes('style');
      const widthStyles = dialogWidth.attributes('style');
      expect(classes).not.toContain('t-dialog--center');
      expect(styles).toMatch(/padding-top: 200px/);
      expect(widthStyles).toMatch(/width: 200px/);
      // expect(wrapper.element).toMatchSnapshot();
    });

    it('header,body,footer and closebtn', () => {
      const title = 'i am dialog title';
      const body = 'i am dialog body';
      const footer = 'i am dialog footer';
      const closeBtn = false;
      const wrapper = mount({
        render() {
          return (
            <Dialog header={title} footer={() => footer} closeBtn={closeBtn}>
              <div slot="body">{body}</div>
            </Dialog>
          );
        },
      });
      const dialogTitle = wrapper.find('.t-dialog__header');
      const dialogBody = wrapper.find('.t-dialog__body');
      const dialogFooter = wrapper.find('.t-dialog__footer');
      expect(dialogTitle.text()).toBe(title);
      expect(dialogBody.text()).toBe(body);
      expect(dialogFooter.text()).toBe(footer);
      expect(wrapper.find('.t-icon-close').exists()).toBe(false);
    });

    it('showOverlay and zIndex', () => {
      const zIndex = 1;
      const wrapper = mount(Dialog, {
        propsData: {
          showOverlay: false,
          zIndex,
        },
      });
      const mask = wrapper.find('.t-dialog__mask');
      expect(mask.classes()).toContain('t-is-hidden');
      expect(wrapper.find('.t-dialog__ctx').attributes('style')).toMatch(/z-index: 1/);
    });

    it('destroyOnClose', async () => {
      const wrapper = mount(Dialog, { propsData: { visible: true } });
      // 正常挂载下，弹窗关闭时不销毁Dialog子元素
      await wrapper.setProps({ visible: false });
      expect(wrapper.exists()).toBe(true);

      // 弹窗关闭时销毁Dialog子元素
      await wrapper.setProps({ destroyOnClose: true, visible: true });
      expect(wrapper.exists()).toBe(true);
      await wrapper.setProps({ visible: false });
      expect(wrapper.exists()).toBe(true);
    });

    it('showOverlay', async () => {
      const wrapper = mount(Dialog);
      const ctx = wrapper.find('.t-dialog__ctx');
      await nextTick();
      expect(ctx.find('.t-dialog__mask').exists()).toBeTruthy();
    });

    it('theme', async () => {
      const themeList = ['default', 'success', 'info', 'warning', 'danger'];
      themeList.forEach(async (theme) => {
        const wrapper = mount(Dialog, {
          propsData: {
            theme,
          },
        });
        const dialog = wrapper.find('.t-dialog');
        await nextTick();
        expect(dialog.classes()).toContain(`t-dialog__modal-${theme}`);
      });
    });

    it('width', async () => {
      const wrapper = mount(Dialog, {
        propsData: {
          width: '80%',
        },
      });
      const dialog = wrapper.find('.t-dialog');
      await nextTick();
      expect(getComputedStyle(dialog.element, null).width).toBe('80%');
    });

    it('draggable', async () => {
      const wrapper = mount(Dialog, {
        propsData: {
          mode: 'modeless',
          draggable: true,
        },
      });
      const dialog = wrapper.find('.t-dialog');
      await nextTick();
      expect(dialog.classes()).toContain('t-dialog--draggable');
    });

    it('dialogClassName', async () => {
      const wrapper = mount(Dialog, {
        propsData: {
          dialogClassName: 'custom-class',
          mode: 'modeless',
        },
      });
      const dialog = wrapper.find('.t-dialog');
      await nextTick();
      expect(dialog.classes()).toContain('custom-class');
    });

    it('dialogStyle', async () => {
      const wrapper = mount(Dialog, {
        propsData: {
          dialogStyle: { padding: '99px' },
          mode: 'modeless',
        },
      });
      const dialog = wrapper.find('.t-dialog');
      await nextTick();
      expect(getComputedStyle(dialog.element, null).padding).toBe('99px');
    });

    it('update dialog confirmBtnLoading', async () => {
      const wrapper = mount({
        data() {
          return {
            loading: false,
          };
        },
        render() {
          return (
            <Dialog
              mode="modal"
              confirmBtn={{
                content: 'Saving',
                theme: 'primary',
                loading: this.loading,
              }}
              body="this is content"
            ></Dialog>
          );
        },
      });
      const dialog = wrapper.find('.t-dialog');
      await nextTick();
      expect(dialog.find('.t-button--theme-primary.t-is-loading.t-dialog__confirm').exists()).toBeFalsy();
      await wrapper.setData({ loading: true });
      await nextTick();
      const updateDialog = wrapper.find('.t-dialog');
      expect(updateDialog.find('.t-button--theme-primary.t-is-loading.t-dialog__confirm').exists()).toBeTruthy();
    });
  });

  // test events
  describe(':events', () => {
    it(':onCancel', async () => {
      const fn = vi.fn();
      const wrapper = mount(Dialog, {
        propsData: {
          onCancel: fn,
        },
      });
      const btn = wrapper.find('.t-dialog__footer .t-dialog__cancel');
      await nextTick();
      await btn.trigger('click');
      expect(fn).toBeCalled();
    });

    it(':onConfirm', async () => {
      const fn = vi.fn();
      const wrapper = mount(Dialog, {
        propsData: {
          onConfirm: fn,
        },
      });
      const btn = wrapper.find('.t-dialog__footer .t-dialog__confirm');
      await nextTick();
      await btn.trigger('click');
      expect(fn).toBeCalled();
    });

    it(':onClose', async () => {
      const fn = vi.fn();
      const wrapper = mount(Dialog, {
        propsData: {
          onClose: fn,
        },
      });
      const btn = wrapper.find('.t-dialog__close');
      await nextTick();
      await btn.trigger('click');
      expect(fn).toBeCalled();
    });

    it(':onCloseBtnClick', async () => {
      const fn = vi.fn();
      const wrapper = mount(Dialog, {
        propsData: {
          onCloseBtnClick: fn,
        },
      });
      const btn = wrapper.find('.t-dialog__close');
      await nextTick();
      await btn.trigger('click');
      expect(fn).toBeCalled();
    });
  });

  // // test slots
  // describe('<slot>', () => {
  //   it('', () => {});
  // });

  // // test exposure function
  // describe('function', () => {
  //   it('', () => {});
  // });
});
