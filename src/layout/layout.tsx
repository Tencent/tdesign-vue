import Vue from 'vue';
import { prefix } from '../config';
import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';

const name = `${prefix}-layout`;

export default Vue.extend({
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
        name,
        {
          [`${name}--with-sider`]: this.hasSider,
        },
      ];
    },
  },

  render() {
    return <section class={this.classes}>{renderTNodeJSX(this, 'default')}</section>;
  },
});
