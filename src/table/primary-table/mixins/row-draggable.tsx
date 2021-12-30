import Vue from 'vue';
import { MoveIcon } from 'tdesign-icons-vue';
import { DataType, TdPrimaryTableProps } from '../../type';
import { prefix } from '../../../config';
import { emitEvent } from '../../../utils/event';

export interface RowDragEventArgs {
  index: number;
  row: any;
  targetElm: HTMLElement;
}

export default Vue.extend({
  name: `${prefix}-primary-table-row-draggable`,
  data() {
    return {
      draggingRowCurrentIndex: -1,
      currentRowData: null,
    };
  },
  computed: {
    dragging(): boolean {
      return this.draggingRowCurrentIndex !== -1;
    },
  },
  methods: {
    getMoveColColumns(columns: TdPrimaryTableProps['columns']): TdPrimaryTableProps['columns'] {
      columns.unshift({
        colKey: 'move-icon',
        title: '',
        width: 50,
        cell: () => <MoveIcon />,
        attrs: {
          'data-colkey': 'move-icon',
        },
      });
      return columns;
    },
    onDragStart({ index, row }: RowDragEventArgs) {
      this.draggingRowCurrentIndex = index;
      this.currentRowData = row;
      this.addDragEndListener();
    },
    onDragOver({ index: overIndex, row, targetElm }: RowDragEventArgs) {
      // target行在过渡时（即有v-move）触发了dragover事件，无需处理交换;
      if ([...targetElm.classList].includes('v-move')) return;

      const { draggingRowCurrentIndex } = this;
      if (draggingRowCurrentIndex === -1 || draggingRowCurrentIndex === overIndex) return;

      this.emitChange(this.currentRowData, row, draggingRowCurrentIndex, overIndex);
      this.draggingRowCurrentIndex = overIndex;
    },
    addDragEndListener() {
      const onDragEnd = () => {
        this.draggingRowCurrentIndex = -1;
        document.removeEventListener('dragend', onDragEnd);
      };
      document.addEventListener('dragend', onDragEnd);
    },
    emitChange(current: DataType, target: DataType, currentIndex: number, targetIndex: number) {
      emitEvent<Parameters<TdPrimaryTableProps['onDragSort']>>(this, 'drag-sort', {
        current,
        target,
        currentIndex,
        targetIndex,
      });
    },
  },
});
