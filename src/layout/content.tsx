import Vue from 'vue';
import { renderTNodeJSX } from '../utils/render-tnode';

export default Vue.extend({
  name: 'TContent',

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  render() {
    return <main class="t-layout__content">{renderTNodeJSX(this, 'default')}</main>;
  },
});
