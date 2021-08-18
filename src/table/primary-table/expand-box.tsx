import isFunction from 'lodash/isFunction';
import mixins from '../../utils/mixins';
import getLocalReceiverMixins from '../../locale/local-receiver';
import TIconChevronDown from '../../icon/chevron-down-circle';
import { prefix } from '../../config';
import { Styles } from '../../common';

export default mixins(getLocalReceiverMixins('table')).extend({
  name: `${prefix}-expand-box`,
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getExpandIcon(expanded: boolean) {
      const icon = isFunction(this.locale.expandIcon)
        ? this.locale.expandIcon(this.$createElement)
        : <TIconChevronDown />;
      const style: Styles = {
        transition: 'all .2s',
        display: 'flex',
        'align-items': 'center',
      };
      if (!expanded) {
        style.transform = 'rotate(-180deg)';
      }
      return <span style={style}>{icon}</span>;
    },
  },
  render() {
    const { expanded, $listeners } = this;
    const buttonProps = { on: { ...$listeners } };
    return (
      <span {...buttonProps} class={`${prefix}-table-expand-box`}>
        {this.getExpandIcon(expanded)}
      </span>
    );
  },
});
