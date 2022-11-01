// 通用库
import dayjs from 'dayjs';
import { VNode, PropType } from 'vue';
// 组件的一些常量

// 组件相关的自定义类型
import { CalendarCell, TdCalendarProps } from './type';
import { renderTNodeJSXDefault, renderTNodeJSX } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import { getClassPrefixMixins } from '../config-provider/config-receiver';

const classPrefixMixins = getClassPrefixMixins('calendar');

const clickTypeEmitEventMap = {
  click: 'click',
  dblclick: 'dblclick',
  contextmenu: 'rightclick',
};

export default mixins(classPrefixMixins).extend({
  name: 'TCalendarCell',
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
        `${this.componentName}__table-body-cell`,
        {
          [`${this.classPrefix}-is-disabled`]: this.disabled,
          [`${this.classPrefix}-is-checked`]: isCurrent,
          [`${this.componentName}__table-body-cell--now`]: isNow,
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

    const defaultNode = () => {
      const cellContentOuterDomStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      };
      return (
        // 由于vue2的限制，这里需要一个实体dom。
        <div style={cellContentOuterDomStyle}>
          <div class={`${this.componentName}__table-body-cell-display`}>{valueDisplay}</div>
          <div class={`${this.componentName}__table-body-cell-content`}>
            {allowSlot
              && renderTNodeJSX(this, 'cellAppend', {
                params: item,
              })}
          </div>
        </div>
      );
    };

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
