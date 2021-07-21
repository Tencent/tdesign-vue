<template>
  <div :class="paginationClass">
    <!--数据统计区-->
    <div v-if="totalContent" :class="totalClass">
      <slot name="totalContent">
        {{ t(locale.total, { total: total }) }}
      </slot>
    </div>
    <!-- select-->
    <template v-if="pageSizeOptions.length">
      <t-select :size="size" :value="pageSize" :disabled="disabled" :class="sizerClass" @change="onSelectorChange">
        <t-option
          v-for="(item, index) in sizeOptions"
          :value="item.value"
          :label="item.label"
          :key="index"
        >
        </t-option>
      </t-select>
    </template>
    <!-- 向前按钮-->
    <div :class="preBtnClass" @click="prevPage" :disabled="disabled || current === 1">
      <t-icon-chevron-left></t-icon-chevron-left>
    </div>
    <!-- 页数 -->
    <template v-if="!isSimple">
      <ul :class="btnWrapClass">
        <li :class="getButtonClass(1)" v-if="isFolded" @click="toPage(1)">1</li>
        <li
          :class="btnMoreClass"
          v-if="isFolded && isPrevMoreShow"
          @click="prevMorePage"
          @mouseover="prevMore = true"
          @mouseout="prevMore = false"
        >
          <template v-if="prevMore">
            <t-icon-chevron-left-double></t-icon-chevron-left-double>
          </template>
          <template v-else><t-icon-ellipsis></t-icon-ellipsis></template>
        </li>
        <li :class="getButtonClass(i)" v-for="i in pages" :key="i" @click="toPage(i)">
          {{ i }}
        </li>
        <li
          :class="btnMoreClass"
          v-if="isFolded && isNextMoreShow"
          @click="nextMorePage"
          @mouseover="nextMore = true"
          @mouseout="nextMore = false"
        >
          <template v-if="nextMore">
            <t-icon-chevron-right-double></t-icon-chevron-right-double>
          </template>
          <template v-else><t-icon-ellipsis></t-icon-ellipsis></template>
        </li>
        <li :class="getButtonClass(pageCount)" v-if="isFolded" @click="toPage(pageCount)">{{ pageCount }}</li>
      </ul>
    </template>
    <template v-else>
      <t-select
        :size="size"
        :value="current"
        :disabled="disabled"
        :class="simpleClass"
        @change="toPage"
      >
        <t-option
          v-for="item in pageCountOption"
          :value="item"
          :label="`${item}/${pageCount}`"
          :key="`${item}/${pageCount}`"
        />
      </t-select>
    </template>
    <!-- 向后按钮-->
    <div :class="nextBtnClass" @click="nextPage" :disabled="disabled || current === pageCount">
      <t-icon-chevron-right></t-icon-chevron-right>
    </div>
    <!-- 跳转-->
    <template v-if="showJumper">
      <div :class="jumperClass">
        {{ t(locale.jumpTo) }}
        <t-input :class="jumperInputClass" v-model="jumpIndex" @keydown.enter.native="jumpToPage" @blur="jumpToPage" />
        {{ t(locale.page) }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import config from '../config';
import mixins from '../utils/mixins';
import getLocalRecevierMixins from '../locale/local-receiver';
import TIconChevronLeft from '../icon/chevron-left';
import TIconChevronRight from '../icon/chevron-right';
import TIconChevronLeftDouble from '../icon/chevron-left-double';
import TIconChevronRightDouble from '../icon/chevron-right-double';
import TIconEllipsis from '../icon/ellipsis';
import TInput from '../input';
import { Select } from '../select';
import CLASSNAMES from '../utils/classnames';
import props from './props';
import { ClassName } from '../common';

const { prefix } = config;
const name = `${prefix}-pagination`;

const PaginationLocalReceiver = getLocalRecevierMixins('pagination');

export default mixins(PaginationLocalReceiver).extend({
  name,
  components: {
    TIconChevronLeft,
    TIconChevronRight,
    TIconChevronLeftDouble,
    TIconChevronRightDouble,
    TIconEllipsis,
    TInput,
    TSelect: Select,
  },
  model: {
    prop: 'current',
    event: 'current-change',
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
      jumpIndex: this.current,
      prevMore: false,
      nextMore: false,
    };
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
      return [
        `${name}__select`,
        // {
        //   [CLASSNAMES.STATUS.disabled]: this.disabled,
        // },
      ];
    },
    preBtnClass(): ClassName {
      return [
        `${name}__btn`,
        `${name}__btn--prev`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled || this.current === 1,
        },
      ];
    },
    nextBtnClass(): ClassName {
      return [
        `${name}__btn`,
        `${name}__btn--next`,
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
      return [
        `${name}__input`,
        // {
        //   [CLASSNAMES.STATUS.disabled]: this.disabled,
        // },
      ];
    },
    simpleClass(): ClassName {
      return [`${name}__select`];
    },
    isSimple(): boolean {
      return this.theme === 'simple';
    },
    pageCount(): number {
      const c: number = Math.ceil(this.total / this.pageSize);
      return c > 0 ? c : 1;
    },
    pageCountOption(): Array<number> {
      const ans = [];
      for (let i = 1; i <= this.pageCount; i++) {
        ans.push(i);
      }
      return ans;
    },
    sizeOptions(): Array<{ label: string; value: number }> {
      const options = this.pageSizeOptions.map(option => typeof option === 'object'
        ? option
        : {
          label: this.t(this.locale.itemsPerPage, { size: option }),
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
          start = this.isPrevMoreShow ? this.pageCount - this.foldedMaxPageBtn + 1 : 2;
          end = this.isPrevMoreShow ? this.pageCount - 1 : this.foldedMaxPageBtn;
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
  },
  methods: {
    toPage(pageIndex: number, isTriggerChange?: boolean) {
      if (this.disabled) {
        return;
      }
      let current = pageIndex;
      if (pageIndex < 1) {
        current = 1;
      } else if (pageIndex > this.pageCount) {
        current = this.pageCount;
      }
      if (this.current !== current) {
        const prev = this.current;
        this.jumpIndex = current;
        const pageInfo = {
          current,
          previous: prev,
          pageSize: this.pageSize,
        };
        if (isTriggerChange !== false) {
          this.$emit('change', pageInfo);
          if (typeof this.onChange === 'function') {
            this.onChange(pageInfo);
          }
        }
        this.$emit('update:current', current);
        this.$emit('current-change', current, pageInfo);
        if (typeof this.onCurrentChange === 'function') {
          this.onCurrentChange(current, pageInfo);
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
    jumpToPage(): void {
      const jumpIndex = Number(this.jumpIndex);
      if (isNaN(jumpIndex)) return;
      this.toPage(jumpIndex);
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
      this.$emit('update:pageSize', pageSize);
      this.$emit('page-size-change', pageSize, pageInfo);
      if (typeof this.onPageSizeChange === 'function') {
        this.onPageSizeChange(pageSize, pageInfo);
      }
      this.$emit('change', pageInfo);
      if (isIndexChange) {
        this.toPage(pageCount, false);
      }
    },
  },
});
</script>
