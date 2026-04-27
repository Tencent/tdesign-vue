import {
  computed, defineComponent, ref, h,
} from '@vue/composition-api';
import { CopyIcon, CheckIcon } from 'tdesign-icons-vue';
import { usePrefixClass, useConfig } from '../config-provider/useConfig';
import { useContent } from '../hooks/tnode';
import copyText from '../utils/clipboard';
import props from './text-props';
import Ellipsis from './components/ellipsis';
import TTooltip from '../tooltip';
import TButton from '../button';

import type { TdTextProps } from './type';
import type { TdTooltipProps } from '../tooltip/type';

export default defineComponent({
  name: 'TTypographyText',
  props,
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('typography');
    const { globalConfig } = useConfig('typography');
    const isCopied = ref(false);
    const renderContent = useContent();

    const wrapperDecorations = (
      {
        code, underline, delete: del, strong, keyboard, mark, italic,
      }: TdTextProps,
      content: any,
    ) => {
      let currentContent = content;

      function wrap(needed: boolean, Tag: string, styles: object = {}) {
        if (!needed) return;
        currentContent = h(Tag, { style: styles }, [currentContent]);
      }

      wrap(strong, 'strong');
      wrap(underline, 'u');
      wrap(del, 'del');
      wrap(code, 'code');
      wrap(mark !== false, 'mark', mark ? { backgroundColor: mark } : {});
      wrap(keyboard, 'kbd');
      wrap(italic, 'i');
      return currentContent;
    };

    const classList = computed(() => {
      const { theme, disabled } = props;
      const prefix = COMPONENT_NAME.value;
      const list: string[] = [prefix];
      if (disabled) {
        list.push(`${prefix}--disabled`);
      } else if (theme && ['primary', 'secondary', 'success', 'warning', 'error'].includes(theme)) {
        list.push(`${prefix}--${theme}`);
      }
      return list;
    });

    const tooltipText = computed(() => {
      const { copyable } = props;
      if (isCopied.value) return globalConfig.value.copiedText;
      if (typeof copyable === 'object') return copyable.tooltipProps?.content;
      return null;
    });

    const contentNode = computed(() => renderContent('default', 'content'));

    const getChildrenText = () => {
      const { copyable } = props;
      if (typeof copyable === 'object' && copyable?.text) {
        return copyable.text;
      }
      const node = contentNode.value;
      if (typeof node === 'string') {
        return node;
      }
      if (Array.isArray(node)) {
        return node
          .map((v: any) => {
            if (typeof v === 'string') return v;
            if (v?.children) return v.children;
            if (v?.text) return v.text;
            return '';
          })
          .join('');
      }
      return '';
    };

    const onCopyClick = (e: MouseEvent, cb: Function) => {
      e.preventDefault();
      e.stopPropagation();

      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 1500);

      copyText(getChildrenText());
      cb?.();
    };

    return {
      isCopied,
      classList,
      tooltipText,
      contentNode,
      wrapperDecorations,
      onCopyClick,
    };
  },
  methods: {
    renderCopy(afterEllipsis?: boolean) {
      const { copyable } = this;

      let icon: any = this.isCopied ? () => <CheckIcon /> : () => <CopyIcon />;
      let tooltipConf: TdTooltipProps = {
        theme: 'default',
        hideEmptyPopup: true,
      };

      let onCopy = () => {};
      if (typeof copyable === 'object') {
        if (copyable.suffix && !this.isCopied) {
          icon = copyable.suffix;
        }
        if (copyable.tooltipProps) {
          tooltipConf = copyable.tooltipProps;
        }
        if (typeof copyable.onCopy === 'function') {
          onCopy = copyable.onCopy;
        }
      }
      return (
        <TTooltip props={{ ...tooltipConf, content: this.tooltipText }}>
          {afterEllipsis ? (
            <span onClick={(e: MouseEvent) => this.onCopyClick(e, onCopy)}>{icon()}</span>
          ) : (
            <TButton
              props={{
                icon,
                shape: 'square',
                theme: 'primary',
                variant: 'text',
              }}
              onClick={(e: MouseEvent) => this.onCopyClick(e, onCopy)}
            />
          )}
        </TTooltip>
      );
    },
  },
  render() {
    const content = this.contentNode;
    return this.ellipsis ? (
      <Ellipsis
        props={this.$props}
        class={this.classList}
        renderCopy={this.copyable ? () => this.renderCopy(true) : null}
      >
        {this.wrapperDecorations(this.$props, content)}
      </Ellipsis>
    ) : (
      <span class={this.classList}>
        {this.wrapperDecorations(this.$props, content)}
        {this.copyable ? this.renderCopy() : null}
      </span>
    );
  },
});
