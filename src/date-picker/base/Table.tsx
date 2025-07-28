import { defineComponent, PropType, computed } from 'vue';
import { isArray } from 'lodash-es';
import TDatePickerCell from './Cell';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import type { TdDatePickerProps, DateMultipleValue } from '../type';
import { parseToDayjs } from '../../_common/js/date-picker/format';

export default defineComponent({
  name: 'TDatePickerTable',
  props: {
    mode: {
      type: String as PropType<TdDatePickerProps['mode']>,
      default: 'date',
    },
    firstDayOfWeek: Number,
    multiple: Boolean,
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
    const { weekdays, weekAbbreviation, dayjsLocale } = global.value;

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
    const weekRowClass = (value: any, targetValue: Date) => {
      if (props.mode !== 'week' || !value) return {};

      if (isArray(value)) {
        if (!value.length) return {};
        const [startObj, endObj] = value.map((v) => v && parseToDayjs(v, props.format));
        const startYear = startObj && startObj.year();
        const startWeek = startObj?.locale?.(dayjsLocale)?.week?.();
        const endYear = endObj && endObj.year();
        const endWeek = endObj?.locale?.(dayjsLocale)?.week?.();

        const targetObj = parseToDayjs(targetValue, props.format);
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
          parseToDayjs(value, props.format).locale(dayjsLocale).week()
          === parseToDayjs(targetValue, props.format).locale(dayjsLocale).week(),
      };
    };

    const multipleWeekRowClass = (value: DateMultipleValue, targetValue: Date) => {
      const targetDayjs = parseToDayjs(targetValue, props.format);
      if (props.mode !== 'week' || (Array.isArray(value) && !value.length)) return {};
      const isSomeYearWeek = value
        .map?.((v) => parseToDayjs(v, props.format))
        .some((item) => item.week() === targetDayjs.week() && item.year() === targetDayjs.year());
      return {
        [`${COMPONENT_NAME.value}-${props.mode}-row--active`]: isSomeYearWeek,
      };
    };

    const activeRowCss = props.multiple ? multipleWeekRowClass : weekRowClass;

    return {
      COMPONENT_NAME,
      weekArr,
      showThead,
      activeRowCss,
    };
  },
  render() {
    const {
      COMPONENT_NAME, weekArr, showThead, activeRowCss,
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
                  ...activeRowCss(this.value as any | DateMultipleValue[], row[0].value),
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
