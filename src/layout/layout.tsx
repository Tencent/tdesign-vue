import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('layout');

export default mixins(classPrefixMixins).extend({
  name: 'TLayout',

  data() {
    return {
      hasSider: false,
    };
  },

  provide(): any {
    return {
      layout: this,
    };
  },

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  computed: {
    classes(): ClassName {
      return [
        this.componentName,
        {
          [`${this.componentName}--with-sider`]: this.hasSider,
        },
      ];
    },
  },

  render() {
    return <section class={this.classes}>{renderTNodeJSX(this, 'default')}</section>;
  },
});
