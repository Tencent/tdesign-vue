import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('badge');

export default mixins(classPrefixMixins).extend({
  name: 'TBadge',

  props: { ...props },
  methods: {
    getContent() {
      if (typeof this.$scopedSlots.count === 'function') {
        return this.$scopedSlots.count(null);
      }
      if (typeof this.count === 'function') {
        return renderTNodeJSX(this, 'count');
      }
      if (isNaN(Number(this.count))) {
        return this.count;
      }
      const count = Number(this.count);
      return count > this.maxCount ? `${this.maxCount}+` : count;
    },
    isSmall() {
      return this.size === 'small';
    },
    isZero() {
      const content = this.getContent();
      return content === 0 || content === '0';
    },
    isHidden() {
      return !this.showZero && this.isZero();
    },
    getOffset() {
      if (!this.offset) return {};
      let [xOffset, yOffset]: Array<string | number> = this.offset;
      xOffset = isNaN(Number(xOffset)) ? xOffset : `${xOffset}px`;
      yOffset = isNaN(Number(yOffset)) ? yOffset : `${yOffset}px`;
      return { xOffset, yOffset };
    },
  },

  render() {
    const { dot, shape, color } = this.$props;

    const content = this.getContent();
    const isHidden = this.isHidden();
    const children = renderContent(this, 'default', 'content');
    const { xOffset, yOffset } = this.getOffset();
    const badgeClassNames = [
      {
        [`${this.componentName}--dot`]: !!dot,
        [`${this.componentName}--circle`]: !dot && shape === 'circle',
        [`${this.componentName}--round`]: shape === 'round',
        [`${this.componentName}--ribbon`]: shape === 'ribbon',
        [`${this.classPrefix}-size-s`]: this.isSmall(),
      },
    ];
    const inlineStyle = {
      background: `${color}`,
      right: xOffset,
      top: yOffset,
    };

    return (
      <div class={this.componentName}>
        {children || null}
        {isHidden ? null : (
          <sup class={badgeClassNames} style={inlineStyle}>
            {dot ? null : content}
          </sup>
        )}
      </div>
    );
  },
});
