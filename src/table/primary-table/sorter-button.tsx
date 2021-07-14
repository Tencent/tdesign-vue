import Vue from 'vue';
import { SortType } from '../../../types/primary-table/TdPrimaryTableProps';
import { prefix } from '../../config';
import { PropType } from 'vue/types/umd';
import Tooltip from '../../tooltip';
import TIconChevronUp from '../../icon/chevron-up';
import TIconChevronDown from '../../icon/chevron-down';

const tooltips = {
  asc: '点击升序',
  desc: '点击降序',
  cancel: '点击取消排序',
};

export default Vue.extend({
  name: `${prefix}-sorter-button`,
  props: {
    sortType: {
      type: String as PropType<SortType>,
      default: null,
    },
    sortOrder: {
      type: String,
      default: (): string => '',
    },
    nextSortOrder: {
      type: String,
      required: false,
    },
  },
  render() {
    const { $listeners, sortType, sortOrder, nextSortOrder } = this;
    const allowSortTypes = [];
    if (sortType === 'all') {
      allowSortTypes.push('asc', 'desc');
    } else {
      allowSortTypes.push(sortType);
    }
    const buttonProps = { on: { ...$listeners }, class: allowSortTypes.length > 1 ? `${prefix}-table-double-icons` : '' };
    const tips = tooltips[nextSortOrder];
    const sortButton = <span {...buttonProps}>
      {allowSortTypes
        .map((direction: string) => {
          const props = {
            size: '12px',
            class: direction === sortOrder ? `${prefix}-table-sort-icon-active` : '',
          };
          if (direction === 'asc') {
            return <TIconChevronUp {...props} />;
          }
          return <TIconChevronDown {...props} />;
        })}
      </span>;
    return tips ? <Tooltip content={tips} showArrow={false}>{sortButton}</Tooltip> : sortButton;
  },
});
