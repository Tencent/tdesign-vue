import {
  CloseIcon as TIconClose,
  InfoCircleFilledIcon as TIconInfoCircleFilled,
  CheckCircleFilledIcon as TIconCheckCircleFilled,
  ErrorCircleFilledIcon as TIconErrorCircleFilled,
} from 'tdesign-icons-vue';
import Vue from 'vue';
import throttle from 'lodash/throttle';
import { prefix } from '../config';
import TButton from '../button';
import ActionMixin from './actions';
import { DialogCloseContext, TdDialogProps } from './type';
import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DialogConfig } from '../config-provider/config-receiver';
import TransferDom from '../utils/transfer-dom';
import { emitEvent } from '../utils/event';
import { addClass, removeClass } from '../utils/dom';
import { ClassName, Styles } from '../common';

const name = `${prefix}-dialog`;
const lockClass = `${prefix}-dialog--lock`;

function getCSSValue(v: string | number) {
  return isNaN(Number(v)) ? v : `${Number(v)}px`;
}

export default mixins(ActionMixin, getConfigReceiverMixins<Vue, DialogConfig>('dialog')).extend({
  name: 'TDialog',

  components: {
    TIconClose,
    TIconInfoCircleFilled,
    TIconCheckCircleFilled,
    TIconErrorCircleFilled,
    TButton,
  },

  data() {
    return {
      scrollWidth: 0,
      disX: 0,
      disY: 0,
      windowInnerWidth: 0,
      windowInnerHeight: 0,
      // translate 偏移影响的 需要调整
      offsetX: 0,
      offsetY: 0,
      diaglogW: 0,
      diaglogH: 0,
      dLeft: 0,
      dTop: 0,
    };
  },

  props: { ...props },

  computed: {
    // 是否模态形式的对话框
    isModal(): boolean {
      return this.mode === 'modal';
    },
    // 是否非模态对话框
    isModeless(): boolean {
      return this.mode === 'modeless';
    },
    maskClass(): ClassName {
      return [`${name}__mask`, !this.showOverlay && `${prefix}-is-hidden`];
    },
    dialogClass(): ClassName {
      const dialogClass = [`${name}`, `${name}--default`, `${name}--${this.placement}`, `${name}__modal-${this.theme}`];
      if (['modeless', 'modal'].includes(this.mode)) {
        dialogClass.push(`${name}--fixed`);
      }
      return dialogClass;
    },
    dialogStyle(): Styles {
      const { top, placement } = this;
      let topStyle = {};

      // 设置了top属性
      if (top) {
        const topValue = getCSSValue(top);
        topStyle = {
          top: topValue,
          transform: 'translate(-50%, 0)',
          transformOrigin: '25% 25%',
          maxHeight: `calc(100% - ${topValue})`,
          zIndex: this.zIndex,
        };
      } else if (placement === 'top') {
        topStyle = {
          maxHeight: 'calc(100% - 20%)',
        };
      }
      return { width: getCSSValue(this.width), ...topStyle };
    },
  },

  watch: {
    visible(value) {
      if (value) {
        const { scrollWidth } = this;
        if (scrollWidth > 0) {
          const bodyCssText = `position: relative;width: calc(100% - ${scrollWidth}px);`;
          document.body.style.cssText = bodyCssText;
        }
        addClass(document.body, lockClass);
      } else {
        document.body.style.cssText = '';
        removeClass(document.body, lockClass);
      }
      this.addKeyboardEvent(value);
      if (this.isModeless && this.draggable) {
        this.initDragEvent(value);
      }
    },
  },
  mounted() {
    this.scrollWidth = window.innerWidth - document.body.offsetWidth;
    if (this.draggable) {
      window.addEventListener('resize', throttle(this.resizeAdjustPosition, 1000));
    }
  },

  beforeDestroy() {
    this.addKeyboardEvent(false);
  },

  directives: {
    TransferDom,
  },

  methods: {
    addKeyboardEvent(status: boolean) {
      if (status) {
        document.addEventListener('keydown', this.keyboardEvent);
      } else {
        document.removeEventListener('keydown', this.keyboardEvent);
      }
    },
    keyboardEvent(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        emitEvent<Parameters<TdDialogProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        // 根据 closeOnEscKeydown 判断按下ESC时是否触发close事件
        if (this.closeOnEscKeydown) {
          this.emitCloseEvent({
            trigger: 'esc',
            e,
          });
        }
      }
    },
    overlayAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onOverlayClick']>>(this, 'overlay-click', { e });
      // 根据closeOnClickOverlay判断点击蒙层时是否触发close事件
      if (this.closeOnOverlayClick) {
        this.emitCloseEvent({
          trigger: 'overlay',
          e,
        });
      }
    },
    closeBtnAcion(e: MouseEvent) {
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
      emitEvent<Parameters<TdDialogProps['onClosed']>>(this, 'closed');
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
      const icon = {
        info: <TIconInfoCircleFilled class={`${prefix}-is-info`} />,
        warning: <TIconErrorCircleFilled class={`${prefix}-is-warning`} />,
        danger: <TIconErrorCircleFilled class={`${prefix}-is-error`} />,
        success: <TIconCheckCircleFilled class={`${prefix}-is-success`} />,
      };
      return icon[this.theme];
    },
    mousedownHanler(targetEvent: MouseEvent) {
      const target = this.$refs.dialog as HTMLElement;
      // 算出鼠标相对元素的位置
      this.disX = targetEvent.clientX - target.offsetLeft;
      this.disY = targetEvent.clientY - target.offsetTop;
      this.diaglogW = target.offsetWidth;
      this.diaglogH = target.offsetHeight;
      const [x, y] = this.getTranslateXY(target);
      this.offsetX = x;
      this.offsetY = y;
      this.windowInnerWidth = window.innerWidth;
      this.windowInnerHeight = window.innerHeight;
      // 元素按下时注册document鼠标监听事件
      document.addEventListener('mousemove', this.mouseMoverHander);
      // 鼠标弹起来移除document鼠标监听事件
      document.addEventListener('mouseup', this.mouseUpHandler);
      // 拖拽结束移除鼠标监听事件，解决文字拖拽结束事件未解绑问题(window系统双击文本然后拖拽触发)
      document.addEventListener('dragend', this.mouseUpHandler);
    },
    mouseMoverHander(documentEvent: MouseEvent) {
      const target = this.$refs.dialog as HTMLElement;
      // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      const left = documentEvent.clientX - this.disX;
      const top = documentEvent.clientY - this.disY;
      // 移动当前元素
      // 临界判断
      if (left + this.diaglogW - this.offsetX > this.windowInnerWidth) {
        this.dLeft = this.windowInnerWidth - this.diaglogW + this.offsetX;
      } else {
        this.dLeft = (target.offsetLeft < this.offsetX || left <= this.offsetX) ? this.offsetX : left;
      }
      target.style.left = `${this.dLeft}px`;
      if (top + this.diaglogH - this.offsetY > this.windowInnerHeight) {
        this.dTop = this.windowInnerHeight - this.diaglogH + this.offsetY;
      } else {
        this.dTop = (top < this.offsetY) ? this.offsetY : top;
      }
      target.style.top = `${this.dTop}px`;
    },
    mouseUpHandler() {
      document.removeEventListener('mousemove', this.mouseMoverHander);
      document.removeEventListener('mouseup', this.mouseUpHandler);
      document.removeEventListener('dragend', this.mouseUpHandler);
    },
    initDragEvent(status: boolean) {
      const target = this.$refs.dialog as HTMLElement;
      if (status) {
        target.addEventListener('mousedown', this.mousedownHanler);
      } else {
        target.removeEventListener('mousedown', this.mousedownHanler);
      }
    },
    /**
     * 获取设置的translate值
     */
    getTranslateXY(target: HTMLElement) {
      const transformStyle = document.defaultView.getComputedStyle(target).transform;
      const reg = /(\d+(\.\d+)?)/g;
      const tarnsArr = transformStyle.match(reg);
      return [parseFloat(tarnsArr[4]), parseFloat(tarnsArr[5])];
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
    renderDialog() {
      // header 值为 true 显示空白头部
      const defaultHeader = <h5 class="title"></h5>;
      const defaultCloseBtn = <t-icon-close />;
      const body = renderContent(this, 'default', 'body');
      // this.getConfirmBtn is a function of ActionMixin
      // this.getCancelBtn is a function of ActionMixin
      const defaultFooter = (
        <div>
          {this.getCancelBtn({
            cancelBtn: this.cancelBtn,
            globalCancel: this.global.cancel,
            className: `${prefix}-dialog__cancel`,
          })}
          {this.getConfirmBtn({
            theme: this.theme,
            confirmBtn: this.confirmBtn,
            globalConfirm: this.global.confirm,
            globalConfirmBtnTheme: this.global.confirmBtnTheme,
            className: `${prefix}-dialog__confirm`,
          })}
        </div>
      );
      const bodyClassName = this.theme === 'default' ? `${name}__body` : `${name}__body__icon`;
      return (
        // /* 非模态形态下draggable为true才允许拖拽 */
        <div
          key="dialog"
          ref="dialog"
          class={this.dialogClass}
          style={this.dialogStyle}
        >
          <div class={`${name}__header`}>
            {this.getIcon()}
            {renderTNodeJSX(this, 'header', defaultHeader)}
          </div>
          <span class={`${name}__close`} onClick={this.closeBtnAcion}>
            {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
          </span>
          <div class={bodyClassName}>{body}</div>
          <div class={`${name}__footer`}>{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
        </div>
      );
    },
  },

  render() {
    const maskView = this.isModal && <div key="mask" class={this.maskClass} onClick={this.overlayAction}></div>;
    const dialogView = this.renderDialog();
    const view = [maskView, dialogView];
    const ctxStyle: any = { zIndex: this.zIndex };
    const ctxClass = [`${name}__ctx`, { [`${prefix}-dialog__ctx--fixed`]: this.mode === 'modal' }];
    return (
      <transition
        duration={300}
        name={`${name}-zoom__vue`}
        onAfterEnter={this.afterEnter}
        onAfterLeave={this.afterLeave}
      >
        {(!this.destroyOnClose || this.visible) && (
          <div v-show={this.visible} class={ctxClass} style={ctxStyle} v-transfer-dom={this.attach}>
            {view}
          </div>
        )}
      </transition>
    );
  },
});
