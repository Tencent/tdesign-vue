import props from './props';
import { renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('divider');

export default mixins(classPrefixMixins).extend({
  name: 'TDivider',

  props: { ...props },

  render() {
    const children = renderContent(this, 'default', 'content');
    if (this.theme) {
      console.warn('TDesign Divider Warn: `theme` is going to be deprecated, please use `layout` instead.');
    }
    const dividerClassNames = [
      `${this.componentName}`,
      [`${this.componentName}--${this.layout || this.theme || 'horizontal'}`],
      {
        [`${this.componentName}--dashed`]: !!this.dashed,
        [`${this.componentName}--with-text`]: !!children,
        [`${this.componentName}--with-text-${this.align}`]: !!children,
      },
    ];

    return (
      <div class={dividerClassNames}>
        {children && <span class={`${this.componentName}__inner-text`}>{children}</span>}
      </div>
    );
  },
});
