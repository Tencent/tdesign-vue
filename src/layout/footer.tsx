import props from './footer-props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('footer');

export default mixins(classPrefixMixins).extend({
  name: 'TFooter',

  props: { ...props },

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  render() {
    const styles = this.height
      ? {
        height: this.height,
      }
      : {};
    return (
      <footer class={`${this.classPrefix}-layout__footer`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </footer>
    );
  },
});
