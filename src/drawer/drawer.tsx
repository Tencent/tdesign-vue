import Vue from 'vue';
import { prefix } from '../config';
import TIconClose from '../icon/close';
import { Button as TButton } from '../button';
import props from '../../types/drawer/props';
import { FooterButton, DrawerCloseContext, TdDrawerProps } from '../../types/drawer/TdDrawerProps';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';

type FooterButtonType = 'confirm' | 'cancel';

const name = `${prefix}-drawer`;

export default Vue.extend({
  name,

  components: {
    TIconClose,
    TButton,
  },

  props: { ...props },

  directives: {
    TransferDom,
  },

  computed: {
    drawerClasses(): ClassName {
      return [
        't-drawer',
        `t-drawer-${this.placement}`,
        {
          't-drawer-open': this.visible,
          't-drawer-attach': this.showInAttachedElement,
          't-drawer-no-mask': !this.showOverlay,
        },
      ];
    },
    sizeValue(): string {
      const defaultSize = isNaN(Number(this.size)) ? this.size : `${this.size}px`;
      return {
        small: '300px',
        medium: '500px',
        large: '760px',
      }[this.size] || defaultSize;
    },
    wraperStyles(): Styles {
      return {
        // 用于抵消动画效果：transform: translateX(100%); 等
        transform: this.visible ? 'translateX(0)' : undefined,
        width: ['left', 'right'].includes(this.placement) ? this.sizeValue : '',
        height: ['top', 'bottom'].includes(this.placement) ? this.sizeValue : '',
      };
    },
    wraperClasses(): ClassName {
      return ['t-drawer__content-wrapper', `t-drawer__content-wrapper-${this.placement}`];
    },
    parentNode(): HTMLElement {
      return this.$el && this.$el.parentNode as HTMLElement;
    },
    modeAndPlacement(): string {
      return [this.mode, this.placement].join();
    },
  },

  watch: {
    modeAndPlacement: {
      handler() {
        this.handlePushMode();
      },
      immediate: true,
    },
  },

  updated() {
    this.updatePushMode();
  },

  render() {
    if (this.destroyOnClose && !this.visible) return;
    const defaultCloseBtn = <t-icon-close class="t-submenu-icon"></t-icon-close>;
    const body = renderContent(this, 'default', 'body');
    const defaultFooter = this.getDefaultFooter();
    return (
      <div
        class={this.drawerClasses}
        style={{ zIndex: this.zIndex }}
        onkeydown={this.onKeyDown}
        v-transfer-dom={this.attach}
      >
        {this.showOverlay && <div class='t-drawer__mask' onClick={this.handleWrapperClick}/>}
        <div class={this.wraperClasses} style={this.wraperStyles}>
          <div class='t-drawer__header'>{renderTNodeJSX(this, 'header')}</div>
          <div class='t-drawer__close-btn' onClick={this.handleCloseBtnClick}>{renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}</div>
          <div class="t-drawer__body">{body}</div>
          <div class="t-drawer__footer">{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
        </div>
      </div>
    );
  },

  methods: {
    handlePushMode() {
      if (this.mode !== 'push') return;
      this.$nextTick(() => {
        if (!this.parentNode) return;
        this.parentNode.style.cssText = 'transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s;';
      });
    },
    // push 动画效果处理
    updatePushMode() {
      if (!this.parentNode) return;
      if (this.mode !== 'push' || !this.parentNode) return;
      const marginStr = {
        left: `margin: 0 0 0 ${this.sizeValue}`,
        right: `margin: 0 0 0 -${this.sizeValue}`,
        top: `margin: ${this.sizeValue} 0 0 0`,
        bottom: `margin: -${this.sizeValue} 0 0 0`,
      }[this.placement];
      if (this.visible) {
        this.parentNode.style.cssText += marginStr;
      } else {
        this.parentNode.style.cssText = this.parentNode.style.cssText.replace(/margin:.+;/, '');
      }
    },
    getDefaultBtn(btnType: FooterButtonType, btnApi: FooterButton) {
      const isCancel = btnType === 'cancel';
      const clickAction = isCancel ? this.cancelBtnAction : this.confirmBtnAction;
      const variant = isCancel ? 'outline' : 'base';
      const isApiObject = typeof btnApi === 'object';
      return (
        <t-button variant={variant} onClick={clickAction} props={isApiObject ? btnApi : {}}>
          { (btnApi && typeof btnApi === 'object') ? btnApi.content : btnApi }
        </t-button>
      );
    },
    isUseDefault(btnApi: FooterButton) {
      const baseTypes = ['string', 'object'];
      return Boolean(btnApi && baseTypes.includes(typeof btnApi));
    },
    getDefaultFooter() {
      const defaultCancel = this.getDefaultBtn('cancel', this.cancelBtn);
      const defaultConfirm = this.getDefaultBtn('confirm', this.confirmBtn);
      return (
        <div>
          {this.isUseDefault(this.cancelBtn) ? defaultCancel : renderTNodeJSX(this, 'cancelBtn')}
          {this.isUseDefault(this.confirmBtn) ? defaultConfirm : renderTNodeJSX(this, 'confirmBtn')}
        </div>
      );
    },
    handleCloseBtnClick(e: MouseEvent) {
      emitEvent<Parameters<TdDrawerProps['onCloseBtnClick']>>(this, 'close-btn-click', { e });
      this.closeDrawer({ trigger: 'close-btn', e });
    },
    handleWrapperClick(e: MouseEvent) {
      emitEvent<Parameters<TdDrawerProps['onOverlayClick']>>(this, 'overlay-click', { e });
      if (this.closeOnOverlayClick) {
        this.closeDrawer({ trigger: 'overlay', e });
      }
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        emitEvent<Parameters<TdDrawerProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        if (this.closeOnEscKeydown) {
          this.closeDrawer({ trigger: 'esc', e });
        }
      }
    },
    confirmBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDrawerProps['onConfirm']>>(this, 'confirm', { e });
    },
    cancelBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDrawerProps['onCancel']>>(this, 'cancel', { e });
      this.closeDrawer({ trigger: 'cancel', e });
    },
    closeDrawer(params: DrawerCloseContext) {
      emitEvent<Parameters<TdDrawerProps['onClose']>>(this, 'close', params);
      this.$emit('update:visible', false);
    },
  },
});
