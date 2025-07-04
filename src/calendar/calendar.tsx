import Vue from 'vue';
// 通用库
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { CalendarConfig } from '../config-provider/config-receiver';
import * as utils from './utils';
import { emitEvent } from '../utils/event';
import { getIEVersion } from '../_common/js/utils/helper';

// 组件的一些常量
import {
  MIN_YEAR, FIRST_MONTH_OF_YEAR, LAST_MONTH_OF_YEAR, DEFAULT_YEAR_CELL_NUMINROW,
} from './const';

// 子组件
import { Select as TSelect, Option as TOption } from '../select';
import { RadioGroup as TRadioGroup, RadioButton as TRadioButton } from '../radio';
import { Button as TButton } from '../button';
import { CheckTag as TCheckTag } from '../tag';
import CalendarCellItem from './calendar-cell';
import RenderComponent from '../utils/render-component';
import { renderTNodeJSX, renderTNodeJSXDefault } from '../utils/render-tnode';

import {
  CalendarData,
  CalendarRange,
  YearMonthOption,
  ModeOption,
  CellColHeader,
  CellEventOption,
  TextConfigType,
  CalendarWeek,
  WeekDay,
  TdCalendarProps,
  ControllerOptions,
  CalendarCell,
} from './interface';

dayjs.extend(calendar);

const createDefaultCurDate = (): dayjs.Dayjs => dayjs(dayjs().format('YYYY-MM-DD'));

const getDefaultControllerConfigData = (visible = true): Record<string, any> => ({
  visible, // 是否显示（全部控件）
  disabled: false, // 是否禁用（全部控件）
  // 模式切换单选组件设置
  mode: {
    visible: true, // 是否显示
    radioGroupProps: {}, // 用于透传props给该radioGroup组件
  },
  // 年份选择框组件相关设置
  year: {
    visible: true, // 是否显示
    selectProps: {}, // 用于透传props给该select组件
  },
  // 年份选择框组件相关设置
  month: {
    visible: true, // 是否显示（“year”模式下本身是不显示该组件的）
    selectProps: {}, // 用于透传props给该select组件
  },
  // 隐藏\显示周末按钮组件相关设置
  weekend: {
    visible: true, // 是否显示
    showWeekendButtonProps: {}, // 用于透传props给显示周末按钮组件
    hideWeekendButtonProps: {}, // 用于透传props给隐藏周末按钮组件
  },
  // “今天\本月”按钮组件相关设置
  current: {
    visible: true, // 是否显示
    currentDayButtonProps: {}, // 用于透传props给“今天”钮组件（“month”模式下有效）
    currentMonthButtonProps: {}, // 用于透传props给“本月”按钮组件（“year”模式下有效）
  },
});

// 组件逻辑
export default mixins(getConfigReceiverMixins<Vue, CalendarConfig>('calendar')).extend({
  name: 'TCalendar',
  components: {
    TCheckTag,
    TSelect,
    TOption,
    TRadioGroup,
    TRadioButton,
    TButton,
    CalendarCellItem,
    RenderComponent,
  },
  props: { ...props },
  data(): CalendarData {
    return {
      realFirstDayOfWeek: 1,
      curDate: null,
      curDateList: [],
      curSelectedYear: null,
      curSelectedMonth: null,
      curSelectedMode: null,
      isShowWeekend: true,
      controlSize: 'medium',
    };
  },
  computed: {
    state(): CalendarData {
      return this.$data as CalendarData;
    },
    props(): TdCalendarProps {
      return this.$props as TdCalendarProps;
    },
    TEXT_MAP(): TextConfigType {
      const { t, global } = this;
      const r: TextConfigType = {
        // showWeekend: '显示周末',
        showWeekend: t(global.showWeekend),
        // hideWeekend: '隐藏周末',
        hideWeekend: t(global.hideWeekend),
        // today: '今天',
        today: t(global.today),
        // thisMonth: '本月',
        thisMonth: t(global.thisMonth),
      };
      return r;
    },
    weekDipalyText(): TdCalendarProps['week'] {
      return this.week || this.t(this.global.week).split(',');
    },
    // 组件最外层的class名（除去前缀，class名和theme参数一致）
    calendarCls(): Record<string, any> {
      return [`${this.componentName}`, `${this.componentName}--${this.theme}`];
    },

    calendarPanelCls(): Record<string, any> {
      return [`${this.componentName}__panel`, `${this.componentName}__panel--${this.curSelectedMode}`];
    },

    isWeekRender(): boolean {
      return typeof this.week === 'function';
    },

    rangeFromTo(): CalendarRange {
      if (!this.range || this.range.length < 2) {
        return null;
      }
      const [v1, v2] = this.range;
      if (dayjs(v1).isBefore(dayjs(v2))) {
        return {
          from: v1,
          to: v2,
        };
      }
      return {
        from: v2,
        to: v1,
      };
    },

    controllerOptions(): ControllerOptions {
      const dayJsFilterDate: dayjs.Dayjs = dayjs(`${this.curSelectedYear}-${this.curSelectedMonth}`);
      const re = {
        isShowWeekend: this.isShowWeekend,
        filterDate: dayJsFilterDate.toDate(),
        formattedFilterDate: dayJsFilterDate.format(this.format),
        mode: this.curSelectedMode,
      };
      return re;
    },

    // 日历主体头部（日历模式下使用）
    cellColHeaders(): CellColHeader[] {
      const re: CellColHeader[] = [];
      const min: WeekDay = 1;
      const max: WeekDay = 7;

      for (let i = this.realFirstDayOfWeek; i <= max; i++) {
        re.push({
          num: i as WeekDay,
          display: this.getWeekDisplay(i),
        });
      }
      if (this.realFirstDayOfWeek > min) {
        for (let i = min; i < this.realFirstDayOfWeek; i++) {
          re.push({
            num: i as WeekDay,
            display: this.getWeekDisplay(i),
          });
        }
      }
      return re;
    },

    // 年份下拉框数据源
    yearSelectOptionList(): YearMonthOption[] {
      const re: YearMonthOption[] = [];
      let begin: number = this.curSelectedYear - 10;
      let end: number = this.curSelectedYear + 10;
      if (this.rangeFromTo && this.rangeFromTo.from && this.rangeFromTo.to) {
        begin = dayjs(this.rangeFromTo.from).year();
        end = dayjs(this.rangeFromTo.to).year();
      }

      if (begin < MIN_YEAR) {
        begin = MIN_YEAR;
      }
      if (end < MIN_YEAR) {
        end = MIN_YEAR;
      }

      for (let i = begin; i <= end; i++) {
        const disabled = this.checkMonthAndYearSelectorDisabled(i, this.curSelectedMonth);
        re.push({
          value: i,
          label: this.t(this.global.yearSelection, { year: i }),
          disabled,
        });
      }
      return re;
    },
    // 月份下拉框数据源
    monthSelectOptionList(): YearMonthOption[] {
      const re: YearMonthOption[] = [];
      for (let i = FIRST_MONTH_OF_YEAR; i <= LAST_MONTH_OF_YEAR; i++) {
        const disabled = this.checkMonthAndYearSelectorDisabled(this.curSelectedYear, i);
        re.push({
          value: i,
          label: this.t(this.global.monthSelection, { month: i }),
          disabled,
        });
      }
      return re;
    },

    // 模式选项数据源
    modeSelectOptionList(): ModeOption[] {
      return [
        { value: 'month', label: this.t(this.global.monthRadio) },
        { value: 'year', label: this.t(this.global.yearRadio) },
      ];
    },
    // month模式下日历单元格的数据
    monthCellsData(): CalendarCell[][] {
      const daysArr: CalendarCell[][] = utils.createMonthCellsData(this.props, this.state);
      return daysArr;
    },
    // year模式下日历单元格的数据
    yearCellsData(): CalendarCell[][] {
      const re: CalendarCell[][] = [];
      const monthsArr: CalendarCell[] = utils.createYearCellsData(this.props, this.state);
      const rowCount = Math.ceil(monthsArr.length / DEFAULT_YEAR_CELL_NUMINROW);
      let index = 0;
      for (let i = 1; i <= rowCount; i++) {
        const row: CalendarCell[] = [];
        for (let j = 1; j <= DEFAULT_YEAR_CELL_NUMINROW; j++) {
          row.push(monthsArr[index]);
          index += 1;
        }
        re.push(row);
      }
      return re;
    },

    controllerConfigData(): Record<string, any> {
      const controllerConfig = this.controllerConfig ?? this.global.controllerConfig ?? true;
      if (typeof controllerConfig === 'boolean') {
        return getDefaultControllerConfigData(controllerConfig);
      }
      return {
        ...getDefaultControllerConfigData(),
        ...controllerConfig,
      };
    },

    // 是否显示控件（整个右上角的所有控件）
    isControllerVisible(): boolean {
      return this.controllerConfigData && this.controllerConfigData.visible;
    },

    weekendBtnText(): string {
      return this.isShowWeekend ? this.TEXT_MAP.hideWeekend : this.TEXT_MAP.showWeekend;
    },
    weekendBtnVBind(): object {
      const c = this.controllerConfigData.weekend;
      return this.isShowWeekend ? c.hideWeekendButtonProps : c.showWeekendButtonProps;
    },

    currentBtnText(): string {
      return this.curSelectedMode === 'month' ? this.TEXT_MAP.today : this.TEXT_MAP.thisMonth;
    },
    currentBtnVBind(): object {
      const c = this.controllerConfigData.current;
      return this.curSelectedMode === 'month' ? c.currentDayButtonProps : c.currentMonthButtonProps;
    },

    isModeVisible(): boolean {
      return this.checkControllerVisible('mode');
    },
    isYearVisible(): boolean {
      return this.checkControllerVisible('year');
    },
    isMonthVisible(): boolean {
      return this.checkControllerVisible('month');
    },
    isWeekendToggleVisible(): boolean {
      return this.checkControllerVisible('weekend');
    },
    isCurrentBtnVisible(): boolean {
      return this.checkControllerVisible('current');
    },

    isModeDisabled(): boolean {
      return this.checkControllerDisabled('mode', 'radioGroupProps');
    },
    isYearDisabled(): boolean {
      return this.checkControllerDisabled('year', 'selectProps');
    },
    isMonthDisabled(): boolean {
      return this.checkControllerDisabled('month', 'selectProps');
    },
    isWeekendToggleDisabled(): boolean {
      const p = this.isShowWeekend ? 'hideWeekendButtonProps' : 'showWeekendButtonProps';
      return this.checkControllerDisabled('weekend', p);
    },
    isCurrentBtnDisabled(): boolean {
      const p = this.curSelectedMode === 'month' ? 'currentDayButtonProps' : 'currentMonthButtonProps';
      return this.checkControllerDisabled('current', p);
    },

    filterYearStr(): string {
      return `${this.controllerOptions.filterDate.getFullYear()}`;
    },
    filterMonthStr(): string {
      return `${this.controllerOptions.filterDate.getMonth() + 1}`;
    },
    filterYearMonth(): { month: string; year: string } {
      return {
        year: this.filterYearStr,
        month: this.filterMonthStr,
      };
    },
  },
  watch: {
    firstDayOfWeek: {
      handler() {
        this.realFirstDayOfWeek = this.firstDayOfWeek ?? this.global.firstDayOfWeek ?? 1;
      },
      immediate: true,
    },
    value: {
      handler(v: TdCalendarProps['value']) {
        if (this.multiple) {
          this.setCurrentDateList(v);
        } else {
          this.setCurrentDate(v);
        }
      },
      immediate: true,
    },
    year: {
      handler(v: TdCalendarProps['year']) {
        this.setCurSelectedYear(v);
      },
      immediate: true,
    },
    month: {
      handler(v: TdCalendarProps['month']) {
        this.setCurSelectedMonth(v);
      },
      immediate: true,
    },
    mode: {
      handler(v: TdCalendarProps['mode']) {
        this.curSelectedMode = v;
      },
      immediate: true,
    },
    isShowWeekendDefault: {
      handler(v: TdCalendarProps['isShowWeekendDefault']) {
        this.isShowWeekend = v;
      },
      immediate: true,
    },
    filterYearMonth: {
      handler(v: { month: string; year: string }) {
        emitEvent<Parameters<TdCalendarProps['onMonthChange']>>(this, 'month-change', v);
        this.controllerChange();
      },
    },
    curSelectedMode() {
      this.handleIE();
    },
    isShowWeekend() {
      this.handleIE();
    },
    isControllerVisible() {
      this.handleIE();
    },
    theme: {
      handler(v: TdCalendarProps['theme']) {
        if (v === 'card') this.controlSize = 'small';
        if (v === 'full') this.controlSize = 'medium';
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleIE();
  },
  methods: {
    handleIE() {
      if (getIEVersion() <= 9) {
        this.$nextTick(() => {
          const element = this.$el.children[this.isControllerVisible ? 1 : 0];
          if (this.curSelectedMode === 'month') {
            element.setAttribute('is-show-weekend', `${this.isShowWeekend}`);
          } else {
            element.removeAttribute('is-show-weekend');
          }
        });
      }
    },
    getCalendarWeekSlotData(item: CellColHeader): CalendarWeek {
      return {
        day: item.num,
      };
    },
    getWeekDisplay(weekNum: number): string {
      const weekText = this.weekDipalyText;
      return typeof weekText === 'object' && weekText[weekNum - 1] ? weekText[weekNum - 1] : utils.getDayCn(weekNum);
    },
    checkMonthCellItemShowed(cellData: CalendarCell): boolean {
      return this.isShowWeekend || cellData.day < 6;
    },
    createCalendarCell(cellData: CalendarCell): CalendarCell {
      return {
        ...cellData,
        ...this.controllerOptions,
      };
    },
    clickCell(e: MouseEvent, cellData: CalendarCell) {
      const d = dayjs(cellData.date);
      if (this.multiple) {
        if (this.curDateList.find((item) => item.isSame(d))) {
          this.curDateList = this.curDateList.filter((item) => item.isSame(d));
        } else {
          this.curDateList.push(d);
        }
      } else {
        this.curDate = d;
      }
      const options = this.getCellClickEventOptions(e, cellData);
      emitEvent<Parameters<TdCalendarProps['onCellClick']>>(this, 'cell-click', options);
    },
    doubleClickCell(e: MouseEvent, cellData: CalendarCell) {
      const options = this.getCellClickEventOptions(e, cellData);
      emitEvent<Parameters<TdCalendarProps['onCellDoubleClick']>>(this, 'cell-double-click', options);
    },
    rightClickCell(e: MouseEvent, cellData: CalendarCell) {
      if (this.preventCellContextmenu) {
        e.preventDefault();
      }
      const options = this.getCellClickEventOptions(e, cellData);
      emitEvent<Parameters<TdCalendarProps['onCellRightClick']>>(this, 'cell-right-click', options);
    },
    getCellClickEventOptions(e: MouseEvent, cellData: CalendarCell): CellEventOption {
      return {
        cell: this.createCalendarCell(cellData),
        e,
      };
    },
    controllerChange(): void {
      const options = this.controllerOptions;
      emitEvent<Parameters<TdCalendarProps['onControllerChange']>>(this, 'controller-change', options);
    },
    onWeekendToggleClick(): void {
      this.isShowWeekend = !this.isShowWeekend;
      this.controllerChange();
    },
    // 判断月历单元格头是否显示
    checkMonthCellColHeaderVisibled(item: CellColHeader): boolean {
      let re = true;
      if (!this.isShowWeekend) {
        re = item.num !== 6 && item.num !== 7;
      }
      return re;
    },
    // 判断某个控件是否禁用
    checkControllerDisabled(name: string, propsName: string): boolean {
      let re = false;
      const conf = this.controllerConfigData;
      if (conf && (conf.disabled || (conf[name] && conf[name][propsName] && conf[name][propsName].disabled))) {
        re = true;
      }
      return re;
    },
    // 判断某个控件是否显示
    checkControllerVisible(name: string): boolean {
      let re = true;
      const conf = this.controllerConfigData;
      if (!conf || !conf.visible || conf[name] === false || (conf[name] && !conf[name].visible)) {
        re = false;
      }
      return re;
    },
    // 回到“今天”
    toToday(): void {
      const currentSelectDate = createDefaultCurDate();
      this.curSelectedYear = currentSelectDate.year();
      this.curSelectedMonth = parseInt(currentSelectDate.format('M'), 10);
    },
    setCurSelectedYear(year?: TdCalendarProps['year']) {
      const curSelectedYear = year ? parseInt(`${year}`, 10) : createDefaultCurDate().year();
      if (!isNaN(curSelectedYear) && curSelectedYear > 0) {
        this.curSelectedYear = curSelectedYear;
      }
    },
    setCurSelectedMonth(month?: TdCalendarProps['month']) {
      const curSelectedMonth = month ? parseInt(`${month}`, 10) : parseInt(createDefaultCurDate().format('M'), 10);
      if (!isNaN(curSelectedMonth) && curSelectedMonth > 0 && curSelectedMonth <= 12) {
        this.curSelectedMonth = curSelectedMonth;
      }
    },
    setCurrentDate(value?: TdCalendarProps['value']): void {
      if (Array.isArray(value)) {
        this.curDate = value && value.length ? dayjs(value[0]) : createDefaultCurDate();
      } else {
        this.curDate = value ? dayjs(value) : createDefaultCurDate();
      }
    },
    setCurrentDateList(value?: TdCalendarProps['value']): void {
      if (Array.isArray(value)) {
        this.curDateList = value && value.length ? value.map((item) => dayjs(item)) : [createDefaultCurDate()];
      } else {
        this.curDateList = value ? [dayjs(value)] : [createDefaultCurDate()];
      }
    },
    checkMonthAndYearSelectorDisabled(year: number, month: number): boolean {
      let disabled = false;
      if (this.rangeFromTo && this.rangeFromTo.from && this.rangeFromTo.to) {
        const beginYear = dayjs(this.rangeFromTo.from).year();
        const endYear = dayjs(this.rangeFromTo.to).year();
        if (year === beginYear) {
          const beginMon = parseInt(dayjs(this.rangeFromTo.from).format('M'), 10);
          disabled = month < beginMon;
        } else if (year === endYear) {
          const endMon = parseInt(dayjs(this.rangeFromTo.to).format('M'), 10);
          disabled = month > endMon;
        }
      }
      return disabled;
    },
    renderControl() {
      const { controllerOptions } = this;
      return (
        <div class={`${this.componentName}__control`}>
          <div class={`${this.componentName}__title`}>
            {renderTNodeJSX(this, 'head', {
              params: controllerOptions,
            })}
          </div>
          <div class={`${this.componentName}__control-section`}>
            {this.isYearVisible && (
              <div class={`${this.componentName}__control-section-cell`}>
                <t-select
                  v-model={this.curSelectedYear}
                  size={this.controlSize}
                  disabled={this.isYearDisabled}
                  autoWidth={true}
                  props={{ ...this.controllerConfigData.year.selectProps }}
                >
                  {this.yearSelectOptionList.map((item) => (
                    <t-option key={item.value} value={item.value} label={item.label} disabled={item.disabled}>
                      {item.label}
                    </t-option>
                  ))}
                </t-select>
              </div>
            )}
            {this.curSelectedMode === 'month' && this.isMonthVisible && (
              <div class={`${this.componentName}__control-section-cell`}>
                <t-select
                  v-model={this.curSelectedMonth}
                  size={this.controlSize}
                  disabled={this.isMonthDisabled}
                  autoWidth={true}
                  props={{ ...this.controllerConfigData.month.selectProps }}
                >
                  {this.monthSelectOptionList.map((item) => (
                    <t-option key={item.value} value={item.value} label={item.label} disabled={item.disabled}>
                      {item.label}
                    </t-option>
                  ))}
                </t-select>
              </div>
            )}
            {this.isModeVisible && (
              <div class={`${this.componentName}__control-section-cell`} style="height: auto">
                <t-radio-group
                  v-model={this.curSelectedMode}
                  variant="default-filled"
                  size={this.controlSize}
                  disabled={this.isModeDisabled}
                  props={{ ...this.controllerConfigData.mode.radioGroupProps }}
                  onChange={this.controllerChange}
                >
                  {this.modeSelectOptionList.map((item) => (
                    <t-radio-button key={item.value} value={item.value}>
                      {item.label}
                    </t-radio-button>
                  ))}
                </t-radio-group>
              </div>
            )}
            {this.theme === 'full' && this.curSelectedMode === 'month' && this.isWeekendToggleVisible && (
              <div class={`${this.componentName}__control-section-cell`}>
                <t-check-tag
                  class={`${this.componentName}__control-tag`}
                  defaultChecked={!this.isShowWeekend}
                  disabled={this.isWeekendToggleDisabled}
                  onClick={this.onWeekendToggleClick}
                  size="large"
                  props={{ ...this.weekendBtnVBind }}
                >
                  {this.weekendBtnText}
                </t-check-tag>
              </div>
            )}
            {this.theme === 'full' && this.isCurrentBtnVisible && (
              <div class={`${this.componentName}__control-section-cell`}>
                <t-button
                  size={this.controlSize}
                  disabled={this.isCurrentBtnDisabled}
                  onClick={() => {
                    this.toToday();
                  }}
                  props={{ ...this.currentBtnVBind }}
                >
                  {this.currentBtnText}
                </t-button>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  render() {
    const {
      calendarCls, calendarPanelCls, isControllerVisible, cellColHeaders, checkMonthCellColHeaderVisibled,
    } = this;

    const monthBody = () => (
      <table class={`${this.componentName}__table`}>
        <thead class={`${this.componentName}__table-head`}>
          <tr class={`${this.componentName}__table-head-row`}>
            {cellColHeaders.map(
              (item, index) => checkMonthCellColHeaderVisibled(item) && (
                  <th class={`${this.componentName}__table-head-cell`}>
                    {Array.isArray(this.week)
                      ? this.week[index]
                      : renderTNodeJSXDefault(this, 'week', {
                        defaultNode: <span>{item.display}</span>,
                        params: this.getCalendarWeekSlotData(item),
                      })}
                  </th>
              ),
            )}
          </tr>
        </thead>

        <tbody class={`${this.componentName}__table-body`}>
          {this.monthCellsData.map((week, weekIndex) => (
            <tr class={`${this.componentName}__table-body-row`}>
              {week.map(
                (item, itemIndex) => this.checkMonthCellItemShowed(item) && (
                    <calendar-cell-item
                      key={`d-${weekIndex}-${itemIndex}`}
                      item={item}
                      theme={this.theme}
                      t={this.t}
                      global={this.global}
                      cell={this.cell}
                      fillWithZero={this.fillWithZero}
                      onClick={(e: MouseEvent) => this.clickCell(e, item)}
                      onDblclick={(e: MouseEvent) => this.doubleClickCell(e, item)}
                      onRightclick={(e: MouseEvent) => this.rightClickCell(e, item)}
                      scopedSlots={{ ...this.$scopedSlots }}
                    ></calendar-cell-item>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );

    const yearBody = () => (
      <table class={`${this.componentName}__table`}>
        <tbody class={`${this.componentName}__table-body`}>
          {this.yearCellsData.map((cell, cellIndex) => (
            <tr class={`${this.componentName}__table-body-row`}>
              {cell.map((item, itemIndex) => (
                <calendar-cell-item
                  key={`m-${cellIndex}-${itemIndex}`}
                  item={item}
                  theme={this.theme}
                  t={this.t}
                  global={this.global}
                  cell={this.cell}
                  fillWithZero={this.fillWithZero}
                  onClick={(e: MouseEvent) => this.clickCell(e, item)}
                  onDblclick={(e: MouseEvent) => this.doubleClickCell(e, item)}
                  onRightclick={(e: MouseEvent) => this.rightClickCell(e, item)}
                  scopedSlots={{ ...this.$scopedSlots }}
                ></calendar-cell-item>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div class={calendarCls}>
        {isControllerVisible && this.renderControl()}
        <div class={calendarPanelCls}>{this.curSelectedMode === 'month' ? monthBody() : yearBody()}</div>
      </div>
    );
  },
});
