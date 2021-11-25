import Vue from 'vue';
import {
  InfoCircleFilledIcon as TIconInfoCircleFilled,
  ErrorCircleFilledIcon as TIconErrorCircleFilled,
} from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { PopconfirmConfig } from '../config-provider/config-receiver';
import { prefix } from '../config';
import Popup, { PopupProps } from '../popup/index';
import props from './props';
import { renderTNodeJSX, renderContent, renderTNodeJSXDefault } from '../utils/render-tnode';
import { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';

const name = `${prefix}-popconfirm`;
const popupName = `${prefix}-popup`;

type IconConstructor = typeof TIconInfoCircleFilled;

export default mixins(getConfigReceiverMixins<Vue, PopconfirmConfig>('popconfirm')).extend({
  name: 'TPopconfirm',
  props: { ...props },
  model: {
    prop: 'visible',
    event: 'visible-change',
  },
  data() {
    return {
      name,
      popupName,
    };
  },
  computed: {
    themeIcon(): IconConstructor {
      const iconMap = {
        default: TIconInfoCircleFilled,
        warning: TIconErrorCircleFilled,
        danger: TIconErrorCircleFilled,
      };
      return iconMap[this.theme];
    },
    iconCls(): string {
      const theme = this.theme || 'default';
      return `${name}__icon--${theme}`;
    },
    innerPopupProps(): PopupProps {
      return {
        showArrow: this.showArrow,
        overlayClassName: [name, `${name}__popup--${this.theme || 'default'}`],
        trigger: 'click',
        destroyOnClose: this.destroyOnClose,
        placement: this.placement,
        ...this.popupProps,
      };
    },
  },
  methods: {
    handleCancel(e: MouseEvent) {
      this.$emit('cancel', { e });
      this.onCancel && this.onCancel({ e });
      const cancelContext: PopconfirmVisibleChangeContext = { e, trigger: 'cancel' };
      this.$emit('visible-change', false, cancelContext);
      this.onVisibleChange && this.onVisibleChange(false, cancelContext);
    },
    handleConfirm(e: MouseEvent) {
      this.$emit('confirm', { e });
      this.onConfirm && this.onConfirm({ e });
      const confirmContext: PopconfirmVisibleChangeContext = { e, trigger: 'confirm' };
      this.$emit('visible-change', false, confirmContext);
      this.onVisibleChange && this.onVisibleChange(false, confirmContext);
    },
    renderIcon() {
      const Icon = this.themeIcon;
      return renderTNodeJSXDefault(this, 'icon', <Icon class={this.iconCls} />);
    },
    getBtnText(api: TdPopconfirmProps['cancelBtn'], text: '取消' | '确定') {
      return (typeof api === 'object' ? api.content : api) || text;
    },
    getBtnProps(api: TdPopconfirmProps['confirmBtn']) {
      return typeof api === 'object' ? api : {};
    },
    renderCancel(cancelBtn: TdPopconfirmProps['cancelBtn']) {
      return (
        <t-button theme="default" size='small' props={this.getBtnProps(cancelBtn)}>
          {this.getBtnText(cancelBtn, '取消')}
        </t-button>
      );
    },
    renderConfirm(confirmBtn: TdPopconfirmProps['confirmBtn']) {
      const defaultTheme = this.global.confirmBtnTheme[this.theme] || 'primary';
      return (
        <t-button theme={defaultTheme} size='small' props={this.getBtnProps(confirmBtn)}>
          {this.getBtnText(confirmBtn, '确定')}
        </t-button>
      );
    },
    onPopupVisibleChange(val: boolean, context: PopconfirmVisibleChangeContext) {
      this.$emit('visible-change', val, context);
      this.onVisibleChange && this.onVisibleChange(val, context);
    },
    getCancelBtn() {
      let cancelBtn = null;
      if (this.$scopedSlots.cancelBtn && this.cancelBtn) {
        console.warn('插槽 `cancelBtn` 和 属性 `cancelBtn` 同时存在，优先使用插槽渲染');
      }
      if (this.$scopedSlots.cancelBtn) {
        cancelBtn = this.$scopedSlots.cancelBtn(null);
      } else {
        const tCancelBtn = this.cancelBtn || this.global.cancel;
        cancelBtn = typeof tCancelBtn === 'function'
          ? tCancelBtn(this.$createElement)
          : this.renderCancel(tCancelBtn);
      }
      return cancelBtn;
    },
    getConfirmBtn() {
      let confirmBtn = null;
      if (this.$scopedSlots.confirmBtn) {
        confirmBtn = this.$scopedSlots.confirmBtn(null);
      } else {
        const tConfirmBtn = this.confirmBtn || this.global.confirm;
        confirmBtn = typeof tConfirmBtn === 'function'
          ? tConfirmBtn(this.$createElement)
          : this.renderConfirm(tConfirmBtn);
      }
      return confirmBtn;
    },
  },
  render() {
    const triggerElement = renderContent(this, 'default', 'triggerElement');
    const cancelBtn = this.getCancelBtn();
    const confirmBtn = this.getConfirmBtn();
    return (
      <div>
        <Popup
          ref='popup'
          visible={this.visible}
          props={this.innerPopupProps}
          on={{ 'visible-change': this.onPopupVisibleChange }}
        >
          <template slot='content' role='poppconfirm'>
            <div class={`${name}__content`}>
              <div class={`${name}__body`}>
                {this.renderIcon()}
                <div class={`${name}__inner`}>
                  {renderTNodeJSX(this, 'content')}
                </div>
              </div>
              {Boolean(cancelBtn || confirmBtn) && (
                <div class={`${name}__buttons`}>
                  <span class={`${name}__cancel`} onClick={this.handleCancel}>{cancelBtn}</span>
                  <span class={`${name}__confirm`} onClick={this.handleConfirm}>{confirmBtn}</span>
                </div>
              )}
            </div>
          </template>
          {triggerElement}
        </Popup>
      </div>
    );
  },
});
