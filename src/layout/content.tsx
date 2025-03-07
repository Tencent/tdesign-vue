import { renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import props from './content-props';

const classPrefixMixins = getClassPrefixMixins('content');

export default mixins(classPrefixMixins).extend({
  name: 'TContent',
  props,
  render() {
    return <main class={`${this.classPrefix}-layout__content`}>{renderContent(this, 'default', 'content')}</main>;
  },
});
