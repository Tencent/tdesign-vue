import pick from 'lodash/pick';
import { prefix } from '../config';
import TransferList from './components/transfer-list';
import TransferOperations from './components/transfer-operations';
import {
  TransferListType,
  TransferItemOption,
  CheckedOptions,
  TransferValue,
  EmptyType,
  TransferListOptionBase,
  TargetParams,
  SearchEvent,
  SearchOption,
  TdTransferProps,
} from './interface';
import { PageInfo, TdPaginationProps } from '../pagination/type';
import mixins from '../utils/mixins';
import getConfigReceiverMixins from '../config-provider/config-receiver';
import props from './props';
import {
  getTransferListOption,
  emitEvent,
  getDataValues,
  getTransferData,
  filterTransferData,
  TRANSFER_NAME,
} from './utils';

const SOURCE = 'source';
const TARGET = 'target';

export default mixins(getConfigReceiverMixins('transfer')).extend({
  name: TRANSFER_NAME,
  components: {
    TransferList,
    TransferOperations,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  data(): {
    SOURCE: TransferListType;
    TARGET: TransferListType;
    formDisabled: boolean;
    } {
    return {
      SOURCE,
      TARGET,
      // 表单控制禁用态时的变量
      formDisabled: undefined,
    };
  },
  computed: {
    tDisabled(): boolean | boolean[] {
      return this.formDisabled || this.disabled;
    },
    isTreeMode(): boolean {
      const treeSlot = this.$scopedSlots.tree;
      return typeof treeSlot === 'function';
    },
    leftButtonDisabled(): boolean {
      return this.direction === 'right';
    },
    rightButtonDisabled(): boolean {
      return this.direction === 'left';
    },
    // props 传入的 data 格式化后的数据
    transferData(): Array<TransferItemOption> {
      return getTransferData(this.data, this.keys, this.isTreeMode);
    },
    sourceList(): Array<TransferItemOption> {
      return filterTransferData(this.transferData, this.value, false, this.isTreeMode);
    },
    targetList(): Array<TransferItemOption> {
      return filterTransferData(this.transferData, this.value, true, this.isTreeMode);
    },
    // 被选中的value
    checkedValue(): TransferListOptionBase<TransferValue[]> {
      return {
        [SOURCE]: getDataValues(this.sourceList, this.checked, { isTreeMode: this.isTreeMode }),
        [TARGET]: getDataValues(this.targetList, this.checked, { isTreeMode: this.isTreeMode }),
      };
    },
    hasFooter(): boolean {
      return !!this.$scopedSlots.footer || !!this.footer;
    },
    showPagination(): boolean {
      // 翻页在自定义列表无效
      return !!this.pagination && !this.$scopedSlots.content;
    },
    showSearch(): boolean {
      // 翻页在自定义列表无效
      return !!this.search;
    },
    footerOption(): TransferListOptionBase<string | Function> {
      const footer = this.footer || '';
      return getTransferListOption<string | Function>(footer);
    },
    emptyOption(): TransferListOptionBase<EmptyType> {
      return getTransferListOption<EmptyType>(this.empty);
    },
    searchOption(): TransferListOptionBase<SearchOption> {
      return getTransferListOption<SearchOption>(this.search);
    },
    checkAllOption(): TransferListOptionBase<boolean> {
      return getTransferListOption<boolean>(this.showCheckAll);
    },
    disabledOption(): TransferListOptionBase<boolean> {
      return getTransferListOption<boolean>(this.tDisabled);
    },
    titleOption(): TransferListOptionBase<string> {
      // TODO：此处需分别处理 Array 和 TNode 内容
      // @ts-ignore
      return getTransferListOption<string>(this.title);
    },
    paginationOption(): TransferListOptionBase<TdPaginationProps> {
      return getTransferListOption<TdPaginationProps>(this.pagination);
    },
  },
  methods: {
    transferTo(toDirection: TransferListType) {
      const oldTargetValue: Array<TransferValue> = JSON.parse(JSON.stringify(this.value));
      let newTargetValue: Array<TransferValue>;
      const checkedValue = toDirection === TARGET ? this.checkedValue[SOURCE] : this.checkedValue[TARGET];
      // target->source
      if (toDirection === SOURCE) {
        newTargetValue = oldTargetValue.filter((v) => !checkedValue.includes(v));
      } else if (this.targetSort === 'original') {
        // 按照原始顺序
        newTargetValue = getDataValues(this.transferData, oldTargetValue.concat(checkedValue), {
          isTreeMode: this.isTreeMode,
        });
      } else if (this.targetSort === 'unshift') {
        newTargetValue = checkedValue.concat(oldTargetValue);
      } else {
        newTargetValue = oldTargetValue.concat(checkedValue);
      }

      // 清空checked。与toDirection相反
      this.handleCheckedChange([], toDirection === SOURCE ? TARGET : SOURCE);

      const params: TargetParams = {
        type: toDirection,
        movedValue: checkedValue,
      };
      emitEvent<Parameters<TdTransferProps['onChange']>>(this, 'change', newTargetValue, params);
    },
    // 点击移到右边按钮触发的函数
    transferToRight() {
      this.transferTo(TARGET);
    },
    // 点击移到左边按钮触发的函数
    transferToLeft() {
      this.transferTo(SOURCE);
    },
    handleCheckedChange(val: Array<TransferValue>, listType: TransferListType) {
      const sourceChecked = listType === SOURCE ? val : this.checkedValue[SOURCE];
      const targetChecked = listType === TARGET ? val : this.checkedValue[TARGET];
      const checked = [...sourceChecked, ...targetChecked];
      const event: CheckedOptions = {
        checked,
        sourceChecked,
        targetChecked,
        type: listType,
      };
      // 支持checked.sync
      this.$emit('update:checked', checked);
      emitEvent<Parameters<TdTransferProps['onCheckedChange']>>(this, 'checked-change', event);
    },
    filterMethod(
      transferList: Array<TransferItemOption>,
      targetValueList: Array<TransferValue>,
      needMatch: boolean,
    ): Array<TransferItemOption> {
      return transferList.filter((item) => {
        const isMatch = targetValueList.indexOf(item.value) > -1;
        return needMatch ? isMatch : !isMatch;
      });
    },
    handleScroll(e: Event, listType: TransferListType) {
      const target = e.target as HTMLElement;
      const bottomDistance = target.scrollHeight - target.scrollTop - target.clientHeight;
      const event: { e: Event; bottomDistance: number; type: TransferListType } = {
        e,
        bottomDistance,
        type: listType,
      };
      emitEvent<Parameters<TdTransferProps['onScroll']>>(this, 'scroll', event);
    },
    handleSearch(e: SearchEvent) {
      emitEvent<Parameters<TdTransferProps['onSearch']>>(this, 'search', e);
    },
    handlePageChange(pageInfo: PageInfo, listType: TransferListType) {
      emitEvent<Parameters<TdTransferProps['onPageChange']>>(this, 'page-change', pageInfo, { type: listType });
    },
    renderTransferList(listType: TransferListType) {
      const scopedSlots = pick(this.$scopedSlots, ['title', 'empty', 'footer', 'operation', 'transferItem', 'default']);
      return (
        <transfer-list
          checkboxProps={this.checkboxProps}
          transferItem={this.transferItem}
          list-type={listType}
          title={this.titleOption[listType]}
          data-source={listType === SOURCE ? this.sourceList : this.targetList}
          checked-value={this.checkedValue[listType]}
          disabled={this.disabledOption[listType]}
          search={this.searchOption[listType]}
          pagination={this.paginationOption[listType]}
          check-all={this.checkAllOption[listType]}
          footer={this.footerOption[listType]}
          empty={this.emptyOption[listType]}
          onCheckedChange={(val: TransferValue[]) => this.handleCheckedChange(val, listType)}
          onScroll={($event: Event) => this.handleScroll($event, listType)}
          onSearch={this.handleSearch}
          onPageChange={(pageInfo: PageInfo) => this.handlePageChange(pageInfo, listType)}
          scopedSlots={scopedSlots}
          t={this.t}
          global={this.global}
          isTreeMode={this.isTreeMode}
        ></transfer-list>
      );
    },
  },

  render() {
    return (
      <div
        class={[
          `${prefix}-transfer`,
          this.showSearch ? `${prefix}-transfer__search` : '',
          this.hasFooter ? `${prefix}-transfer__footer` : '',
          this.showPagination ? `${prefix}-transfer__pagination` : '',
          this.isTreeMode ? `${prefix}-transfer--with-tree` : '',
        ]}
      >
        {this.renderTransferList(SOURCE)}
        <transfer-operations
          left-disabled={
            this.disabledOption[TARGET] || this.leftButtonDisabled || this.checkedValue[TARGET].length === 0
          }
          right-disabled={
            this.disabledOption[SOURCE] || this.rightButtonDisabled || this.checkedValue[SOURCE].length === 0
          }
          operation={this.operation}
          onMoveToRight={this.transferToRight}
          onMoveToLeft={this.transferToLeft}
          scopedSlots={{ operation: this.$scopedSlots.operation }}
        />
        {this.renderTransferList(TARGET)}
      </div>
    );
  },
});
