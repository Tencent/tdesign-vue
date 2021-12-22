import Vue from 'vue';
import { prefix } from '../config';
import { renderTNodeJSX } from '../utils/render-tnode';

export default Vue.extend({
  name: 'TContent',

  render() {
    return <main class={`${prefix}-layout__content`}>{renderTNodeJSX(this, 'default')}</main>;
  },
});
