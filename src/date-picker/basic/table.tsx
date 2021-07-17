import Vue from 'vue';
import { prefix } from '../../config';
import TDatePickerCell from './cell';
import { Cell } from '../interface';

const name = `${prefix}-date-picker-table`;

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

export default Vue.extend({
  name,
  components: {
    TDatePickerCell,
  },
  props: {
    type: {
      type: String,
      default: 'day',
    },
    data: Array,
    firstDayOfWeek: Number,
    /**
     * 星期的显示名字，规定从星期一开始，实际显示顺序会根据 firstDayOfWeek 进行计算
     */
    dayNames: { type: Array, default: () => DAY_NAMES },
    onCellClick: { type: Function },
    onCellMouseEnter: { type: Function },
  },
  render() {
    const {
      type,
      data,
      onCellClick,
      onCellMouseEnter,
      firstDayOfWeek,
    } = this.$props;

    const weekArr = [];
    let wi = firstDayOfWeek;
    const len = DAY_NAMES.length;
    while (weekArr.length < len) {
      weekArr.push(DAY_NAMES[wi]);
      wi = (wi + len + 1) % len;
    }

    const panelClass = `t-date-${type}`;

    return (
      <div class={panelClass}>
        <table>
          {
            type === 'date' && (
              <thead>
                <tr>
                  {
                    weekArr.map((value: string, i: number) => (
                      <th key={i}>{value}</th>
                    ))
                  }
                </tr>
              </thead>
            )
          }
          <tbody>
            {
              data.map((row: Cell[], i: number) => (
                <tr key={i}>
                  {
                    row.map((col: Cell, j: number) => (
                      <t-date-picker-cell
                        {...{ props: { ...col, onClick: onCellClick, onMouseEnter: onCellMouseEnter } }}
                        key={j}
                      />
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  },
});
