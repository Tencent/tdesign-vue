import Vue from 'vue';
import isFunction from 'lodash/isFunction';
import { ChevronRightCircleIcon } from 'tdesign-icons-vue';
import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { TableConfig } from '../../config-provider/config-receiver';
import primaryTableProps from '../primary-table-props';
import { prefix } from '../../config';
import { Styles } from '../../common';

export default mixins(getConfigReceiverMixins<Vue, TableConfig>('table')).extend({
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
      // if ChevronRightCircleIcon and rotate(90deg) have to be changed, contact me please.
      return isFunction(this.global.expandIcon)
        ? this.global.expandIcon(this.$createElement)
        : <ChevronRightCircleIcon />;
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
      if (expanded) {
        style.transform = 'rotate(90deg)';
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
