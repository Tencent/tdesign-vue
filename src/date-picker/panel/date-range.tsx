import Vue, { PropType } from 'vue';
import dayjs from 'dayjs';
import TDateHeader from '../basic/header';
import TDateTable from '../basic/table';
import { DatePickerConfig } from '../../config-provider/config-receiver';
import {
  DateRangeData, DateRangeMethods, DateRangeComputed, DateRangeProps,
} from '../interface';
import { DateValue } from '../type';
import { prefix } from '../../config';

import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  isSame,
  getToday,
  firstUpperCase,
  setDateTime,
} from '../../_common/js/date-picker/utils';
import props from '../props';

const TODAY = getToday();
const LEFT = 'left';
const RIGHT = 'right';

export default Vue.extend<DateRangeData, DateRangeMethods, DateRangeComputed, DateRangeProps>({
  name: 'TDatePickerDateRange',
  components: {
    TDateHeader,
    TDateTable,
  },
  inheritAttrs: false,
  props: {
    global: {
      type: Object as PropType<DatePickerConfig>,
    },
    mode: {
      type: String,
      default: 'date',
      validator: (v: string) => ['year', 'month', 'date'].indexOf(v) > -1,
    },
    value: {
      type: Array,
      default: () => [TODAY, TODAY],
    },
    minDate: Date,
    maxDate: Date,
    firstDayOfWeek: props.firstDayOfWeek,
    disableDate: props.disableDate,
    onChange: props.onChange,
    onPick: Function,
  },
  data() {
    return {
      leftYear: null,
      leftMonth: null,
      rightMonth: null,
      rightYear: null,
      leftType: this.mode,
      rightType: this.mode,
      startValue: null,
      endValue: null,
      isFirstClick: true,
      firstClickValue: null,
    };
  },
  computed: {
    leftData() {
      return this.getData({
        year: this.leftYear,
        month: this.leftMonth,
        type: this.leftType,
      });
    },
    rightData() {
      return this.getData({
        year: this.rightYear,
        month: this.rightMonth,
        type: this.rightType,
      });
    },
  },
  watch: {
    value: {
      handler(value) {
        const [startValue = TODAY, endValue = TODAY] = value;
        this.startValue = startValue;
        this.endValue = endValue;
      },
      immediate: true,
    },
    mode(value) {
      this.leftType = value;
      this.rightType = value;
    },
  },
  created() {
    this.initialPicker();
  },
  beforeDestroy() {
    this.initialPicker();
  },
  methods: {
    initialPicker() {
      const data = this.getLeftAndRightDataFromValue(this.value);

      this.leftYear = data.leftYear;
      this.leftMonth = data.leftMonth;
      this.rightYear = data.rightYear;
      this.rightMonth = data.rightMonth;

      this.leftType = this.$props.mode;
      this.rightType = this.$props.mode;
      const [startValue, endValue] = this.$props.value;
      this.startValue = startValue;
      this.endValue = endValue;
      this.isFirstClick = true;
      this.firstClickValue = TODAY;
    },
    getLeftAndRightDataFromValue(value: any) {
      const [startValue = TODAY, endValue = TODAY] = value || this.value;
      const leftYear = startValue.getFullYear();
      const leftMonth = startValue.getMonth();
      let rightMonth = endValue.getMonth();
      let rightYear = endValue.getFullYear();

      if (this.mode === 'date' && isSame(startValue, endValue, 'month')) {
        const next = addMonth(endValue, 1);
        rightMonth = addMonth(endValue, 1).getMonth();
        rightYear = next.getFullYear();
      }

      if (this.mode === 'month' && isSame(startValue, endValue, 'year')) {
        rightYear = leftYear + 1;
      }

      if (this.mode === 'year' && isSame(startValue, endValue, 'year')) {
        rightYear = leftYear + 10;
      }

      return {
        leftYear,
        leftMonth,
        rightMonth,
        rightYear,
      };
    },
    getData({ year, month, type }) {
      const {
        disableDate, minDate, maxDate, startValue, endValue, firstDayOfWeek,
      } = this;
      let data;

      const start = startValue;
      const end = endValue;

      const options = {
        disableDate,
        minDate,
        maxDate,
        firstDayOfWeek,
        monthLocal: this.global?.months,
      };

      switch (type) {
        case 'date':
          data = getWeeks({ year, month }, options);
          break;
        case 'month':
          data = getMonths(year, options);
          break;
        case 'year':
          data = getYears(year, options);
          break;
        default:
          break;
      }

      return flagActive(data, { start, end, type });
    },
    getClickHandler(direction: string, date: DateValue, e: MouseEvent) {
      const type = this[`${direction}Type`];
      return this[`click${firstUpperCase(type)}`](date, e, direction);
    },
    clickHeader(flag: number, direction: string) {
      const year = this[`${direction}Year`];
      const month = this[`${direction}Month`];
      const type = this[`${direction}Type`];

      let monthCount;
      let next;
      switch (type) {
        case 'date':
          monthCount = 1;
          break;
        case 'month':
          monthCount = 12;
          break;
        case 'year':
          monthCount = 120;
      }

      const current = new Date(year, month);
      if (flag === 1) {
        next = addMonth(current, monthCount);
      } else if (flag === -1) {
        next = subtractMonth(current, monthCount);
      } else {
        next = new Date();
      }
      this[`${direction}Year`] = next.getFullYear();
      this[`${direction}Month`] = next.getMonth();
    },
    clickDate(date: Date, e: MouseEvent) {
      let partial = 'start';
      if (this.isFirstClick) {
        this.startValue = date;
        this.endValue = date;
        this.isFirstClick = false;
        this.firstClickValue = date;
      } else {
        if (dayjs(this.firstClickValue).isBefore(dayjs(date), 'day')) {
          this.endValue = date;
        } else {
          this.endValue = this.firstClickValue;
          this.startValue = date;
        }
        this.$props.onChange([setDateTime(this.startValue, 0, 0, 0), setDateTime(this.endValue, 23, 59, 59)]);
        this.isFirstClick = true;
        partial = 'end';
      }
      this.$props.onPick && this.$props.onPick(date, { e, partial });
    },
    clickYear(date: Date, e: MouseEvent, type: string) {
      if (this.mode === 'year') {
        if (this.isFirstClick) {
          this.startValue = date;
          this.isFirstClick = false;
          this.firstClickValue = date;
        } else {
          this.$props.onChange([this.startValue, this.endValue]);
          this.isFirstClick = true;
        }
      } else {
        this[`${type}Type`] = 'month';
        this[`${type}Year`] = date.getFullYear();
      }
    },
    clickMonth(date: Date, e: MouseEvent, type: string) {
      if (this.mode === 'month') {
        if (this.isFirstClick) {
          this.startValue = date;
          this.isFirstClick = false;
          this.firstClickValue = date;
        } else {
          if (this.endValue < this.startValue) {
            this.endValue = this.startValue;
          }
          this.$props.onChange([this.startValue, this.endValue]);
          this.isFirstClick = true;
        }
      } else {
        this[`${type}Type`] = 'date';
        this[`${type}Month`] = date.getMonth();
        this[`${type}Year`] = date.getFullYear();
      }
    },
    onMouseEnter(date: Date) {
      if (this.isFirstClick) {
        return;
      }

      if (this.firstClickValue.getTime() > date.getTime()) {
        this.startValue = date;
        this.endValue = this.firstClickValue;
      } else {
        this.startValue = this.firstClickValue;
        this.endValue = date;
      }
    },
    onTypeChange() {
      this.startValue = this.firstClickValue;
      this.endValue = this.firstClickValue;
    },
    handleTypeChange(direction: string, type: string) {
      this.$data[`${direction}Type`] = type;
    },
  },
  render() {
    const { leftType, rightType, firstDayOfWeek } = this;
    return (
      <div class={`${prefix}-date-picker__panels`}>
        <div class={`${prefix}-date-picker__panel`}>
          <t-date-header
            year={this.leftYear}
            month={this.leftMonth}
            type={leftType}
            {...{
              props: {
                onBtnClick: (flag: number) => this.clickHeader(flag, LEFT),
                onTypeChange: (type: string) => this.handleTypeChange(LEFT, type),
              },
            }}
          />
          <t-date-table
            type={leftType}
            first-day-of-week={firstDayOfWeek}
            data={this.leftData}
            {...{
              props: {
                onCellClick: (date: DateValue, e: MouseEvent) => this.getClickHandler(LEFT, date, e),
                onCellMouseEnter: this.onMouseEnter,
              },
            }}
          />
        </div>
        <div class={`${prefix}-date-picker__panel `}>
          <t-date-header
            year={this.rightYear}
            month={this.rightMonth}
            type={rightType}
            {...{
              props: {
                onBtnClick: (flag: number) => this.clickHeader(flag, RIGHT),
                onTypeChange: (type: string) => this.handleTypeChange(RIGHT, type),
              },
            }}
          />
          <t-date-table
            type={rightType}
            first-day-of-week={firstDayOfWeek}
            data={this.rightData}
            {...{
              on: { 'update:type': this.onTypeChange },
              props: {
                onCellClick: (date: DateValue, e: MouseEvent) => this.getClickHandler(RIGHT, date, e),
                onCellMouseEnter: this.onMouseEnter,
              },
            }}
          />
        </div>
      </div>
    );
  },
});
