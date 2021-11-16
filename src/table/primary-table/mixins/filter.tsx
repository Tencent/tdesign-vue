import Vue, { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import { FilterIcon as TIconFilter } from 'tdesign-icons-vue';
import { PrimaryTableCol, TdPrimaryTableProps } from '../../type';
import primaryTableProps from '../../primary-table-props';
import baseTableProps from '../../base-table-props';
import { prefix } from '../../../config';
import { CheckboxGroup } from '../../../checkbox';
import { RadioGroup } from '../../../radio';
import Input from '../../../input';
import Popup from '../../../popup';
import { getTitle } from '../../util/common';
import { emitEvent } from '../../../utils/event';

type FilterChangeContext = Parameters<TdPrimaryTableProps['onFilterChange']>;
type ChangeContext = Parameters<TdPrimaryTableProps['onChange']>;

type Params = Parameters<CreateElement>;
type FirstParams = Params[0];
type SecondParams = Params[1] | Params[2];

export default Vue.extend({
  name: `${prefix}-primary-table-filter`,
  props: {
    columns: primaryTableProps.columns,
    filterValue: primaryTableProps.filterValue,
    filterIcon: primaryTableProps.filterIcon,
    data: baseTableProps.data,
  },
  methods: {
    onInnerFilterChange(val: any, column: PrimaryTableCol) {
      const filterValue = {
        ...this.filterValue,
        [column.colKey]: val,
      };
      emitEvent<FilterChangeContext>(this, 'filter-change', filterValue, { col: column });
      emitEvent<ChangeContext>(this, 'change', { filter: filterValue }, { trigger: 'filter' });
    },

    getFilterContent(column: PrimaryTableCol) {
      const types = ['single', 'multiple', 'input'];
      if (column.type && !types.includes(column.filter.type)) {
        console.error(`TDesign Table Error: column.filter.type must be the following: ${JSON.stringify(types)}`);
        return;
      }
      if (column?.filter?.component && typeof column?.filter?.component !== 'function') {
        console.error('TDesign Table Error: column.filter.component must be a function');
        return;
      }
      const component = {
        single: RadioGroup,
        multiple: CheckboxGroup,
        input: Input,
      }[column.filter.type];
      if (!component && !column?.filter?.component) return;
      const props = {
        options: ['single', 'multiple'].includes(column.filter.type)
          ? column.filter?.list
          : undefined,
        ...(column.filter?.props || {}),
        value: this.filterValue[column.colKey],
      };
      const on = {
        change: (val: any) => this.onInnerFilterChange(val, column),
      };
      return (
        <div class={`${prefix}-table-filter-pop-content__inner`}>
          {column?.filter?.component
            ? column?.filter?.component((v: FirstParams, b: SecondParams) => {
              const tProps = (typeof b === 'object' && ('attrs' in b)) ? b.attrs : {};
              return this.$createElement(v, {
                props: { ...props, ...tProps },
                on,
              });
            })
            : (
              <component
                value={this.filterValue[column.colKey]}
                props={{ ...props }}
                on={{ ...on }}
              ></component>
            )
          }
        </div>
      );
    },

    getFilterColumns(columns: PrimaryTableCol[]): PrimaryTableCol[] {
      return columns.map((item, index: number) => {
        const column: PrimaryTableCol = { ...item };
        if (column.filter) {
          const title = getTitle(this, column, index);
          column.title = () => (
            <div class={`${prefix}-table__cell--title`}>
              <div>{title}</div>
              <div class={`${prefix}-table__cell--filter`}>
                <Popup trigger='click' placement='bottom' showArrow overlayClassName={`${prefix}-table-filter-pop`}>
                  {isFunction(this.filterIcon)
                    ? this.filterIcon(this.$createElement)
                    : <TIconFilter name="filter" class={`${prefix}-table-filter-icon`} />
                  }
                  <template slot='content'>
                    <div class={`${prefix}-table-filter-pop-content`}>{this.getFilterContent(column)}</div>
                  </template>
                </Popup>
              </div>
            </div>);
        }
        return column;
      });
    },
  },
});
