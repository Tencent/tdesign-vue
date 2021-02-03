import Vue, { VueConstructor } from 'vue';
import moment from 'moment';
import { TimePickerPanelColInstance } from '../type';
import { panelColProps } from './props';
import { componentName, EPickerCols, zhList, enList, pmList } from '../constant';

import { prefix } from '../../config';

const name = `${prefix}-time-picker-pane-col`;
const timeItemHeight = 40;
const middleGapHeight = 20;

export default (Vue as VueConstructor<TimePickerPanelColInstance>).extend({
  name,
  data() {
    return {
      currentMiddle: 0,
      splitValue: Object.create(null),
    };
  },
  props: panelColProps(),
  watch: {
    value(newMVal: moment.Moment) {
      const newH = newMVal.get('hour');
      const newM = newMVal.get('minute');
      const newS = newMVal.get('second');
      this.scrollToTime(EPickerCols.hour, newH, 'smooth');
      this.scrollToTime(EPickerCols.minute, newM, 'smooth');
      this.scrollToTime(EPickerCols.second, newS, 'smooth');
      const meridianZH = this.isPm ? zhList[1] : zhList[0];
      const meridianEN = this.isPm ? enList[1] : enList[0];
      this.scrollToTime(EPickerCols.zh, meridianZH, 'smooth');
      this.scrollToTime(EPickerCols.en, meridianEN, 'smooth');
    },
  },
  computed: {
    valStr() {
      // 这里的操作会修改数据，所以不能使用value直接格式化，否则出现loop update的问题
      // 需要生成一个新的时间对象
      return moment(this.value).locale('en')
        .format('a HH:mm:ss');
    },
    isPm() {
      return moment.localeData().isPM(this.valStr);
    },
  },
  methods: {
    generateColTime(col: EPickerCols): Array<number | string> {
      let res;
      let count: number;
      switch (col) {
        case EPickerCols.en:
          res = enList;
          break;
        case EPickerCols.hour:
          count = (/[h]{1}/.test(this.format)) ? 11 : 23;
          res = this.generateTimeList(count, Number(this.steps[0]));
          break;
        case EPickerCols.minute:
          count = 59;
          res = this.generateTimeList(count, Number(this.steps[1]));
          break;
        case EPickerCols.second:
          count = 59;
          res = this.generateTimeList(count, Number(this.steps[2]));
          break;
        case EPickerCols.zh:
          res = zhList;
          break;
      }
      return res;
    },
    generateTimeList(num: number, step: number) {
      const res = [];
      let count = num;
      while (count >= 0) {
        if (!(/[h]{1}/.test(this.format)) && count < 10) {
          res.push(`0${count}`);
        } else {
          res.push(count);
        }
        count -= step;
      }
      return res.reverse();
    },
    scrollToTime(col: EPickerCols, time: number | string, behavior: ScrollBehavior = 'auto') {
      let timeIndex: number;
      if (col === EPickerCols.en) {
        timeIndex = enList.indexOf(time as string);
      } else if (col === EPickerCols.zh) {
        timeIndex = zhList.indexOf(time as string);
      } else {
        timeIndex = Number(time);
        if (col === EPickerCols.hour && (/[h]{1}/.test(this.format))) {
          timeIndex %= 12;
        }
      }
      const distance = this.calcScrollYDistance(timeIndex);
      const scroller = this.$refs[`${col}_scroller`] as Element;
      if (!distance || !scroller) return;
      if (scroller.scrollTop === distance) return;
      // TODO: IE
      scroller.scrollTo({
        top: distance,
        behavior,
      });
    },
    initTimeScrollPos() {
      this.cols.forEach((col: EPickerCols) => {
        this.scrollToTime(col, this.splitValue[col]);
      });
    },
    generateColRows(col: EPickerCols) {
      return this.generateColTime(col)
        .map((el: number | string) => {
          const isCurrent = this.isCurrent(col, el);
          if (isCurrent) {
            this.splitValue[col] = el;
          }
          const classNames = [
            `${componentName}-panel__body-scroll-item`,
            this.timeItemCanUsed(col, el) ? '' : `${prefix}-is-disabled`,
            isCurrent ? `${prefix}-is-current` : '',
            !this.timeItemCanUsed(col, el) && this.hideDisabledTime ? `${prefix}-is-hidden` : '',
          ];
          return <li class={classNames} onclick={(e: MouseEvent) => this.handletTimeItemClick(e, col, el)}>{el}</li>;
        });
    },
    handletTimeItemClick(e: MouseEvent, col: EPickerCols, time: number | string) {
      const canUse = this.timeItemCanUsed(col, time);
      if (canUse) {
        this.scrollToTime(col, time, 'smooth');
        this.$emit('time-pick', col, time);
      }
    },
    calcScrollYDistance(index: number): number {
      return (index * timeItemHeight) + ((timeItemHeight - middleGapHeight) / 2);
    },
    /**
     * 判断是否是当前时间
     * @param col
     * @param colItem
     */
    isCurrent(col: EPickerCols, colItem: string | number) {
      let colVal;
      switch (col) {
        case EPickerCols.zh:
        case EPickerCols.en:
          return this.isPm === pmList.includes(colItem as string);
        case EPickerCols.hour:
        case EPickerCols.minute:
        case EPickerCols.second:
          colVal = this.value.get(col);
          // 处理使用 12 小时制，但是获取的 hour 超过12的问题
          if (col === EPickerCols.hour && (/[h]{1}/.test(this.format))) {
            colVal %= 12;
          }
          return colVal === Number(colItem);
      }
    },
    /**
     * 时间是否可用
     * @param col
     * @param time
     */
    timeItemCanUsed(col: EPickerCols, time: string | number): boolean {
      const [start, end] = this.range;
      const startIsPm = start && moment.localeData().isPM(start.format());
      const endIsPm = end && moment.localeData().isPM(end.format());
      const newH = Number(this.value.get('hour'));
      const newM = Number(this.value.get('minute'));
      const newS = Number(this.value.get('second'));
      let timeTmp;
      switch (col) {
        case EPickerCols.en:
        case EPickerCols.zh:
          timeTmp = pmList.includes(time as string);
          if (endIsPm === false && timeTmp) return false;
          if (startIsPm === false && !timeTmp) return false;
          break;
        case EPickerCols.hour:
          timeTmp = Number(time);
          if (this.disableTime && this.disableTime(timeTmp, newM, newS)) {
            return false;
          }
          break;
        case EPickerCols.minute:
          timeTmp = Number(time);
          if (this.disableTime && this.disableTime(newH, timeTmp, newS)) {
            return false;
          }
          break;
        case EPickerCols.second:
          timeTmp = Number(time);
          if (this.disableTime && this.disableTime(newH, newM, timeTmp)) {
            return false;
          }
          break;
      }
      return true;
    },
    renderScrollers() {
      return this.cols.map(col => this.renderScroller(col));
    },
    renderScroller(col: EPickerCols) {
      return <ul class={`${componentName}-panel__body-scroll`} ref={`${col}_scroller`}>
        {
          this.generateColRows(col)
        }
      </ul>;
    },
  },
  render() {
    return <div class={`${componentName}-panel__body`}>
      {
        this.renderScrollers()
      }
    </div>;
  },
});
