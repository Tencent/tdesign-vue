import Vue from 'vue';
import { InfoCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { PopconfirmConfig } from '../config-provider/config-receiver';
import { prefix } from '../config';
import Popup, { PopupProps } from '../popup/index';
import props from './props';
import { renderTNodeJSX, renderContent, renderTNodeJSXDefault } from '../utils/render-tnode';
import { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';
import { emitEvent } from '../utils/event';
import ActionMixin from '../dialog/actions';

const name = `${prefix}-popconfirm`;
const popupName = `${prefix}-popup`;

type IconConstructor = typeof InfoCircleFilledIcon;

export default mixins(ActionMixin, getConfigReceiverMixins<Vue, PopconfirmConfig>('popconfirm')).extend({
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
        default: InfoCircleFilledIcon,
        warning: ErrorCircleFilledIcon,
        danger: ErrorCircleFilledIcon,
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
    // used in ActionMixin, do not Delete
    cancelBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdPopconfirmProps['onCancel']>>(this, 'cancel', { e });
      const cancelContext: PopconfirmVisibleChangeContext = { e, trigger: 'cancel' };
      emitEvent<Parameters<TdPopconfirmProps['onVisibleChange']>>(this, 'visible-change', false, cancelContext);
    },
    // used in ActionMixin, do not Delete
    confirmBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdPopconfirmProps['onConfirm']>>(this, 'confirm', { e });
      const confirmContext: PopconfirmVisibleChangeContext = { e, trigger: 'confirm' };
      emitEvent<Parameters<TdPopconfirmProps['onVisibleChange']>>(this, 'visible-change', false, confirmContext);
    },
    renderIcon() {
      const Icon = this.themeIcon;
      return renderTNodeJSXDefault(this, 'icon', <Icon class={this.iconCls} />);
    },
    onPopupVisibleChange(val: boolean, context: PopconfirmVisibleChangeContext) {
      this.$emit('visible-change', val, context);
      this.onVisibleChange && this.onVisibleChange(val, context);
    },
  },
  render() {
    const triggerElement = renderContent(this, 'default', 'triggerElement');
    // this.getCancelBtn is a function of ActionMixin
    const cancelBtn = this.getCancelBtn({
      cancelBtn: this.cancelBtn,
      globalCancel: this.global.cancel,
      size: 'small',
      className: `${name}__cancel`,
    });
    // this.getConfirmBtn is a function of ActionMixin
    const confirmBtn = this.getConfirmBtn({
      theme: this.theme,
      confirmBtn: this.confirmBtn,
      globalConfirm: this.global.confirm,
      size: 'small',
      globalConfirmBtnTheme: this.global.confirmBtnTheme,
      className: `${name}__confirm`,
    });
    return (
      <Popup
        ref="popup"
        visible={this.visible}
        props={this.innerPopupProps}
        on={{ 'visible-change': this.onPopupVisibleChange }}
      >
        <template slot="content" role="poppconfirm">
          <div class={`${name}__content`}>
            <div class={`${name}__body`}>
              {this.renderIcon()}
              <div class={`${name}__inner`}>{renderTNodeJSX(this, 'content')}</div>
            </div>
            {Boolean(cancelBtn || confirmBtn) && (
              <div class={`${name}__buttons`}>
                {cancelBtn}
                {confirmBtn}
              </div>
            )}
          </div>
        </template>
        {triggerElement}
      </Popup>
    );
  },
});
