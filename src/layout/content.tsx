import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('content');

export default mixins(classPrefixMixins).extend({
  name: 'TContent',

  render() {
    return <main class={`${this.classPrefix}-layout__content`}>{renderTNodeJSX(this, 'default')}</main>;
  },
});
