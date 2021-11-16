import isFunction from 'lodash/isFunction';
import { ChevronDownCircleIcon as TIconChevronDown } from 'tdesign-icons-vue';
import mixins from '../../utils/mixins';
import getLocalReceiverMixins from '../../locale/local-receiver';

import primaryTableProps from '../primary-table-props';
import { prefix } from '../../config';
import { Styles } from '../../common';

export default mixins(getLocalReceiverMixins('table')).extend({
  name: `${prefix}-expand-box`,
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
    },
    rowIndex: {
      type: Number,
    },
    expandIcon: primaryTableProps.expandIcon,
  },
  methods: {
    getDefaultIcon() {
      return isFunction(this.locale.expandIcon)
        ? this.locale.expandIcon(this.$createElement)
        : <TIconChevronDown />;
    },
    getExpandIcon(expanded: boolean) {
      const icon = isFunction(this.expandIcon)
        ? this.expandIcon(this.$createElement, { row: this.row, index: this.rowIndex })
        : this.getDefaultIcon();
      const style: Styles = {
        transition: 'all .2s',
        display: 'flex',
        'align-items': 'center',
      };
      if (!expanded) {
        style.transform = 'rotate(-180deg)';
      }
      if (!icon) return false;
      return <span style={style}>{icon}</span>;
    },
  },
  render() {
    const { expanded, $listeners } = this;
    const buttonProps = { on: { ...$listeners } };
    const icon = this.getExpandIcon(expanded);
    if (!icon) return null;
    return (
      <span {...buttonProps} class={`${prefix}-table-expand-box`}>
        {icon}
      </span>
    );
  },
});
