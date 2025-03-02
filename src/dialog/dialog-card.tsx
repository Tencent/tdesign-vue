import Vue from 'vue';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';
import ActionMixin from './actions';
import TButton from '../button';
import { DialogCloseContext, TdDialogProps } from './type';
import dialogProps from './props';
import dialogCardProps from './dialog-card-props';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, {
  DialogConfig,
  getGlobalIconMixins,
  getAttachConfigMixins,
} from '../config-provider/config-receiver';
import { emitEvent } from '../utils/event';
import { ClassName, Styles } from '../common';

function getCSSValue(v: string | number) {
  return isNaN(Number(v)) ? v : `${Number(v)}px`;
}

export default mixins(
  ActionMixin,
  getConfigReceiverMixins<Vue, DialogConfig>('dialog'),
  getGlobalIconMixins(),
  getAttachConfigMixins('dialog'),
).extend({
  name: 'TDialogCard',

  components: {
    TButton,
  },

  props: {
    ...dialogProps,
    ...dialogCardProps,
    instanceGlobal: Object,
  },

  computed: {
    isModal(): boolean {
      return this.mode === 'modal';
    },
    isModeLess(): boolean {
      return this.mode === 'modeless';
    },
    isFullScreen(): boolean {
      return this.mode === 'full-screen';
    },
    dialogClass(): ClassName {
      const dialogClass = [
        `${this.componentName}`,
        `${this.componentName}__modal-${this.theme}`,
        this.isModeLess && this.draggable && `${this.componentName}--draggable`,
      ];
      if (this.isFullScreen) {
        dialogClass.push(`${this.componentName}__fullscreen`);
      } else {
        dialogClass.push(`${this.componentName}--default`);
      }
      return dialogClass;
    },
    computedDialogStyle(): Styles {
      return !this.isFullScreen ? { width: getCSSValue(this.width), ...this.dialogStyle } : { ...this.dialogStyle }; // width全屏模式不生效;
    },
  },

  methods: {
    closeBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onCloseBtnClick']>>(this, 'close-btn-click', { e });
      this.emitCloseEvent({
        trigger: 'close-btn',
        e,
      });
    },

    emitCloseEvent(context: DialogCloseContext) {
      emitEvent<Parameters<TdDialogProps['onClose']>>(this, 'close', context);
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

    onStopDown(e: MouseEvent) {
      if (this.isModeLess && this.draggable) e.stopPropagation();
    },

    renderHeader() {
      // header 值为 true 显示空白头部
      const defaultHeader = <h5 class="title"></h5>;
      const header = renderTNodeJSX(this, 'header', defaultHeader);
      const headerClassName = this.isFullScreen
        ? [`${this.componentName}__header`, `${this.componentName}__header--fullscreen`]
        : `${this.componentName}__header`;
      const closeClassName = this.isFullScreen
        ? [`${this.componentName}__close`, `${this.componentName}__close--fullscreen`]
        : `${this.componentName}__close`;
      const { CloseIcon } = this.useGlobalIcon({
        CloseIcon: TdCloseIcon,
      });
      const defaultCloseBtn = <CloseIcon />;
      const getIcon = () => {
        const { InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } = this.useGlobalIcon({
          InfoCircleFilledIcon: TdInfoCircleFilledIcon,
          CheckCircleFilledIcon: TdCheckCircleFilledIcon,
          ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
        });
        const icon = {
          default: null as null,
          info: <InfoCircleFilledIcon class={`${this.classPrefix}-is-info`} />,
          warning: <ErrorCircleFilledIcon class={`${this.classPrefix}-is-warning`} />,
          danger: <ErrorCircleFilledIcon class={`${this.classPrefix}-is-error`} />,
          success: <CheckCircleFilledIcon class={`${this.classPrefix}-is-success`} />,
        };
        return icon[this.theme];
      };
      return (
        (header || this?.closeBtn) && (
          <div class={headerClassName} onMousedown={this.onStopDown}>
            <div class={`${this.componentName}__header-content`}>
              {getIcon()}
              {header}
            </div>
            {this.closeBtn ? (
              <span class={closeClassName} onClick={this.closeBtnAction}>
                {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
              </span>
            ) : null}
          </div>
        )
      );
    },

    renderBody() {
      const body = renderContent(this, 'default', 'body');
      const bodyClassName = this.theme === 'default'
        ? [`${this.componentName}__body`]
        : [`${this.componentName}__body`, `${this.componentName}__body__icon`];

      if (this.isFullScreen && !!this.footer) {
        bodyClassName.push(`${this.componentName}__body--fullscreen`);
      } else if (this.isFullScreen) {
        bodyClassName.push(`${this.componentName}__body--fullscreen--without-footer`);
      }
      return (
        <div class={bodyClassName} onMousedown={this.onStopDown}>
          {body}
        </div>
      );
    },

    renderFooter() {
      const footerClassName = this.isFullScreen
        ? [`${this.componentName}__footer`, `${this.componentName}__footer--fullscreen`]
        : `${this.componentName}__footer`;
      // this.getConfirmBtn is a function of ActionMixin
      // this.getCancelBtn is a function of ActionMixin
      const defaultFooter = (
        <div>
          {this.getCancelBtn({
            cancelBtn: this.cancelBtn,
            globalCancel: this.instanceGlobal?.cancel || this.global.cancel,
            className: `${this.componentName}__cancel`,
          })}
          {this.getConfirmBtn({
            theme: this.theme,
            confirmBtn: this.confirmBtn,
            confirmLoading: this.confirmLoading,
            globalConfirm: this.instanceGlobal?.confirm || this.global.confirm,
            globalConfirmBtnTheme: this.instanceGlobal?.confirmBtnTheme || this.global.confirmBtnTheme,
            className: `${this.componentName}__confirm`,
          })}
        </div>
      );
      const footerContent = renderTNodeJSX(this, 'footer', defaultFooter);
      return (
        <div class={footerClassName} onMousedown={this.onStopDown}>
          {footerContent}
        </div>
      );
    },
  },

  render() {
    return (
      <div key="dialog" ref="dialogCard" class={this.dialogClass} style={this.computedDialogStyle}>
        {this.renderHeader()}
        {this.renderBody()}
        {!!this.footer && this.renderFooter()}
      </div>
    );
  },
});
