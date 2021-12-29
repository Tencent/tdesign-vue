// 通用库
import dayjs from 'dayjs';
import Vue, { VNode, PropType } from 'vue';
import { prefix } from '../config';
// 组件的一些常量
import { COMPONENT_NAME } from './const';

// 组件相关的自定义类型
import { CalendarCell, TdCalendarProps } from './type';
import { renderTNodeJSXDefault, renderTNodeJSX } from '../utils/render-tnode';

const clickTypeEmitEventMap = {
  click: 'click',
  dblclick: 'dblclick',
  contextmenu: 'rightclick',
};

export default Vue.extend({
  name: `${COMPONENT_NAME}-cell`,
  props: {
    item: {
      type: Object as PropType<CalendarCell>,
      default: (): CalendarCell => null,
    },
    theme: {
      type: String as PropType<TdCalendarProps['theme']>,
      default: (): string => null,
    },
    fillWithZero: {
      type: Boolean,
      default: undefined,
    },
    t: Function,
    global: Object,
    cell: Function as PropType<TdCalendarProps['cell']>,
  },
  computed: {
    allowSlot(): boolean {
      return this.theme === 'full';
    },
    disabled(): boolean {
      return this.item.mode === 'month' && this.item.belongTo !== 0;
    },
    valueDisplay(): string | number {
      if (this.item.mode === 'month') {
        const dateNum = this.item.date.getDate();
        const fillZero = dateNum < 10 && (this.fillWithZero ?? this.global.fillWithZero ?? true);
        return fillZero ? `0${dateNum}` : dateNum;
      }
      const map = this.t(this.global.cellMonth).split(',');
      return map[this.item.date.getMonth().toString()];
    },
    cellCls(): Record<string, any> {
      const {
        mode, date, formattedDate, isCurrent,
      } = this.item;
      const isNow = mode === 'year' ? new Date().getMonth() === date.getMonth() : formattedDate === dayjs().format('YYYY-MM-DD');
      return [
        `${prefix}-calendar__table-body-cell`,
        {
          [`${prefix}-is-disabled`]: this.disabled,
          [`${prefix}-is-checked`]: isCurrent,
          [`${prefix}-calendar__table-body-cell--now`]: isNow,
        },
      ];
    },
  },
  methods: {
    clickCell(e: MouseEvent) {
      if (this.disabled) return;
      this.$emit(clickTypeEmitEventMap[e.type], e);
    },
  },
  render(): VNode {
    const {
      item, cellCls, clickCell, valueDisplay, allowSlot,
    } = this;

    const defaultNode = () => (
      <span>
        <div class={`${prefix}-calendar__table-body-cell-display`}>{valueDisplay}</div>
        <div class={`${prefix}-calendar__table-body-cell-content`}>
          {allowSlot
            && renderTNodeJSX(this, 'cellAppend', {
              params: item,
            })}
        </div>
      </span>
    );

    return (
      item && (
        <div class={cellCls} onClick={clickCell} ondblclick={clickCell} onContextmenu={clickCell}>
          {typeof this.cell === 'function'
            ? this.cell(this.$createElement, item)
            : renderTNodeJSXDefault(this, 'cell', {
              defaultNode: defaultNode(),
              params: item,
            })}
        </div>
      )
    );
  },
});
