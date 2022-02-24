import Vue, { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import { FilterIcon } from 'tdesign-icons-vue';
import isEmpty from 'lodash/isEmpty';
import { PrimaryTableCol, TdPrimaryTableProps, FilterValue } from '../../type';
import primaryTableProps from '../../primary-table-props';
import baseTableProps from '../../base-table-props';
import { prefix } from '../../../config';
import { CheckboxGroup } from '../../../checkbox';
import { RadioGroup } from '../../../radio';
import Input from '../../../input';
import Popup from '../../../popup';
import TButton from '../../../button';
import { getTitle } from '../../util/common';
import { emitEvent } from '../../../utils/event';
import { renderTNodeJSXDefault } from '../../../utils/render-tnode';

type FilterChangeContext = Parameters<TdPrimaryTableProps['onFilterChange']>;
type ChangeContext = Parameters<TdPrimaryTableProps['onChange']>;

type Params = Parameters<CreateElement>;
type FirstParams = Params[0];
type SecondParams = Params[1] | Params[2];

// 筛选条件不为空，才需要显示筛选结果行
function filterEmptyData(data: FilterValue) {
  const newFilterValue: FilterValue = {};
  Object.keys(data).forEach((key) => {
    const item = data[key];
    const isArrayTrue = item instanceof Array && item.length;
    const isObject = typeof item === 'object' && !(item instanceof Array);
    const isObjectTrue = isObject && Object.keys(item).length;
    if (isArrayTrue || isObjectTrue || !['null', '', 'undefined'].includes(String(item))) {
      newFilterValue[key] = item;
    }
  });
  return newFilterValue;
}

export default Vue.extend({
  name: `${prefix}-primary-table-filter`,

  data() {
    return {
      tableWidth: 0,
      innerFilterValue: this.filterValue,
      filterPopupVisible: {},
    };
  },

  props: {
    columns: primaryTableProps.columns,
    pagination: baseTableProps.pagination,
    filterValue: primaryTableProps.filterValue,
    filterIcon: primaryTableProps.filterIcon,
    data: baseTableProps.data,
    filterRow: Function,
  },

  computed: {
    fixedLeftColumn(): boolean {
      return !!this.columns?.filter((col) => col.fixed === 'left').length;
    },
    hasFilterCondition(): boolean {
      return !!this.columns?.filter((col) => col.filter).length;
    },
  },

  watch: {
    filterValue(val) {
      this.innerFilterValue = { ...val };
    },
  },

  mounted() {
    // using timer for getting right width
    const timer = setTimeout(() => {
      this.updateTableWidth();
      clearTimeout(timer);
    }, 0);
  },

  methods: {
    updateTableWidth() {
      if (!this.$el || typeof this.$el?.querySelector !== 'function') return;
      const tbody = this.$el?.querySelector(`.${prefix}-table__body`);
      if (tbody) {
        this.tableWidth = tbody.clientWidth;
      } else {
        const el = this.$el.querySelector(`.${prefix}-table-content`);
        el && (this.tableWidth = el.clientWidth);
      }
    },

    onFilterPopupVisibleChange(visible: boolean, colKey: string) {
      this.$set(this.filterPopupVisible, colKey, visible);
    },

    renderFirstFilterRow() {
      const filterEmpty = filterEmptyData(this.filterValue);
      if (!this.filterValue || !Object.keys(filterEmpty).length) return null;
      const defaultNode = (
        <div class={`${prefix}-table__filter-result`}>
          <span>搜索 “{this.getFilterResultContent()}”，</span>
          <span>找到 {this.pagination?.total || this.data?.length} 条结果</span>
          <TButton theme="primary" variant="text" onClick={this.onResetAll}>
            清空筛选
          </TButton>
        </div>
      );
      const filterContent = renderTNodeJSXDefault(this, 'filterRow', {
        defaultNode,
      });
      return (
        <div
          style={{ width: this.fixedLeftColumn ? `${this.tableWidth}px` : undefined }}
          class={`${prefix}-table__row-filter-inner`}
        >
          {filterContent}
        </div>
      );
    },

    // 获取搜索条件内容，存在 options 需要获取其 label 显示
    getFilterResultContent(): string {
      const arr: string[] = [];
      this.columns
        .filter((col) => col.filter)
        .forEach((col) => {
          let value = this.filterValue[col.colKey];
          if (col.filter.list && !['null', '', 'undefined'].includes(String(value))) {
            const formattedValue = value instanceof Array ? value : [value];
            const label: string[] = [];
            col.filter.list.forEach((option) => {
              if (formattedValue.includes(option.value)) {
                label.push(option.label);
              }
            });
            value = label.join();
          }
          if (value) {
            arr.push(`${col.title}：${value}`);
          }
        });
      return arr.join('；');
    },

    onInnerFilterChange(val: any, column: PrimaryTableCol) {
      const filterValue = {
        ...this.innerFilterValue,
        [column.colKey]: val,
      };
      this.innerFilterValue = filterValue;
      if (!column.filter.showConfirmAndReset) {
        this.emitFilterChange(filterValue, column);
      }
    },

    emitFilterChange(filterValue: FilterValue, column?: PrimaryTableCol) {
      emitEvent<FilterChangeContext>(this, 'filter-change', filterValue, { col: column });
      emitEvent<ChangeContext>(this, 'change', { filter: filterValue }, { trigger: 'filter' });
    },

    onReset(column: PrimaryTableCol) {
      const filterValue: FilterValue = {
        ...this.innerFilterValue,
        [column.colKey]:
          {
            single: '',
            multiple: [],
            input: '',
          }[column.filter.type]
          || column.filter.resetValue
          || '',
      };
      this.innerFilterValue = filterValue;
      this.emitFilterChange(filterValue, column);
      this.$set(this.filterPopupVisible, column.colKey, false);
    },

    onResetAll() {
      this.innerFilterValue = {};
      this.emitFilterChange({});
      this.filterPopupVisible = {};
    },

    onConfirm(column: PrimaryTableCol) {
      this.emitFilterChange(this.innerFilterValue, column);
      this.$set(this.filterPopupVisible, column.colKey, false);
    },

    getBottomButtons(column: PrimaryTableCol) {
      if (!column.filter.showConfirmAndReset) return;
      return (
        <div class={`${prefix}-table__filter--bottom-buttons`}>
          <TButton theme="default" size="small" onClick={() => this.onReset(column)}>
            重置
          </TButton>
          <TButton theme="primary" size="small" onClick={() => this.onConfirm(column)}>
            确认
          </TButton>
        </div>
      );
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
        options: ['single', 'multiple'].includes(column.filter.type) ? column.filter?.list : undefined,
        ...(column.filter?.props || {}),
        value: this.innerFilterValue[column.colKey],
      };
      const on = {
        change: (val: any) => this.onInnerFilterChange(val, column),
      };
      const wrapperListeners: { click?: Function } = {};
      if (column.filter.showConfirmAndReset) {
        wrapperListeners.click = (e: MouseEvent) => e.stopPropagation();
      }
      return (
        <div class={`${prefix}-table__filter-pop-content-inner`} on={wrapperListeners}>
          {column?.filter?.component ? (
            column?.filter?.component((v: FirstParams, b: SecondParams) => {
              const tProps = typeof b === 'object' && 'attrs' in b ? b.attrs : {};
              return this.$createElement(v, {
                props: { ...props, ...tProps },
                on,
              });
            })
          ) : (
            <component value={this.innerFilterValue[column.colKey]} props={{ ...props }} on={{ ...on }}></component>
          )}
        </div>
      );
    },

    getFilterColumns(columns: PrimaryTableCol[]): PrimaryTableCol[] {
      return columns.map((item, index: number) => {
        const column: PrimaryTableCol = { ...item };
        if (column.filter) {
          const title = getTitle(this, column, index);
          const isFilterHighlight = !isEmpty(this.filterValue[column.colKey]);
          column.title = () => (
            <div class={`${prefix}-table__cell--title`}>
              <div>{title}</div>
              <div class={`${prefix}-table__cell--filter`}>
                <Popup
                  visible={this.filterPopupVisible[column.colKey]}
                  trigger="click"
                  placement="bottom"
                  showArrow
                  overlayClassName={`${prefix}-table__filter-pop`}
                  on={{
                    'visible-change': (val: boolean) => this.onFilterPopupVisibleChange(val, column.colKey),
                  }}
                >
                  {isFunction(this.filterIcon) ? (
                    this.filterIcon(this.$createElement)
                  ) : (
                    <FilterIcon
                      name="filter"
                      class={[`${prefix}-table__filter-icon`, { [`${prefix}-is-focus`]: isFilterHighlight }]}
                    />
                  )}
                  <template slot="content">
                    <div class={`${prefix}-table__filter-pop-content`}>
                      {this.getFilterContent(column)}
                      {this.getBottomButtons(column)}
                    </div>
                  </template>
                </Popup>
              </div>
            </div>
          );
        }
        if (column.children?.length) {
          column.children = [...this.getFilterColumns(column.children)];
        }
        return column;
      });
    },
  },
});
