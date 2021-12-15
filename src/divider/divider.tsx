import Vue from 'vue';
import { prefix } from '../config';
import props from './props';
import { renderContent } from '../utils/render-tnode';

const name = `${prefix}-divider`;

export default Vue.extend({
  name: 'TDivider',

  props: { ...props },

  render() {
    const children = renderContent(this, 'default', 'content');
    if (this.theme) {
      console.warn('TDesign Divider Warn: `theme` is going to be deprecated, please use `layout` instead.');
    }
    const dividerClassNames = [
      `${name}`,
      [`${name}--${this.layout || this.theme || 'horizontal'}`],
      {
        [`${name}--dashed`]: !!this.dashed,
        [`${name}--with-text`]: !!children,
        [`${name}--with-text-${this.align}`]: !!children,
      },
    ];

    return (
      <div class={dividerClassNames}>
          {children && <span class={`${name}__inner-text`}>{children}</span>}
      </div>
    );
  },

});
