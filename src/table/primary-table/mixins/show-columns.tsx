import Vue, { VNode } from 'vue';
import { SettingIcon } from 'tdesign-icons-vue';

import { DialogPlugin } from '../../../dialog/plugin';
import Checkbox from '../../../checkbox';
import CheckboxGroup from '../../../checkbox/group';
import primaryTableProps from '../../primary-table-props';
import { TdPrimaryTableProps } from '../../type';
import { prefix } from '../../../config';
import { renderTNodeJSXDefault } from '../../../utils/render-tnode';

export default Vue.extend({
  name: `${prefix}-primary-show-columns`,
  props: {
    columnController: primaryTableProps.columnController,
    columns: primaryTableProps.columns,
    showColumns: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showColumnKeys: this.columns.map(({ colKey }) => colKey), // dialog 确定后才重新赋值
      showColumnCheckboxKeys: this.columns.map(({ colKey }) => colKey), // 多选框状态
      isShowColumnsDlg: false,
    };
  },
  computed: {
    showColumnCheckboxOpts(): Record<string, any> {
      const enbledKeys = new Set(this.columnController?.fields || this.columns.map(({ colKey }) => colKey));

      return this.columns
        .filter(({ colKey, title }) => colKey && title) // 去空
        .map(({ colKey, title }) => ({
          label: title,
          value: colKey,
          disabled: !enbledKeys.has(colKey),
        }));
    },
    isAllShowColumns(): boolean {
      return this.showColumnCheckboxOpts.every(({ value }: Record<string, any>) => this.showColumnCheckboxKeys.includes(value));
    },
    isSomeShowColumns(): boolean {
      return (
        !this.isAllShowColumns
        && this.showColumnCheckboxOpts.some(({ value }: Record<string, any>) => this.showColumnCheckboxKeys.includes(value))
      );
    },
  },
  methods: {
    getShowColumns(columns: TdPrimaryTableProps['columns']): TdPrimaryTableProps['columns'] {
      return columns.filter(
        ({ colKey }) => this.showColumnKeys.includes(colKey)
          || !this.showColumnCheckboxOpts.map(({ value }: Record<string, any>) => value).includes(colKey),
      );
    },

    renderShowColumns(): VNode {
      const handleCheckChange = (vals: string[]) => {
        this.showColumnCheckboxKeys = vals;
      };

      const handleToggleColumnController = () => {
        const dialogTmp = DialogPlugin.confirm({
          header: '自定义设置表格列',
          body: () => {
            const defaultNode = (
              <div
                class={`${prefix}-table__column-controller ${prefix}-table__column-controller--${
                  this.columnController.displayType === 'fixed-width' ? 'fixed' : 'auto'
                }`}
              >
                <div class={`${prefix}-table__column-controller-body`}>
                  <p class={`${prefix}-table__column-controller-desc`}>请选择需要在表格中显示的数据列</p>
                  <div class={`${prefix}-table__column-controller-block`}>
                    <Checkbox
                      indeterminate={this.isSomeShowColumns}
                      checked={this.isAllShowColumns}
                      onChange={this.handleClickAllShowColumns}
                    >
                      全选
                    </Checkbox>
                  </div>
                  <div class={`${prefix}-table__column-controller-block`}>
                    <CheckboxGroup
                      options={this.showColumnCheckboxOpts}
                      value={this.showColumnCheckboxKeys}
                      onChange={handleCheckChange}
                    />
                  </div>
                </div>
              </div>
            );
            return renderTNodeJSXDefault(this, 'columnControllerContent', defaultNode);
          },
          confirmBtn: '确认',
          cancelBtn: '取消',
          width: 612,
          onConfirm: () => {
            this.showColumnKeys = [...this.showColumnCheckboxKeys];
            dialogTmp.hide();
          },
          onClose: () => {
            dialogTmp.hide();
          },
        });
      };
      return (
        <div class={`${prefix}-table__top-content`}>
          <t-button theme="default" variant="outline" onClick={handleToggleColumnController}>
            <SettingIcon slot="icon" />
            自定义列
          </t-button>
        </div>
      );
    },

    handleClickAllShowColumns(): void {
      if (this.isAllShowColumns) {
        this.showColumnCheckboxKeys = this.showColumnCheckboxOpts
          .filter((item: any) => item.disabled)
          .map(({ value }: Record<string, any>) => value);
      } else {
        this.showColumnCheckboxKeys = this.showColumnCheckboxOpts.map(({ value }: Record<string, any>) => value);
      }
    },

    updateColumns(): void {
      const keys = this.columns.map(({ colKey }) => colKey);

      this.showColumnKeys = keys;
      this.showColumnCheckboxKeys = keys;
    },
  },
  watch: {
    columns: {
      deep: true,
      handler() {
        this.updateColumns();
      },
    },
  },
});
