import props from './header-props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('header');

export default mixins(classPrefixMixins).extend({
  name: 'THeader',

  props: { ...props },

  render() {
    const styles = this.height ? { height: this.height } : {};
    return (
      <header class={`${this.classPrefix}-layout__header`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </header>
    );
  },
});
