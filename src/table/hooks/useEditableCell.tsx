import { CreateElement } from 'vue';
import { SetupContext } from '@vue/composition-api';
import {
  TableRowData, PrimaryTableCellParams, TdPrimaryTableProps, PrimaryTableCol,
} from '../type';
import EditableCell from '../editable-cell';

export default function useEditableCell(props: TdPrimaryTableProps, context: SetupContext) {
  const renderEditableCell = (
    h: CreateElement,
    p: PrimaryTableCellParams<TableRowData>,
    oldCell: PrimaryTableCol['cell'],
  ) => <EditableCell props={{ ...p }} oldCell={oldCell} scopedSlots={context.slots} />;

  return {
    renderEditableCell,
  };
}
