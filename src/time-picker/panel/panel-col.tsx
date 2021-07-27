import Vue, { VueConstructor } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { TimePickerPanelColInstance } from '../interface';
import { panelColProps } from './props';
import { componentName, EPickerCols } from '../constant';

import { prefix } from '../../config';

const name = `${prefix}-time-picker-pane-col`;

dayjs.extend(customParseFormat);

export default (Vue as VueConstructor<TimePickerPanelColInstance>).extend({
  name,
  data() {
    return {
      splitValue: Object.create(null),
      timeArr: [EPickerCols.hour, EPickerCols.minute, EPickerCols.second],
    };
  },
  props: panelColProps(),
  computed: {
    valStr() {
      // 这里的操作会修改数据，所以不能使用value直接格式化，否则出现loop update的问题
      // 需要生成一个新的时间对象
      return dayjs(this.value, this.format).format(this.format);
    },
    isPm() {
      return dayjs(this.valStr, this.format).hour() >= 12;
    },
    currentTimes() {
      return [Number(this.value.get('hour')), Number(this.value.get('minute')), Number(this.value.get('second'))];
    },
    timeItemMargin() {
      const maskDom = this.$el?.querySelector?.(`.${componentName}-panel__body-active-mask > div`);
      return maskDom && parseInt(getComputedStyle(maskDom).margin, 10);
    },
  },
  methods: {
    getTimeItemHeight(col: EPickerCols): number {
      const cols = this.$refs[`${col}_scroller`] as Element;
      return cols.querySelector('li').offsetHeight;
    },
    generateColTime(col: EPickerCols): Array<number | string> {
      let res;
      let count: number;
      if (this.timeArr.includes(col)) {
        const colIdx = this.timeArr.indexOf(col);
        if (col === EPickerCols.hour) {
          count = /[h]{1}/.test(this.format) ? 11 : 23;
        } else {
          count = 59;
        }
        res = this.generateTimeList(count, Number(this.steps[colIdx]));
      } else {
        res = this.localeMeridiems;
      }
      return res;
    },
    generateTimeList(num: number, step: number) {
      const res = [];
      let count = num;
      while (count >= 0) {
        if (!/[h]{1}/.test(this.format) && count < 10) {
          res.push(`0${count}`);
        } else {
          res.push(count);
        }
        count -= step;
      }
      return res.reverse();
    },
    disableFilter(preIdx: number, col: EPickerCols) {
    // 如果有hideDisableTime 需要进行filter计算它的time(index)
      let filteredIdx = preIdx;
      if (this.hideDisabledTime && this.disableTime) {
        const timeList = this.generateColTime(col);
        const index = this.timeArr.indexOf(col);
        filteredIdx = timeList.filter((t) => {
          const params = this.currentTimes;
          params[index] = Number(t);
          return this.disableTime && !this.disableTime?.apply(this, params);
        }).indexOf(preIdx);
      }
      return filteredIdx;
    },
    calculateTimeIdx(time: number | string, step: number | string, type: EPickerCols): number {
      let timeIdx = time;
      timeIdx = this.disableFilter(Number(timeIdx), type);
      return Math.floor(Number(timeIdx) / Number(step));
    },
    // 处理滚动距离
    scrollToTime(col: EPickerCols, time: number | string, behavior: ScrollBehavior = 'auto') {
      let timeIndex: number;
      if (this.timeArr.includes(col)) {
        const colIdx = this.timeArr.indexOf(col);
        timeIndex = this.calculateTimeIdx(time, this.steps[colIdx], col);
        if (col === EPickerCols.hour && /[h]{1}/.test(this.format)) {
          timeIndex %= 12;
        }
      } else {
        timeIndex = this.localeMeridiems.indexOf((time as string).toUpperCase());
      }
      const timeItemTotalHeight = this.getTimeItemHeight(col) + this.timeItemMargin;
      const distance = (timeIndex * timeItemTotalHeight) + (timeItemTotalHeight / 2);
      const scroller = this.$refs[`${col}_scroller`] as Element;
      if (!distance || !scroller) return;
      if (scroller.scrollTop === distance) return;
      // TODO: IE
      scroller.scrollTo({
        top: distance,
        behavior,
      });
    },
    updateTimeScrollPos() {
      this.cols.forEach((col: EPickerCols) => {
        this.scrollToTime(col, this.splitValue[col]);
      });
    },
    generateColRows(col: EPickerCols) {
      return this.generateColTime(col).map((el: number | string) => {
        if (!this.timeItemCanUsed(col, el) && this.hideDisabledTime) return null;

        const isCurrent = this.isCurrent(col, el);
        if (isCurrent) {
          this.splitValue[col] = el;
        }
        const classNames = [
          `${componentName}-panel__body-scroll-item`,
          {
            [`${prefix}-is-disabled`]: !this.timeItemCanUsed(col, el),
            [`${prefix}-is-current`]: isCurrent,
          },
        ];
        return (
          <li class={classNames} onclick={(e: MouseEvent) => this.handleTimeItemClick(e, col, el)}>
            {el}
          </li>
        );
      });
    },
    handleTimeItemClick(_e: MouseEvent, col: EPickerCols, time: number | string) {
      const canUse = this.timeItemCanUsed(col, time);
      if (canUse) {
        this.scrollToTime(col, time, 'smooth');
        this.$emit('time-pick', col, time);
      }
    },
    isCurrent(col: EPickerCols, colItem: string | number) {
      let colVal;
      switch (col) {
        case EPickerCols.meridiem:
          return this.isPm === (colItem === this.localeMeridiems[1]);
        case EPickerCols.hour:
        case EPickerCols.minute:
        case EPickerCols.second:
          colVal = this.value.get(col);
          // 处理使用 12 小时制，但是获取的 hour 超过12的问题
          if (col === EPickerCols.hour && /[h]{1}/.test(this.format)) {
            colVal %= 12;
          }
          return colVal === Number(colItem);
      }
    },
    timeItemCanUsed(col: EPickerCols, time: string | number): boolean {
      if (this.timeArr.includes(col)) {
        const index = this.timeArr.indexOf(col);
        const params = this.currentTimes;
        params[index] = Number(time);
        return !(this.disableTime && this.disableTime?.apply(this, params));
      }
      return true;
    },
    renderScrollers() {
      return this.cols.map(col => this.renderScroller(col));
    },
    renderScroller(col: EPickerCols) {
      return (
        <ul
          class={`${componentName}-panel__body-scroll`}
          ref={`${col}_scroller`}
          onMousewheel={() => this.handleScroll(col)}
        >
          {this.generateColRows(col)}
        </ul>
      );
    },
    // 当存在大于1的step时 需要手动处理获取最近的step
    closestLookup(availableArr: Array<any>, calcVal: number, step: number) {
      if (step <= 1) return calcVal;
      return availableArr.sort((a, b) => Math.abs(calcVal + 1 - a) - Math.abs(calcVal + 1 - b))[0];
    },
    // 处理滚动选择时间
    handleScroll(col: EPickerCols) {
      let scrollVal: number|string;
      const cols = this.$refs[`${col}_scroller`] as Element;
      const availableList = this.generateColTime(col);
      const { scrollTop } = cols; // 当前滚动的高度;
      const itemHeight = this.getTimeItemHeight(col);

      if (this.timeArr.includes(col)) {
        // 处理时间相关col的滚动
        const colIdx = this.timeArr.indexOf(col);
        let max = 59;
        if (col === EPickerCols.hour) {
          max = /[h]{1}/.test(this.format) ? 11 : 23;
        }
        scrollVal = Math.min(Math.abs(Math.round(((scrollTop - (itemHeight / 2)) / (itemHeight + this.timeItemMargin)) * Number(this.steps[colIdx]))), max);
        scrollVal = this.closestLookup(availableList, scrollVal, Number(this.steps[colIdx]));
        if (this.disableTime && this.hideDisabledTime) {
          scrollVal = availableList.filter((t) => {
            const params = this.currentTimes;
            params[colIdx] = Number(t);
            return !this.disableTime?.apply(this, params);
          })[scrollVal] as number;
        }
      } else {
        // 处理非时间col的相关的滚动
        scrollVal = Math.min(Math.abs(Math.round((scrollTop - (itemHeight / 2)) / (itemHeight + this.timeItemMargin))), 1);
        scrollVal = this.localeMeridiems[scrollVal];
      }
      this.timeItemCanUsed(col, scrollVal) && this.$emit('time-pick', col, scrollVal);
    },
    renderActiveMask() {
      return (
        <div class={`${componentName}-panel__body-active-mask`}>
          {this.cols.map((_col, idx) => (
            <div key={idx} />
          ))}
        </div>
      );
    },
  },
  render() {
    return (
      <div class={`${componentName}-panel__body`}>
        {this.renderActiveMask()}
        {this.renderScrollers()}
      </div>
    );
  },
});
