import Vue from 'vue';
import { FileCopyIcon as TdFileCopyIcon } from 'tdesign-icons-vue';
import copyText from '../utils/clipboard';
import Message from '../message/plugin';
import props from './anchor-target-props';
import TPopup from '../popup';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { AnchorConfig, getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins<Vue, AnchorConfig>('anchor'), getGlobalIconMixins()).extend({
  name: 'TAnchorTarget',

  props: { ...props },

  methods: {
    /**
     * 复制当前target的链接
     *
     */
    copyText(): void {
      // 通过构造一个a标签, 自动拼接好传入的id为href
      const a = document.createElement('a');
      a.href = `#${this.id}`;
      copyText(a.href);
      Message.success(this.global.copySuccessText, 1000);
    },
  },
  render() {
    const {
      tag: Tag,
      $scopedSlots: { default: children },
      id,
    } = this;
    const { FileCopyIcon } = this.useGlobalIcon({ FileCopyIcon: TdFileCopyIcon });
    const className = [`${this.componentName}__target`];
    const iconClassName = `${this.componentName}__copy`;
    return (
      <Tag id={id} class={className}>
        {children && children(null)}
        <TPopup content={this.global.copyText} placement="top" showArrow class={iconClassName}>
          <FileCopyIcon nativeOnClick={this.copyText} />
        </TPopup>
      </Tag>
    );
  },
});
