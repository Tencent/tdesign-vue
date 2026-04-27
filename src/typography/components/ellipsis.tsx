import { defineComponent, computed, ref } from '@vue/composition-api';
import { usePrefixClass, useConfig } from '../../config-provider/useConfig';
import { useContent } from '../../hooks/tnode';

import props from '../paragraph-props';
import TTooltip from '../../tooltip/index';

import type { TypographyEllipsis } from '../type';

export default defineComponent({
  name: 'TEllipsis',
  components: { TTooltip },
  props: {
    ...props,
    renderCopy: Function,
  },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('typography');
    const { globalConfig } = useConfig('typography');
    const renderContent = useContent();

    const ellipsisState = computed((): TypographyEllipsis => {
      const { ellipsis } = props;
      return {
        row: 1,
        expandable: false,
        ...(typeof ellipsis === 'object' ? (ellipsis as TypographyEllipsis) : {}),
      };
    });

    const isExpand = ref(false);

    const ellipsisStyles = computed((): any => {
      const ellipsis = ellipsisState.value;
      const def: Record<string, string | number> = {
        overflow: props.ellipsis ? 'hidden' : 'visible',
        textOverflow: props.ellipsis ? 'ellipsis' : 'initial',
        whiteSpace: props.ellipsis ? 'normal' : 'nowrap',
        display: '-webkit-box',
        WebkitLineClamp: ellipsis.row,
        WebkitBoxOrient: 'vertical',
      };

      if (isExpand.value) {
        def.overflow = 'visible';
        def.whiteSpace = 'normal';
        def.display = 'initial';
      }
      return def;
    });

    const onExpand = () => {
      isExpand.value = true;
      if (typeof props.ellipsis === 'object') (props.ellipsis as TypographyEllipsis).onExpand?.(true);
    };

    const onCollapse = () => {
      isExpand.value = false;
      if (typeof props.ellipsis === 'object') (props.ellipsis as TypographyEllipsis).onExpand?.(false);
    };

    return {
      COMPONENT_NAME,
      globalConfig,
      ellipsisState,
      isExpand,
      ellipsisStyles,
      renderContent,
      onExpand,
      onCollapse,
    };
  },
  methods: {
    renderEllipsisExpand() {
      const { suffix, expandable, collapsible } = this.ellipsisState;
      const symbolStyle = {
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        flex: 1,
        marginRight: this.renderCopy ? '8px' : 0,
      };

      if (!this.isExpand && expandable) {
        return (
          <span class={`${this.COMPONENT_NAME}-ellipsis-symbol`} onClick={this.onExpand} style={symbolStyle}>
            {suffix || this.globalConfig.expandText}
          </span>
        );
      }
      if (expandable && this.isExpand && collapsible) {
        return (
          <span class={`${this.COMPONENT_NAME}-ellipsis-symbol`} onClick={this.onCollapse} style={symbolStyle}>
            {this.globalConfig.collapseText}
          </span>
        );
      }
    },
  },
  render() {
    const { tooltipProps } = this.ellipsisState;
    const content = this.renderContent('default', 'content');
    const ellipsisNode = <p style={this.ellipsis ? this.ellipsisStyles : {}}>{content}</p>;
    // 仅在配置 tooltipProps、开启省略且未展开时，包裹 Tooltip 以便 hover 省略内容时展示
    const shouldShowTooltip = !!tooltipProps && !!this.ellipsis && !this.isExpand;
    const wrappedEllipsisNode = shouldShowTooltip ? (
      <TTooltip props={{ placement: 'top-right', content, ...tooltipProps }}>{ellipsisNode}</TTooltip>
    ) : (
      ellipsisNode
    );
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {wrappedEllipsisNode}
        {this.renderEllipsisExpand()}
        {this.renderCopy?.()}
      </div>
    );
  },
});
