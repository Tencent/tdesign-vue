import {
  PageFirstIcon,
  PageLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronRightDoubleIcon,
  ChevronLeftDoubleIcon,
  EllipsisIcon,
} from 'tdesign-icons-vue';
import Vue from 'vue';
import { prefix } from '../config';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { PaginationConfig } from '../config-provider/config-receiver';
import TInputNumber from '../input-number';
import { Select, Option } from '../select';
import CLASSNAMES from '../utils/classnames';
import { renderTNodeJSX } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';
import { TdPaginationProps } from './type';

const name = `${prefix}-pagination`;
const min = 1;

export type PageSizeChangeParams = Parameters<TdPaginationProps['onPageSizeChange']>;
export type CurrentChangeParams = Parameters<TdPaginationProps['onCurrentChange']>;
export type ChangeEventParams = Parameters<TdPaginationProps['onChange']>;

export default mixins(getConfigReceiverMixins<Vue, PaginationConfig>('pagination')).extend({
  name: 'TPagination',

  components: {
    PageFirstIcon,
    PageLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronRightDoubleIcon,
    ChevronLeftDoubleIcon,
    EllipsisIcon,
    TInputNumber,
    TSelect: Select,
    TOption: Option,
  },

  props: {
    ...props,
    /**
     * 当前页
     */
    current: {
      type: Number,
      default: 1,
      validator(v: number): boolean {
        return v > 0;
      },
    },
    /**
     * 分页大小
     */
    pageSize: {
      type: Number,
      default: 10,
      validator(v: number): boolean {
        return v > 0;
      },
    },
  },

  data() {
    return {
      prevMore: false,
      nextMore: false,
      jumpIndex: this.current,
    };
  },

  watch: {
    current(val) {
      this.jumpIndex = val;
    },
  },

  computed: {
    /**
     * 样式计算
     */
    paginationClass(): ClassName {
      return [
        `${name}`,
        CLASSNAMES.SIZE[this.size],
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
        },
      ];
    },
    totalClass(): ClassName {
      return [`${name}__total`];
    },
    sizerClass(): ClassName {
      return [`${name}__select`];
    },
    preBtnClass(): ClassName {
      return [
        `${name}__btn`,
        `${name}__btn-prev`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled || this.current === 1,
        },
      ];
    },
    nextBtnClass(): ClassName {
      return [
        `${name}__btn`,
        `${name}__btn-next`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled || this.current === this.pageCount,
        },
      ];
    },
    btnWrapClass(): ClassName {
      return [`${name}__pager`];
    },
    btnMoreClass(): ClassName {
      return [
        `${name}__number`,
        `${name}__number--more`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
        },
      ];
    },
    jumperClass(): ClassName {
      return [`${name}__jump`];
    },
    jumperInputClass(): ClassName {
      return [`${name}__input`];
    },
    simpleClass(): ClassName {
      return [`${name}__select`];
    },
    pageCount(): number {
      const c: number = Math.ceil(this.total / this.pageSize);
      return c > 0 ? c : 1;
    },
    pageCountOption(): Array<{ label: string; value: number }> {
      const ans = [];
      for (let i = 1; i <= this.pageCount; i++) {
        ans.push({ value: i, label: `${i}/${this.pageCount}` });
      }
      return ans;
    },
    sizeOptions(): Array<{ label: string; value: number }> {
      const options = this.pageSizeOptions.map((option) => typeof option === 'object'
        ? option
        : {
          label: this.t(this.global.itemsPerPage, { size: option }),
          value: Number(option),
        });
      return options.sort((a, b) => a.value - b.value);
    },

    curPageLeftCount(): number {
      return Math.ceil((this.foldedMaxPageBtn - 1) / 2);
    },

    curPageRightCount(): number {
      return Math.ceil((this.foldedMaxPageBtn - 1) / 2);
    },

    isPrevMoreShow(): boolean {
      return 2 + this.curPageLeftCount < this.current;
    },

    isNextMoreShow(): boolean {
      return this.pageCount - 1 - this.curPageRightCount > this.current;
    },

    pages(): Array<number> {
      const array = [];
      let start;
      let end;

      if (this.isFolded) {
        if (this.isPrevMoreShow && this.isNextMoreShow) {
          start = this.current - this.curPageLeftCount;
          end = this.current + this.curPageRightCount;
        } else {
          const foldedStart = this.isMidEllipsis ? 2 : 1;
          const foldedEnd = this.isMidEllipsis ? this.pageCount - 1 : this.pageCount;
          start = this.isPrevMoreShow ? this.pageCount - this.foldedMaxPageBtn + 1 : foldedStart;
          end = this.isPrevMoreShow ? foldedEnd : this.foldedMaxPageBtn;
        }
      } else {
        start = 1;
        end = this.pageCount;
      }

      for (let i = start; i <= end; i++) {
        array.push(i);
      }
      return array;
    },

    isFolded(): boolean {
      return this.pageCount > this.maxPageBtn;
    },
    isMidEllipsis(): boolean {
      return this.pageEllipsisMode === 'mid';
    },
  },

  methods: {
    toPage(pageIndex: number, isTriggerChange?: boolean): void {
      if (this.disabled) {
        return;
      }
      let current = pageIndex;
      if (pageIndex < min) {
        current = min;
      } else if (pageIndex > this.pageCount) {
        current = this.pageCount;
      }
      if (this.current !== current) {
        const prev = this.current;
        const pageInfo = {
          current,
          previous: prev,
          pageSize: this.pageSize,
        };
        emitEvent<CurrentChangeParams>(this, 'current-change', current, pageInfo);
        if (isTriggerChange !== false) {
          emitEvent<ChangeEventParams>(this, 'change', pageInfo);
        }
      }
    },

    prevPage(): void {
      this.toPage(this.current - 1);
    },

    nextPage(): void {
      this.toPage(this.current + 1);
    },

    prevMorePage(): void {
      this.toPage(this.current - this.foldedMaxPageBtn);
    },

    nextMorePage(): void {
      this.toPage(this.current + this.foldedMaxPageBtn);
    },

    getButtonClass(index: number): ClassName {
      return [
        `${name}__number`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
          [CLASSNAMES.STATUS.current]: this.current === index,
        },
      ];
    },

    onSelectorChange(e: string): void {
      if (this.disabled) {
        return;
      }
      const pageSize: number = parseInt(e, 10);
      let pageCount = 1;
      if (pageSize > 0) {
        pageCount = Math.ceil(this.total / pageSize);
      }

      let isIndexChange = false;

      if (this.current > pageCount) {
        isIndexChange = true;
      }

      /**
       * 分页大小变化事件
       * @param {Number} pageSize 分页大小
       * @param {Number} index 当前页
       */
      const pageInfo = {
        current: isIndexChange ? pageCount : this.current,
        previous: this.current,
        pageSize,
      };
      this.$emit('update:pageSize', pageSize, pageInfo);
      emitEvent<PageSizeChangeParams>(this, 'page-size-change', pageSize, pageInfo);
      emitEvent<ChangeEventParams>(this, 'change', pageInfo);
      if (isIndexChange) {
        this.toPage(pageCount, false);
      }
    },

    // 自定义页码时，相当于 current 发生变化
    onJumperChange(val: String) {
      const currentIndex = Number(val);
      if (isNaN(currentIndex)) return;
      this.toPage(currentIndex);
    },
  },

  render() {
    return (
      <div class={this.paginationClass}>
        {/* 数据统计区 */}
        {renderTNodeJSX(
          this,
          'totalContent',
          <div class={this.totalClass}>{this.t(this.global.total, { total: this.total })}</div>,
        )}
        {/* 分页器 */}
        {this.showPageSize && this.pageSizeOptions.length ? (
          <t-select
            size={this.size}
            value={this.pageSize}
            disabled={this.disabled}
            class={this.sizerClass}
            onChange={this.onSelectorChange}
            autoWidth={true}
          >
            {this.sizeOptions.map((item, index) => (
              <t-option value={item.value} label={item.label} key={index} />
            ))}
          </t-select>
        ) : null}
        {/* 首页按钮 */}
        {this.showFirstAndLastPageBtn ? (
          <div class={this.preBtnClass} onClick={() => this.toPage(1)} disabled={this.disabled || this.current === min}>
            <page-first-icon />
          </div>
        ) : null}
        {/* 向前按钮 */}
        {this.showPreviousAndNextBtn ? (
          <div class={this.preBtnClass} onClick={this.prevPage} disabled={this.disabled || this.current === min}>
            <chevron-left-icon />
          </div>
        ) : null}
        {/* 常规版 */}
        {this.showPageNumber && this.theme === 'default' ? (
          <ul class={this.btnWrapClass}>
            {this.isFolded && this.isMidEllipsis ? (
              <li class={this.getButtonClass(1)} onClick={() => this.toPage(min)}>
                {min}
              </li>
            ) : null}
            {this.isFolded && this.isPrevMoreShow && this.isMidEllipsis ? (
              <li
                class={this.btnMoreClass}
                onClick={this.prevMorePage}
                onMouseover={() => (this.prevMore = true)}
                onMouseout={() => (this.prevMore = false)}
              >
                {this.prevMore ? <chevron-left-double-icon /> : <ellipsis-icon />}
              </li>
            ) : null}
            {this.pages.map((i) => (
              <li class={this.getButtonClass(i)} key={i} onClick={() => this.toPage(i)}>
                {i}
              </li>
            ))}
            {this.isFolded && this.isNextMoreShow && this.isMidEllipsis ? (
              <li
                class={this.btnMoreClass}
                onClick={this.nextMorePage}
                onMouseover={() => (this.nextMore = true)}
                onMouseout={() => (this.nextMore = false)}
              >
                {this.nextMore ? <chevron-right-double-icon /> : <ellipsis-icon />}
              </li>
            ) : null}
            {this.isFolded && this.isMidEllipsis ? (
              <li class={this.getButtonClass(this.pageCount)} onClick={() => this.toPage(this.pageCount)}>
                {this.pageCount}
              </li>
            ) : null}
          </ul>
        ) : null}
        {/* 极简版 */}
        {this.showPageNumber && this.theme === 'simple' ? (
          <t-select
            size={this.size}
            value={this.current}
            disabled={this.disabled}
            class={this.simpleClass}
            onChange={this.toPage}
            options={this.pageCountOption}
            autoWidth={true}
          />
        ) : null}
        {/* 向后按钮 */}
        {this.showPreviousAndNextBtn ? (
          <div
            class={this.nextBtnClass}
            onClick={this.nextPage}
            disabled={this.disabled || this.current === this.pageCount}
          >
            <chevron-right-icon />
          </div>
        ) : null}
        {/* 尾页按钮 */}
        {this.showFirstAndLastPageBtn ? (
          <div
            class={this.nextBtnClass}
            onClick={() => this.toPage(this.pageCount)}
            disabled={this.disabled || this.current === this.pageCount}
          >
            <page-last-icon />
          </div>
        ) : null}
        {/* 跳转 */}
        {this.showJumper ? (
          <div class={this.jumperClass}>
            {this.t(this.global.jumpTo)}
            <t-input-number
              class={this.jumperInputClass}
              v-model={this.jumpIndex}
              onBlur={this.onJumperChange}
              onEnter={this.onJumperChange}
              max={this.pageCount}
              min={min}
              size={this.size}
              theme="normal"
              placeholder=""
            />
            {this.t(this.global.page)}
          </div>
        ) : null}
      </div>
    );
  },
});
