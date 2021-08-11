import Vue from 'vue';
import TDateHeader from '../basic/header';
import TDateTable from '../basic/table';
import {
  DateData, DateMethods, DateComputed, DateProps,
} from '../interface';

import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  getToday,
  firstUpperCase,
} from '../utils';

export default Vue.extend<DateData, DateMethods, DateComputed, DateProps>({
  name: 'TDatePanel',
  components: {
    TDateHeader,
    TDateTable,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: Date,
      default: () => getToday(),
    },
    mode: {
      type: String,
      default: 'date',
      validator: (v: string) => ['year', 'month', 'date'].indexOf(v) > -1,
    },
    minDate: Date,
    maxDate: Date,
    firstDayOfWeek: Number,
    disabledDate: Function,
    onChange: Function,
  },
  data() {
    return {
      year: this.$props.value.getFullYear(),
      month: this.$props.value.getMonth(),
      type: this.$props.mode,
    };
  },
  computed: {
    tableData() {
      const {
        year, month, type, value, mode, disabledDate, minDate, maxDate, firstDayOfWeek,
      } = this;
      let data;

      const options = {
        disabledDate,
        minDate,
        maxDate,
        firstDayOfWeek,
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
      const start = (type === 'date' || type === mode) ? value : new Date(year, month);
      return flagActive(data, { start, type });
    },
  },
  watch: {
    mode(value) {
      this.type = value;
    },
    value(value) {
      this.year = value.getFullYear();
      this.month = value.getMonth();
    },
  },
  methods: {
    getClickHandler(): Function {
      return this[`click${firstUpperCase(this.type)}`];
    },
    clickDate(date: Date) {
      this.$props.onChange(date);
    },
    clickMonth(date: Date) {
      if (this.mode === 'month') {
        this.$props.onChange(date);
      } else {
        this.$data.type = 'date';
        this.$data.year = date.getFullYear();
        this.$data.month = date.getMonth();
      }
    },
    clickYear(date: Date) {
      if (this.mode === 'year') {
        this.$props.onChange(date);
      } else {
        this.$data.type = 'month';
        this.$data.year = date.getFullYear();
      }
    },
    clickHeader(flag: number) {
      let monthCount = 0;
      let next = null;
      switch (this.$data.type) {
        case 'date':
          monthCount = 1;
          break;
        case 'month':
          monthCount = 12;
          break;
        case 'year':
          monthCount = 120;
      }

      const current = new Date(this.$data.year, this.$data.month);

      switch (flag) {
        case 1:
          next = addMonth(current, monthCount);
          break;
        case -1:
          next = subtractMonth(current, monthCount);
          break;
        case 0:
          next = new Date();
          break;
      }

      this.$data.year = next.getFullYear();
      this.$data.month = next.getMonth();
    },
    onTypeChange(type) {
      this.$data.type = type;
    },
  },
  render() {
    return (
      <div class="t-date">
        <t-date-header
           year={this.year}
           month={this.month}
           type={this.$data.type}
           {...{
             props: { onBtnClick: this.clickHeader, onTypeChange: this.onTypeChange },
           }}
        />

        <t-date-table
          type={this.$data.type}
          first-day-of-week={this.$props.firstDayOfWeek}
          data={this.tableData}
          {...{
            props: {
              onCellClick: this.getClickHandler(),
            },
          }}
        />
      </div>
    );
  },
});
