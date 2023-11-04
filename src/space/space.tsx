import { defineComponent, computed } from '@vue/composition-api';
import props from './props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getFlexGapPolyFill } from '../_common/js/utils/helper';

const defaultNeedPolyfill = getFlexGapPolyFill();
const sizeMap = { small: '8px', medium: '16px', large: '24px' };

export default defineComponent({
  name: 'TSpace',

  props: {
    ...props,
    /** 强制使用 margin 间距代替 gap 属性间距（某些浏览器不支持 gap 属性） */
    forceFlexGapPolyfill: Boolean,
  },

  setup(props) {
    const COMPONENT_NAME = usePrefixClass('space');

    const needPolyfill = computed(() => props.forceFlexGapPolyfill || defaultNeedPolyfill);

    const renderStyle = computed(() => {
      let renderGap = '';
      if (Array.isArray(props.size)) {
        renderGap = props.size
          .map((s) => {
            if (typeof s === 'number') return `${s}px`;
            if (typeof s === 'string') return sizeMap[s] || s;
            return s;
          })
          .join(' ');
      } else if (typeof props.size === 'string') {
        renderGap = sizeMap[props.size] || props.size;
      } else if (typeof props.size === 'number') {
        renderGap = `${props.size}px`;
      }

      const style: { [key: string]: string | number } = {};
      if (needPolyfill.value) {
        const [columnGap, rowGap] = renderGap.split(' ');
        style['--column-gap'] = columnGap;
        style['--row-gap'] = rowGap || columnGap;
      } else {
        style.gap = renderGap;
      }
      return style;
    });

    const spaceClassNames = computed(() => [
      `${COMPONENT_NAME.value}`,
      {
        [`${COMPONENT_NAME.value}-align-${props.align}`]: props.align,
        [`${COMPONENT_NAME.value}-${props.direction}`]: props.direction,
        [`${COMPONENT_NAME.value}--break-line`]: props.breakLine,
        [`${COMPONENT_NAME.value}--polyfill`]: needPolyfill.value,
      },
    ]);

    return {
      COMPONENT_NAME,
      spaceClassNames,
      renderStyle,
    };
  },

  render() {
    const { COMPONENT_NAME, spaceClassNames, renderStyle } = this;
    const children = this.$slots.default?.filter((child) => child.tag !== undefined || child.text) || [];
    const childCount = children?.length;
    const renderChildren = () => children.map((child, index) => {
      const separatorNode = renderTNodeJSX(this, 'separator');
      const showSeparator = index + 1 !== childCount && separatorNode;
      return [
          <div class={`${COMPONENT_NAME}-item`}>{child}</div>,
          showSeparator ? <div class={`${COMPONENT_NAME}-item-separator`}>{separatorNode}</div> : null,
      ];
    });

    return (
      <div class={spaceClassNames} style={renderStyle}>
        {renderChildren()}
      </div>
    );
  },
});
