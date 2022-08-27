/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import affixVue from '@/src/table/_example/affix.vue';
import asyncLoadingVue from '@/src/table/_example/async-loading.vue';
import baseVue from '@/src/table/_example/base.vue';
import customCellVue from '@/src/table/_example/custom-cell.vue';
import customColButtonVue from '@/src/table/_example/custom-col-button.vue';
import customColVue from '@/src/table/_example/custom-col.vue';
import customFooterVue from '@/src/table/_example/custom-footer.vue';
import customHeaderVue from '@/src/table/_example/custom-header.vue';
import dataSortVue from '@/src/table/_example/data-sort.vue';
import dragColSortVue from '@/src/table/_example/drag-col-sort.vue';
import dragSortHandlerVue from '@/src/table/_example/drag-sort-handler.vue';
import dragSortVue from '@/src/table/_example/drag-sort.vue';
import editableCellVue from '@/src/table/_example/editable-cell.vue';
import editableRowVue from '@/src/table/_example/editable-row.vue';
import emptyVue from '@/src/table/_example/empty.vue';
import expandableVue from '@/src/table/_example/expandable.vue';
import filterControlledVue from '@/src/table/_example/filter-controlled.vue';
import fixedColumnVue from '@/src/table/_example/fixed-column.vue';
import fixedHeaderColVue from '@/src/table/_example/fixed-header-col.vue';
import fixedHeaderVue from '@/src/table/_example/fixed-header.vue';
import lazyVue from '@/src/table/_example/lazy.vue';
import loadingVue from '@/src/table/_example/loading.vue';
import mergeCellsVue from '@/src/table/_example/merge-cells.vue';
import multiHeaderVue from '@/src/table/_example/multi-header.vue';
import multipleSortVue from '@/src/table/_example/multiple-sort.vue';
import paginationAjaxVue from '@/src/table/_example/pagination-ajax.vue';
import paginationVue from '@/src/table/_example/pagination.vue';
import selectMultipleVue from '@/src/table/_example/select-multiple.vue';
import selectSingleVue from '@/src/table/_example/select-single.vue';
import showColumnsVue from '@/src/table/_example/show-columns.vue';
import singleSortVue from '@/src/table/_example/single-sort.vue';
import treeSelectVue from '@/src/table/_example/tree-select.vue';
import treeVue from '@/src/table/_example/tree.vue';

MockDate.set('2020-12-28');

const mapper = {
  affixVue,
  asyncLoadingVue,
  baseVue,
  customCellVue,
  customColButtonVue,
  customColVue,
  customFooterVue,
  customHeaderVue,
  dataSortVue,
  dragColSortVue,
  dragSortHandlerVue,
  dragSortVue,
  editableCellVue,
  editableRowVue,
  emptyVue,
  expandableVue,
  filterControlledVue,
  fixedColumnVue,
  fixedHeaderColVue,
  fixedHeaderVue,
  lazyVue,
  loadingVue,
  mergeCellsVue,
  multiHeaderVue,
  multipleSortVue,
  paginationAjaxVue,
  paginationVue,
  selectMultipleVue,
  selectSingleVue,
  showColumnsVue,
  singleSortVue,
  treeSelectVue,
  treeVue,
};

describe('Table', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Table ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
