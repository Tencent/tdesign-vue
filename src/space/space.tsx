import { defineComponent, computed } from '@vue/composition-api';
import props from './props';
import { usePrefixClass } from '../hooks/useConfig';

export default defineComponent({
  name: 'TSpace',

  props: { ...props },

  setup(props, { slots }) {
    const COMPONENT_NAME = usePrefixClass('space');

    const renderStyle = computed(() => {
      const sizeMap = { small: '8px', medium: '16px', large: '24px' };

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

      return {
        gap: renderGap,
        ...(props.breakLine ? { 'flex-wrap': 'wrap' } : {}),
      };
    });

    const spaceClassNames = computed(() => [
      `${COMPONENT_NAME.value}`,
      {
        [`${COMPONENT_NAME.value}-align-${props.align}`]: props.align,
        [`${COMPONENT_NAME.value}-${props.direction}`]: props.direction,
      },
    ]);

    return {
      COMPONENT_NAME,
      spaceClassNames,
      renderStyle,
      slots,
    };
  },
  render(h) {
    const {
      COMPONENT_NAME, spaceClassNames, renderStyle, slots, separator,
    } = this;

    const children = slots.default().filter((child) => child.tag !== undefined);
    const childCount = children.length;

    const renderChildren = () => children.map((child, index) => {
      let renderSeparator: any = separator;
      if (typeof separator === 'function') renderSeparator = separator(h);
      // filter last child
      const showSeparator = index + 1 !== childCount && renderSeparator;

      return [
          <div class={`${COMPONENT_NAME}-item`}>{child}</div>,
          showSeparator ? <div class={`${COMPONENT_NAME}-item-separator`}>{renderSeparator}</div> : null,
      ];
    });

    return (
      <div class={spaceClassNames} style={renderStyle}>
        {renderChildren()}
      </div>
    );
  },
});
