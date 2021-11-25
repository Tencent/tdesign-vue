import Vue from 'vue';
import { CloseIcon as TIconClose } from 'tdesign-icons-vue';
import { prefix } from '../config';
import { Button as TButton } from '../button';
import props from './props';
import { FooterButton, DrawerCloseContext, TdDrawerProps } from './type';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DrawerConfig } from '../config-provider/config-receiver';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';
import { ClassName, Styles } from '../common';

type FooterButtonType = 'confirm' | 'cancel';

const name = `${prefix}-drawer`;

export default mixins(getConfigReceiverMixins<Vue, DrawerConfig>('drawer')).extend({
  name: 'TDrawer',

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
        name,
        `${name}-${this.placement}`,
        {
          [`${name}-open`]: this.visible,
          [`${name}-attach`]: this.showInAttachedElement,
          [`${name}-no-mask`]: !this.showOverlay,
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
      return [`${name}__content-wrapper`, `${name}__content-wrapper-${this.placement}`];
    },
    parentNode(): HTMLElement {
      return this.$el && this.$el.parentNode as HTMLElement;
    },
    modeAndPlacement(): string {
      return [this.mode, this.placement].join();
    },
    footerStyle(): Styles {
      return {
        display: 'flex',
        justifyContent: this.placement === 'right' ? 'flex-start' : 'flex-end',
      };
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
        {this.showOverlay && <div class={`${name}__mask`} onClick={this.handleWrapperClick}/>}
        <div class={this.wraperClasses} style={this.wraperStyles}>
          {this.header !== false ? <div class={`${name}__header`}>{renderTNodeJSX(this, 'header')}</div> : null}
          {this.closeBtn !== false
            ? (
              <div class={`${name}__close-btn`} onClick={this.handleCloseBtnClick}>
                {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
              </div>)
            : null}
          <div class={`${name}__body`}>{body}</div>
          {this.footer !== false
            ? <div class={`${name}__footer`}>{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
            : null }
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
      const theme = isCancel ? 'default' : 'primary';
      const isApiObject = typeof btnApi === 'object';
      return (
        <t-button
          theme={theme}
          onClick={clickAction}
          props={isApiObject ? btnApi : {}}
          class={`${name}-${btnType}`}
        >
          { (btnApi && typeof btnApi === 'object') ? btnApi.content : btnApi }
        </t-button>
      );
    },
    isUseDefault(btnApi: FooterButton) {
      const baseTypes = ['string', 'object'];
      return Boolean(btnApi && baseTypes.includes(typeof btnApi));
    },
    // locale 全局配置，插槽，props，默认值，决定了按钮最终呈现
    getDefaultFooter() {
      let cancelBtn = null;
      if (![undefined, null].includes(this.cancelBtn)) {
        cancelBtn = this.cancelBtn || this.t(this.global.cancel);
        const defaultCancel = this.getDefaultBtn('cancel', cancelBtn);
        cancelBtn = this.isUseDefault(cancelBtn) ? defaultCancel : renderTNodeJSX(this, 'cancelBtn');
      }
      let confirmBtn = null;
      if (![undefined, null].includes(this.confirmBtn)) {
        confirmBtn = this.confirmBtn || this.t(this.global.confirm);
        const defaultConfirm = this.getDefaultBtn('confirm', confirmBtn);
        confirmBtn = this.isUseDefault(confirmBtn) ? defaultConfirm : renderTNodeJSX(this, 'confirmBtn');
      }
      return (
        <div style={this.footerStyle}>
          {this.placement === 'right' ? confirmBtn : null}
          {cancelBtn}
          {this.placement !== 'right' ? confirmBtn : null}
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
