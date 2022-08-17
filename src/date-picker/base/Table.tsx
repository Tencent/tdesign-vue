import { defineComponent, PropType, computed } from '@vue/composition-api';
import TDatePickerCell from './Cell';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import type { TdDatePickerProps } from '../type';
import { parseToDayjs } from '../hooks/useFormat';

export default defineComponent({
  name: 'TDatePickerTable',
  props: {
    mode: {
      type: String as PropType<TdDatePickerProps['mode']>,
      default: 'date',
    },
    firstDayOfWeek: Number,
    data: Array,
    time: String,
    value: [String, Number, Array, Date],
    format: String,
    onCellClick: Function,
    onCellMouseEnter: Function,
    onCellMouseLeave: Function,
  },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('date-picker__table');
    const { global } = useConfig('datePicker');
    const { weekdays, weekAbbreviation } = global.value;

    const weekArr = computed(() => {
      const _weekArr = [];
      let wi = props.firstDayOfWeek - 1;
      const len = weekdays.length;
      while (_weekArr.length < len) {
        _weekArr.push(weekdays[wi]);
        wi = (wi + len + 1) % len;
      }

      if (props.mode === 'week') _weekArr.unshift(weekAbbreviation);

      return _weekArr;
    });

    const showThead = computed(() => props.mode === 'date' || props.mode === 'week');

    // 高亮周区间
    const weekRowClass = (value: any, format: string, targetValue: Date) => {
      if (props.mode !== 'week') return {};

      if (Array.isArray(value)) {
        if (!value.length) return {};
        const [startObj, endObj] = value.map((v) => parseToDayjs(v, format));
        const startYear = startObj.year();
        const startWeek = startObj.week();
        const endYear = endObj && endObj.year();
        const endWeek = endObj && endObj.week();

        const targetObj = parseToDayjs(targetValue, format);
        const targetYear = targetObj.year();
        const targetWeek = targetObj.week();
        const isActive = (targetYear === startYear && targetWeek === startWeek) || (targetYear === endYear && targetWeek === endWeek);
        const isRange = targetYear >= startYear && targetYear <= endYear && targetWeek > startWeek && targetWeek < endWeek;
        return {
          // 同年同周
          [`${COMPONENT_NAME.value}-${props.mode}-row--active`]: isActive,
          [`${COMPONENT_NAME.value}-${props.mode}-row--range`]: isRange,
        };
      }

      return {
        [`${COMPONENT_NAME.value}-${props.mode}-row--active`]:
          parseToDayjs(value, format).week() === parseToDayjs(targetValue, format).week(),
      };
    };

    return {
      COMPONENT_NAME,
      weekArr,
      showThead,
      weekRowClass,
    };
  },
  render() {
    const {
      COMPONENT_NAME, weekArr, showThead, weekRowClass,
    } = this;

    return (
      <div class={COMPONENT_NAME} onMouseleave={(e: MouseEvent) => this.onCellMouseLeave?.({ e })}>
        <table>
          {showThead && (
            <thead>
              <tr>
                {weekArr.map((value: string, i: number) => (
                  <th key={i}>{value}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {this.data.map((row: Array<any>, i: number) => (
              <tr
                key={i}
                class={{
                  [`${COMPONENT_NAME}-${this.mode}-row`]: true,
                  ...weekRowClass(this.value, this.format, row[0].value),
                }}
              >
                {row.map((col: any, j: number) => (
                  <TDatePickerCell
                    key={j}
                    {...{
                      props: {
                        time: this.time,
                        onClick: this.onCellClick,
                        onMouseEnter: this.onCellMouseEnter,
                        ...col,
                      },
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
});
