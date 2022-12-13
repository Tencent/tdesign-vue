import Vue from 'vue';
import isNumber from 'lodash/isNumber';
import throttle from 'lodash/throttle';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';

import TButton from '../button';
import ActionMixin from './actions';
import { DialogCloseContext, TdDialogProps } from './type';
import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DialogConfig, getGlobalIconMixins } from '../config-provider/config-receiver';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';
import { ClassName, Styles } from '../common';
import { updateElement } from '../hooks/useDestroyOnClose';
import stack from './stack';
import { getScrollbarWidth } from '../utils/dom';

function getCSSValue(v: string | number) {
  return isNaN(Number(v)) ? v : `${Number(v)}px`;
}

let mousePosition: { x: number; y: number } | null;
const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};

if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  document.documentElement.addEventListener('click', getClickPosition, true);
}

let key = 1;

export default mixins(ActionMixin, getConfigReceiverMixins<Vue, DialogConfig>('dialog'), getGlobalIconMixins()).extend({
  name: 'TDialog',

  components: {
    TButton,
  },

  data() {
    return {
      uid: 0,
      scrollWidth: 0,
      disX: 0,
      disY: 0,
      windowInnerWidth: 0,
      windowInnerHeight: 0,
      dialogW: 0,
      dialogH: 0,
      dLeft: 0,
      dTop: 0,
      styleEl: null,
      timer: null,
      animationEnd: false,
    };
  },

  props: { ...props },

  computed: {
    // 是否模态形式的对话框
    isModal(): boolean {
      return this.mode === 'modal';
    },
    // 是否非模态对话框
    isModeLess(): boolean {
      return this.mode === 'modeless';
    },
    // 是否普通对话框，没有脱离文档流的对话框
    isNormal(): boolean {
      return this.mode === 'normal';
    },
    maskClass(): ClassName {
      return [`${this.componentName}__mask`, !this.showOverlay && `${this.classPrefix}-is-hidden`];
    },
    dialogClass(): ClassName {
      const dialogClass = [
        `${this.componentName}`,
        `${this.componentName}--default`,
        `${this.componentName}__modal-${this.theme}`,
        this.isModeLess && this.draggable && `${this.componentName}--draggable`,
      ];
      return dialogClass;
    },
    positionClass(): ClassName {
      if (this.isNormal) return [];
      const dialogClass = [
        `${this.componentName}__position`,
        !!this.top && `${this.componentName}--top`,
        `${this.placement && !this.top ? `${this.componentName}--${this.placement}` : ''}`,
      ];
      return dialogClass;
    },
    wrapClass(): ClassName {
      return [!this.isNormal && `${this.componentName}__wrap`];
    },
    bodyClass(): ClassName {
      return [
        `${this.componentName}__body`,
        {
          [`${this.componentName}__body--icon`]: this.theme !== 'default',
        },
      ];
    },
    ctxClass(): ClassName {
      // dialog__ctx--fixed 绝对定位
      // dialog__ctx--absolute 挂载在attach元素上 相对定位
      // __ctx--modeless modeless 点击穿透
      return [
        `${this.componentName}__ctx`,
        {
          [`${this.classPrefix}-dialog__ctx--fixed`]: this.mode === 'modal',
          [`${this.classPrefix}-dialog__ctx--absolute`]: this.isModal && this.showInAttachedElement,
          [`${this.componentName}__ctx--modeless`]: this.isModeLess,
        },
      ];
    },
    positionStyle(): Styles {
      const topStyle = {} as Styles;

      if (this.top !== undefined) {
        // 判断是否时数字
        if (isNumber(this.top) && this.top < 0) {
          topStyle.paddingTop = `${this.top}px`;
        } else {
          topStyle.paddingTop = this.top;
        }
      }
      return topStyle;
    },
    dialogStyle(): Styles {
      return { width: getCSSValue(this.width) };
    },
  },

  watch: {
    visible(value) {
      if (value) {
        this.animationEnd = false;
        if (this.isModal && !this.showInAttachedElement && this.preventScrollThrough) {
          document.head.appendChild(this.styleEl);

          this.$nextTick(() => {
            const target = this.$refs.dialog as HTMLElement;
            if (mousePosition && target) {
              target.style.transformOrigin = `${mousePosition.x - target.offsetLeft}px ${
                mousePosition.y - target.offsetTop
              }px`;
            }
          });
        }
        // 清除鼠标焦点 避免entry事件多次触发（按钮弹出弹窗 不移除焦点 立即按Entry按键 会造成弹窗关闭再弹出）
        (document.activeElement as HTMLElement).blur();
      } else {
        this.clearStyleFunc();
      }
      // 多个dialog同时存在时使用esc关闭异常 (#1209)
      this.storeUid(value);
      this.addKeyboardEvent(value);
      if (this.isModeLess && this.draggable) {
        this.initDragEvent(value);
      }
      // 父元素为 display: none 时，需要更新子元素，避免 Dialog 前套 Table 组件时，固定列等特性失效
      if (value && !this.destroyOnClose && requestAnimationFrame) {
        requestAnimationFrame(() => {
          updateElement(this);
        });
      }
    },
  },
  mounted() {
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    const scrollWidth = hasScrollBar ? getScrollbarWidth() : 0;

    if (this.draggable) {
      window.addEventListener('resize', throttle(this.resizeAdjustPosition, 1000));
    }
    // @ts-ignore 用于获取组件uid
    this.uid = this._uid;
    this.styleEl = document.createElement('style');
    this.styleEl.dataset.id = `td_dialog_${+new Date()}_${(key += 1)}`;
    this.styleEl.innerHTML = `
      html body {
        overflow-y: hidden;
        width: calc(100% - ${scrollWidth}px);
      }
    `;

    if (this.visible && this.isModal && this.preventScrollThrough && !this.showInAttachedElement) {
      document.head.appendChild(this.styleEl);
    }
  },

  beforeDestroy() {
    this.addKeyboardEvent(false);
    this.clearStyleFunc();
  },

  directives: {
    TransferDom,
  },

  methods: {
    clearStyleFunc() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.styleEl.parentNode?.removeChild?.(this.styleEl);
      }, 150);
    },
    storeUid(flag: boolean) {
      if (flag) {
        stack.push(this.uid);
      } else {
        stack.pop();
      }
    },
    addKeyboardEvent(status: boolean) {
      if (status) {
        document.addEventListener('keydown', this.keyboardEvent);
        this.confirmOnEnter && document.addEventListener('keydown', this.keyboardEnterEvent);
      } else {
        document.removeEventListener('keydown', this.keyboardEvent);
        this.confirmOnEnter && document.removeEventListener('keydown', this.keyboardEnterEvent);
      }
    },
    keyboardEvent(e: KeyboardEvent) {
      if (e.code === 'Escape' && stack.top === this.uid) {
        emitEvent<Parameters<TdDialogProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        // 根据 closeOnEscKeydown 判断按下ESC时是否触发close事件
        if (this.closeOnEscKeydown ?? this.global.closeOnEscKeydown) {
          this.emitCloseEvent({ e, trigger: 'esc' });
        }
      }
    },
    // 回车出发确认事件
    keyboardEnterEvent(e: KeyboardEvent) {
      const { code } = e;
      if ((code === 'Enter' || code === 'NumpadEnter') && stack.top === this.uid) {
        emitEvent<Parameters<TdDialogProps['onConfirm']>>(this, 'confirm', { e });
      }
    },
    overlayAction(e: MouseEvent) {
      // 根据closeOnClickOverlay判断点击蒙层时是否触发close事件
      if (this.showOverlay && (this.closeOnOverlayClick ?? this.global.closeOnOverlayClick)) {
        if (e.target === this.$refs.dialogPosition) {
          emitEvent<Parameters<TdDialogProps['onOverlayClick']>>(this, 'overlay-click', { e });
          this.emitCloseEvent({ e, trigger: 'overlay' });
        }
      }
    },
    closeBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onCloseBtnClick']>>(this, 'close-btn-click', { e });
      this.emitCloseEvent({
        trigger: 'close-btn',
        e,
      });
    },
    // used in mixins of ActionMixin
    cancelBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onCancel']>>(this, 'cancel', { e });
      this.emitCloseEvent({
        trigger: 'cancel',
        e,
      });
    },
    // used in mixins of ActionMixin
    confirmBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onConfirm']>>(this, 'confirm', { e });
    },
    // 打开弹窗动画结束时事件
    afterEnter() {
      emitEvent<Parameters<TdDialogProps['onOpened']>>(this, 'opened');
    },
    // 关闭弹窗动画结束时事件
    afterLeave() {
      if (this.isModeLess && this.draggable) {
        const target = this.$refs.dialog as HTMLElement;
        if (!target) return;
        // 关闭弹窗 清空拖拽设置的相关css
        target.style.position = 'relative';
        target.style.left = 'unset';
        target.style.top = 'unset';
      }
      emitEvent<Parameters<TdDialogProps['onClosed']>>(this, 'closed');
      this.animationEnd = true;
    },

    emitCloseEvent(context: DialogCloseContext) {
      emitEvent<Parameters<TdDialogProps['onClose']>>(this, 'close', context);
      // 默认关闭弹窗
      this.$emit('update:visible', false);
    },

    // Vue在引入阶段对事件的处理还做了哪些初始化操作。Vue在实例上用一个_events属性存贮管理事件的派发和更新，
    // 暴露出$on, $once, $off, $emit方法给外部管理事件和派发执行事件
    // 所以通过判断_events某个事件下监听函数数组是否超过一个，可以判断出组件是否监听了当前事件
    hasEventOn(name: string) {
      // _events 因没有被暴露在vue实例接口中，只能把这个规则注释掉
      /* eslint-disable dot-notation */
      const eventFuncs = this['_events']?.[name];
      return !!eventFuncs?.length;
    },

    getIcon() {
      const { InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } = this.useGlobalIcon({
        InfoCircleFilledIcon: TdInfoCircleFilledIcon,
        CheckCircleFilledIcon: TdCheckCircleFilledIcon,
        ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
      });
      const icon = {
        info: <InfoCircleFilledIcon class={`${this.classPrefix}-is-info`} />,
        warning: <ErrorCircleFilledIcon class={`${this.classPrefix}-is-warning`} />,
        danger: <ErrorCircleFilledIcon class={`${this.classPrefix}-is-error`} />,
        success: <CheckCircleFilledIcon class={`${this.classPrefix}-is-success`} />,
      };
      return icon[this.theme];
    },
    mousedownHandler(targetEvent: MouseEvent) {
      const target = this.$refs.dialog as HTMLElement;
      // 算出鼠标相对元素的位置
      this.disX = targetEvent.clientX - target.offsetLeft;
      this.disY = targetEvent.clientY - target.offsetTop;
      this.dialogW = target.offsetWidth;
      this.dialogH = target.offsetHeight;
      this.windowInnerWidth = window.innerWidth || document.documentElement.clientWidth;
      this.windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
      // 如果弹出框超出屏幕范围 不能进行拖拽
      if (this.dialogW > this.windowInnerWidth || this.dialogH > this.windowInnerHeight) return;
      // 元素按下时注册document鼠标监听事件
      document.addEventListener('mousemove', this.mouseMoverHandler);
      // 鼠标弹起来移除document鼠标监听事件
      document.addEventListener('mouseup', this.mouseUpHandler);
      // 拖拽结束移除鼠标监听事件，解决文字拖拽结束事件未解绑问题(window系统双击文本然后拖拽触发)
      document.addEventListener('dragend', this.mouseUpHandler);
    },
    mouseMoverHandler(documentEvent: MouseEvent) {
      const target = this.$refs.dialog as HTMLElement;
      // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      let left = documentEvent.clientX - this.disX;
      let top = documentEvent.clientY - this.disY;
      // 移动当前元素
      // 临界判断
      // 拖拽上左边界限制
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (this.windowInnerWidth - target.offsetWidth - left < 0) left = this.windowInnerWidth - target.offsetWidth;
      if (this.windowInnerHeight - target.offsetHeight - top < 0) top = this.windowInnerHeight - target.offsetHeight;
      target.style.position = 'absolute';
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
    mouseUpHandler() {
      document.removeEventListener('mousemove', this.mouseMoverHandler);
      document.removeEventListener('mouseup', this.mouseUpHandler);
      document.removeEventListener('dragend', this.mouseUpHandler);
    },
    initDragEvent(status: boolean) {
      const target = this.$refs.dialog as HTMLElement;
      if (status) {
        target.addEventListener('mousedown', this.mousedownHandler);
      } else {
        target.removeEventListener('mousedown', this.mousedownHandler);
      }
    },
    /**
     * 打开弹窗，浏览器动态调整大小的时候缩放
     */
    resizeAdjustPosition() {
      if (this.visible) {
        const target = this.$refs.dialog as HTMLElement;
        target.style.left = `${this.dLeft * (window.innerWidth / this.windowInnerWidth)}px`;
        target.style.top = `${this.dTop * (window.innerHeight / this.windowInnerHeight)}px`;
      }
    },
    onStopDown(e: MouseEvent) {
      if (this.isModeLess && this.draggable) e.stopPropagation();
    },
    renderDialog() {
      const { CloseIcon } = this.useGlobalIcon({
        CloseIcon: TdCloseIcon,
      });
      // header 值为 true 显示空白头部
      const defaultHeader = <h5 class="title"></h5>;
      const defaultCloseBtn = <CloseIcon />;
      const body = renderContent(this, 'default', 'body');
      // this.getConfirmBtn is a function of ActionMixin
      // this.getCancelBtn is a function of ActionMixin
      const defaultFooter = (
        <div>
          {this.getCancelBtn({
            cancelBtn: this.cancelBtn,
            globalCancel: this.global.cancel,
            className: `${this.componentName}__cancel`,
          })}
          {this.getConfirmBtn({
            theme: this.theme,
            confirmBtn: this.confirmBtn,
            globalConfirm: this.global.confirm,
            globalConfirmBtnTheme: this.global.confirmBtnTheme,
            className: `${this.componentName}__confirm`,
          })}
        </div>
      );
      const footer = this.footer ? (
        <div class={`${this.componentName}__footer`} onmousedown={this.onStopDown}>
          {renderTNodeJSX(this, 'footer', defaultFooter)}
        </div>
      ) : null;
      // 此处获取定位方式 top 优先级较高 存在时 默认使用top定位
      return (
        // 非模态形态下draggable为true才允许拖拽
        <div class={this.wrapClass}>
          <div class={this.positionClass} style={this.positionStyle} onClick={this.overlayAction} ref="dialogPosition">
            <div key="dialog" ref="dialog" class={this.dialogClass} style={this.dialogStyle}>
              <div class={`${this.componentName}__header`} onmousedown={this.onStopDown}>
                <div class={`${this.componentName}__header-content`}>
                  {this.getIcon()}
                  {renderTNodeJSX(this, 'header', defaultHeader)}
                </div>
                {this.closeBtn ? (
                  <span class={`${this.componentName}__close`} onClick={this.closeBtnAction}>
                    {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
                  </span>
                ) : null}
              </div>

              <div class={this.bodyClass} onmousedown={this.onStopDown}>
                {body}
              </div>
              {footer}
            </div>
          </div>
        </div>
      );
    },
  },

  render() {
    const maskView = this.isModal && <div key="mask" class={this.maskClass}></div>;
    const dialogView = this.renderDialog();
    const view = [maskView, dialogView];
    const ctxStyle = { zIndex: this.zIndex };

    if (this.destroyOnClose && !this.visible && this.animationEnd) return null;

    return (
      <transition
        duration={300}
        name={`${this.componentName}-zoom__vue`}
        onAfterEnter={this.afterEnter}
        onAfterLeave={this.afterLeave}
      >
        <div v-show={this.visible} class={this.ctxClass} style={ctxStyle} v-transfer-dom={this.attach}>
          {view}
        </div>
      </transition>
    );
  },
});
