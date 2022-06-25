import Vue from 'vue';
import { CloseIcon } from 'tdesign-icons-vue';

import { prefix } from '../config';
import { Button as TButton } from '../button';
import props from './props';
import { FooterButton, DrawerCloseContext, TdDrawerProps } from './type';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DrawerConfig } from '../config-provider/config-receiver';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';
import { addClass, removeClass } from '../utils/dom';
import { ClassName, Styles } from '../common';
import ActionMixin from '../dialog/actions';

type FooterButtonType = 'confirm' | 'cancel';

const name = `${prefix}-drawer`;
const lockClass = `${prefix}-drawer--lock`;

export default mixins(ActionMixin, getConfigReceiverMixins<Vue, DrawerConfig>('drawer')).extend({
  name: 'TDrawer',

  components: {
    CloseIcon,
    TButton,
  },

  props,

  directives: {
    TransferDom,
  },
  data() {
    return {
      isSizeDragging: false,
      draggedSizeValue: null,
    };
  },
  computed: {
    drawerClasses(): ClassName {
      return [
        name,
        `${name}--${this.placement}`,
        {
          [`${name}--open`]: this.visible,
          [`${name}--attach`]: this.showInAttachedElement,
          [`${name}--without-mask`]: !this.showOverlay,
        },
      ];
    },
    sizeValue(): string {
      if (this.draggedSizeValue) return this.draggedSizeValue;

      const size = this.global.size ?? this.size;
      const defaultSize = isNaN(Number(size)) ? size : `${size}px`;
      return (
        {
          small: '300px',
          medium: '500px',
          large: '760px',
        }[size] || defaultSize
      );
    },
    wrapperStyles(): Styles {
      return {
        // 用于抵消动画效果：transform: translateX(100%); 等
        transform: this.visible ? 'translateX(0)' : undefined,
        width: this.isHorizontal ? this.sizeValue : '',
        height: this.isVertical ? this.sizeValue : '',
      };
    },
    wrapperClasses(): ClassName {
      return [`${name}__content-wrapper`, `${name}__content-wrapper--${this.placement}`];
    },
    parentNode(): HTMLElement {
      return this.$el && (this.$el.parentNode as HTMLElement);
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
    isHorizontal(): boolean {
      return ['right', 'left'].includes(this.placement);
    },
    isVertical(): boolean {
      return ['top', 'bottom'].includes(this.placement);
    },
    draggableLineStyles(): Styles {
      const oppositeMap = {
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top',
      };
      return {
        zIndex: 1,
        position: 'absolute',
        background: 'transparent',
        [oppositeMap[this.placement]]: 0,
        width: this.isHorizontal ? '16px' : '100%',
        height: this.isHorizontal ? '100%' : '16px',
        cursor: this.isHorizontal ? 'col-resize' : 'row-resize',
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
    visible: {
      handler(val) {
        if (val) {
          (this.$refs.drawerContainer as HTMLDivElement)?.focus?.();
        }

        this.handleScrollThrough(val);
      },
    },
  },

  updated() {
    this.updatePushMode();
  },

  mounted() {
    this.handleScrollThrough(this.visible);
  },

  render() {
    if (this.destroyOnClose && !this.visible) return;
    const defaultCloseBtn = <close-icon class={`${prefix}-submenu-icon`}></close-icon>;
    const body = renderContent(this, 'default', 'body');
    const defaultFooter = this.getDefaultFooter();
    return (
      <div
        class={this.drawerClasses}
        style={{ zIndex: this.zIndex }}
        onkeydown={this.onKeyDown}
        v-transfer-dom={this.attach}
        ref="drawerContainer"
        tabindex={0}
      >
        {this.showOverlay && <div class={`${name}__mask`} onClick={this.handleWrapperClick} />}
        <div class={this.wrapperClasses} style={this.wrapperStyles}>
          {this.header !== false ? <div class={`${name}__header`}>{renderTNodeJSX(this, 'header')}</div> : null}
          {this.closeBtn !== false ? (
            <div class={`${name}__close-btn`} onClick={this.handleCloseBtnClick}>
              {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
            </div>
          ) : null}
          <div class={`${name}__body`}>{body}</div>
          {this.footer !== false ? (
            <div class={`${name}__footer`}>{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
          ) : null}
          {this.sizeDraggable && (
            <div
              style={this.draggableLineStyles}
              onMousedown={this.enableDrag}
              onMousemove={this.handleMousemove}
              onMouseup={this.disableDrag}
              onMouseleave={this.disableDrag}
            ></div>
          )}
        </div>
      </div>
    );
  },

  methods: {
    enableDrag() {
      this.isSizeDragging = true;
    },
    handleMousemove(e: MouseEvent) {
      const { x, y } = e;
      if (this.isSizeDragging && this.sizeDraggable) {
        if (this.placement === 'right') {
          this.draggedSizeValue = `${document.documentElement.clientWidth - x + 8}px`;
        }
        if (this.placement === 'left') {
          this.draggedSizeValue = `${x + 8}px`;
        }
        if (this.placement === 'top') {
          this.draggedSizeValue = `${y + 8}px`;
        }
        if (this.placement === 'bottom') {
          this.draggedSizeValue = `${document.documentElement.clientHeight - y + 8}px`;
        }
      }
    },
    disableDrag() {
      this.isSizeDragging = false;
    },
    handleScrollThrough(visible: boolean) {
      if (!document || !document.body || !this.preventScrollThrough) return;
      if (visible && !this.showInAttachedElement) {
        this.preventScrollThrough && addClass(document.body, lockClass);
      } else {
        this.preventScrollThrough && removeClass(document.body, lockClass);
      }
    },
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
        <t-button theme={theme} onClick={clickAction} props={isApiObject ? btnApi : {}} class={`${name}-${btnType}`}>
          {btnApi && typeof btnApi === 'object' ? btnApi.content : btnApi}
        </t-button>
      );
    },
    isUseDefault(btnApi: FooterButton) {
      const baseTypes = ['string', 'object'];
      return Boolean(btnApi && baseTypes.includes(typeof btnApi));
    },
    // locale 全局配置，插槽，props，默认值，决定了按钮最终呈现
    getDefaultFooter() {
      // this.getConfirmBtn is a function of ActionMixin
      const confirmBtn = this.getConfirmBtn({
        confirmBtn: this.confirmBtn,
        globalConfirm: this.global.confirm,
        className: `${prefix}-drawer__confirm`,
      });
      // this.getCancelBtn is a function of ActionMixin
      const cancelBtn = this.getCancelBtn({
        cancelBtn: this.cancelBtn,
        globalCancel: this.global.cancel,
        className: `${prefix}-drawer__cancel`,
      });
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
      if (this.global.closeOnOverlayClick ?? this.closeOnOverlayClick) {
        this.closeDrawer({ trigger: 'overlay', e });
      }
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        emitEvent<Parameters<TdDrawerProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        if (this.global.closeOnEscKeydown ?? this.closeOnEscKeydown) {
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
