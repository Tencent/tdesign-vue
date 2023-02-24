import Vue from 'vue';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-vue';

import { Button as TButton } from '../button';
import props from './props';
import { FooterButton, DrawerCloseContext, TdDrawerProps } from './type';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DrawerConfig, getGlobalIconMixins } from '../config-provider/config-receiver';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';
import { ClassName, Styles } from '../common';
import ActionMixin from '../dialog/actions';
import { getScrollbarWidth } from '../_common/js/utils/getScrollbarWidth';

type FooterButtonType = 'confirm' | 'cancel';

let key = 1;

export default mixins(ActionMixin, getConfigReceiverMixins<Vue, DrawerConfig>('drawer'), getGlobalIconMixins()).extend({
  name: 'TDrawer',

  components: {
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
      animationStart: false,
      animationEnd: false,
      styleTimer: null,
      styleEl: null,
    };
  },
  computed: {
    drawerClasses(): ClassName {
      return [
        this.componentName,
        `${this.componentName}--${this.placement}`,
        {
          [`${this.componentName}--open`]: this.visible,
          [`${this.componentName}--attach`]: this.showInAttachedElement,
          [`${this.componentName}--without-mask`]: !this.showOverlay,
        },
      ];
    },
    sizeValue(): string {
      if (this.draggedSizeValue) return this.draggedSizeValue;

      const size = this.size ?? this.global.size;
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
        transform: this.visible && this.animationStart ? 'translateX(0)' : undefined,
        width: this.isHorizontal ? this.sizeValue : '',
        height: this.isVertical ? this.sizeValue : '',
      };
    },
    wrapperClasses(): ClassName {
      return [`${this.componentName}__content-wrapper`, `${this.componentName}__content-wrapper--${this.placement}`];
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
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    const scrollWidth = hasScrollBar ? getScrollbarWidth() : 0;

    this.styleEl = document.createElement('style');
    this.styleEl.dataset.id = `td_drawer_${+new Date()}_${(key += 1)}`;
    this.styleEl.innerHTML = `
      html body {
        overflow-y: hidden;
        transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s;
        ${this.mode === 'push' ? '' : `width: calc(100% - ${scrollWidth}px);`}
      }
    `;
    this.handleScrollThrough(this.visible);
  },

  beforeDestroy() {
    this.clearStyleFunc();
  },

  render() {
    if (this.destroyOnClose && !this.visible && this.animationEnd) return null;

    const { CloseIcon } = this.useGlobalIcon({
      CloseIcon: TdCloseIcon,
    });
    const defaultCloseBtn = <CloseIcon class={`${this.classPrefix}-submenu-icon`}></CloseIcon>;
    const body = renderContent(this, 'default', 'body');
    const defaultFooter = this.getDefaultFooter();

    return (
      <transition
        onAppear={this.afterEnter}
        duration={{ enter: 10, leave: 300 }}
        onAfterEnter={this.afterEnter}
        onAfterLeave={this.afterLeave}
      >
        <div
          class={this.drawerClasses}
          style={{ zIndex: this.zIndex }}
          onkeydown={this.onKeyDown}
          v-transfer-dom={this.attach}
          ref="drawerContainer"
          tabindex={0}
          v-show={this.visible}
        >
          {this.showOverlay && (
            <transition duration={300} name={`${this.componentName}-fade`}>
              <div
                key="mask"
                class={`${this.componentName}__mask`}
                onClick={this.handleWrapperClick}
                v-show={this.visible}
              />
            </transition>
          )}
          <div class={this.wrapperClasses} style={this.wrapperStyles}>
            {this.header !== false ? (
              <div class={`${this.componentName}__header`}>{renderTNodeJSX(this, 'header', <div></div>)}</div>
            ) : null}
            {this.closeBtn !== false ? (
              <div class={`${this.componentName}__close-btn`} onClick={this.handleCloseBtnClick}>
                {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
              </div>
            ) : null}
            <div class={`${this.componentName}__body`}>{body}</div>
            {this.footer !== false ? (
              <div class={`${this.componentName}__footer`}>{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
            ) : null}
            {this.sizeDraggable && <div style={this.draggableLineStyles} onMousedown={this.enableDrag}></div>}
          </div>
        </div>
      </transition>
    );
  },

  methods: {
    clearStyleFunc() {
      clearTimeout(this.styleTimer);
      this.styleTimer = setTimeout(() => {
        this.styleEl.parentNode?.removeChild?.(this.styleEl);
      }, 150);
    },
    afterEnter() {
      this.animationStart = true;
      this.animationEnd = false;
    },
    afterLeave() {
      this.animationStart = false;
      this.animationEnd = true;
    },
    enableDrag() {
      document.addEventListener('mouseup', this.handleMouseup, true);
      document.addEventListener('mousemove', this.handleMousemove, true);
      this.isSizeDragging = true;
    },
    handleMouseup() {
      document.removeEventListener('mouseup', this.handleMouseup, true);
      document.removeEventListener('mousemove', this.handleMousemove, true);
      this.isSizeDragging = false;
    },
    handleMousemove(e: MouseEvent) {
      const { x, y } = e;
      const maxHeight = document.documentElement.clientHeight;
      const maxWidth = document.documentElement.clientWidth;
      const offsetHeight = 8;
      const offsetWidth = 8;

      if (this.isSizeDragging && this.sizeDraggable) {
        if (this.placement === 'right') {
          const moveLeft = Math.min(Math.max(maxWidth - x + offsetWidth, offsetWidth), maxWidth);
          this.draggedSizeValue = `${moveLeft}px`;
        }
        if (this.placement === 'left') {
          const moveRight = Math.min(Math.max(x + offsetWidth, offsetWidth), maxWidth);
          this.draggedSizeValue = `${moveRight}px`;
        }
        if (this.placement === 'top') {
          const moveBottom = Math.min(Math.max(y + offsetHeight, offsetHeight), maxHeight);
          this.draggedSizeValue = `${moveBottom}px`;
        }
        if (this.placement === 'bottom') {
          const moveTop = Math.min(Math.max(maxHeight - y + offsetHeight, offsetHeight), maxHeight);
          this.draggedSizeValue = `${moveTop}px`;
        }
      }
    },
    handleScrollThrough(visible: boolean) {
      if (!document || !document.body || !this.preventScrollThrough) return;
      if (visible) {
        if (!this.showInAttachedElement && this.preventScrollThrough) {
          document.head.appendChild(this.styleEl);
        }
      } else {
        this.clearStyleFunc();
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
        <t-button
          theme={theme}
          onClick={clickAction}
          props={isApiObject ? btnApi : {}}
          class={`${this.componentName}-${btnType}`}
        >
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
        className: `${this.componentName}__confirm`,
      });
      // this.getCancelBtn is a function of ActionMixin
      const cancelBtn = this.getCancelBtn({
        cancelBtn: this.cancelBtn,
        globalCancel: this.global.cancel,
        className: `${this.componentName}__cancel`,
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
      if (this.closeOnOverlayClick ?? this.global.closeOnOverlayClick) {
        this.closeDrawer({ trigger: 'overlay', e });
      }
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        emitEvent<Parameters<TdDrawerProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        if (this.closeOnEscKeydown ?? this.global.closeOnEscKeydown) {
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
