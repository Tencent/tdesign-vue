import Vue from 'vue';
import { prefix } from '../config';
import props from './header-props';
import { renderTNodeJSX } from '../utils/render-tnode';

export default Vue.extend({
  name: 'THeader',

  props: { ...props },

  render() {
    const styles = this.height ? { height: this.height } : {};
    return (
      <header class={`${prefix}-layout__header`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </header>
    );
  },
});
