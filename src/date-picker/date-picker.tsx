import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CalendarIcon, TimeIcon } from 'tdesign-icons-vue';
import { prefix } from '../config';
import props from './props';
import { TdDatePickerProps } from './type';
import CLASSNAMES from '../utils/classnames';
import { Button as TButton } from '../button';
import { Input as TInput } from '../input';
import TPopup from '../popup';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DatePickerConfig } from '../config-provider/config-receiver';
import CalendarPresets from './calendar-presets';
import TDate from './panel/date';
import TDateRange from './panel/date-range';
import TTimePickerPanel from '../time-picker/panel';
import { EPickerCols } from '../time-picker/interface';
import { firstUpperCase, extractTimeFormat } from '../_common/js/date-picker/utils';
import { TimePickerPanelInstance } from '../time-picker';
import { DatePickerInstance, DateValue, PickContext } from './interface';
import { renderTNodeJSX } from '../utils/render-tnode';
import { ClassName } from '../common';

dayjs.extend(isBetween);

const name = `${prefix}-date-picker`;

export default mixins(
  getConfigReceiverMixins<TdDatePickerProps & DatePickerInstance, DatePickerConfig>('datePicker'),
).extend({
  name: 'TDatePicker',
  components: {
    CalendarIcon,
    TimeIcon,
    TPopup,
    TButton,
    TInput,
    CalendarPresets,
    TDate,
    TDateRange,
    TTimePickerPanel,
  },
  props: {
    ...props,
  },
  data() {
    return {
      tempValue: '',
      monthDate: new Date(),
      start: new Date(),
      end: new Date(),
      selectedDates: [],
      inSelection: false,
      inline: false,
      dateFormat: '',
      multiSeparator: ',',
      inlineView: false,
      showTime: false,
      isOpen: false,
      // 表单控制禁用态时的变量
      formDisabled: undefined,
      startTimeValue: dayjs(),
      endTimeValue: dayjs(),
    };
  },
  computed: {
    inputListeners(): any {
      return {
        ...this.$listeners,
        focus: this.onNativeFocus,
        input: this.onNativeInput,
        click: this.onClick,
      };
    },
    startText(): string {
      return this.formatDate(this.start);
    },
    endText(): string {
      return this.formatDate(this.end);
    },
    formattedValue: {
      get(): DateValue {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm: any = this;
        const {
          tempValue, range, mode, isOpen, startText, endText, global, value: outValue,
        } = vm;
        const selectedDates = vm.getDates(outValue);
        const selectedFmtDates: string[] = selectedDates.map((d: Date) => vm.formatDate(d));

        if (tempValue) {
          return tempValue;
        }

        const strMode: string = range ? 'range' : mode;
        let value = '';

        switch (strMode) {
          case 'time':
          case 'date':
          case 'month':
          case 'year':
            value = selectedFmtDates.join('');
            break;
          case 'range':
            if (isOpen) {
              value = [startText, endText].join(global.rangeSeparator);
            } else if (selectedFmtDates.length > 1) {
              value = [selectedFmtDates[0], selectedFmtDates[1]].join(global.rangeSeparator);
            }
            break;
        }

        return value;
      },
      set(value: dayjs.ConfigType) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm: any = this;
        const { min, dateFormat } = vm;

        if (value) {
          if (String(value).length >= String(vm.formatDate(min || new Date())).length && dayjs(value, dateFormat)) {
            vm.tempValue = '';
            vm.setDate(value, true);
          } else {
            vm.tempValue = value;
          }
        }
      },
    },
    rangeText: {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm = this;
        let range = vm.startText;
        if (vm.range) {
          range += ` ${vm.global.rangeSeparator} ${vm.endText}`;
        }
        return range;
      },
      set(value) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm: any = this;
        if (vm.value) {
          vm.setDate(value, false);
        }
      },
    },
    min(): Date {
      const disableDate: any = this.disableDate || {};
      const { before } = disableDate;
      return before ? new Date(before) : null;
    },
    max(): Date {
      const disableDate: any = this.disableDate || {};
      const { after } = disableDate;
      return after ? new Date(after) : null;
    },
    classes(): ClassName {
      return [
        name,
        CLASSNAMES.SIZE[this.size] || '',
        {
          [`${name}--month-picker`]: this.mode === 'year' || this.mode === 'month',
          [`${prefix}-inline`]: this.inline || this.inlineView,
        },
      ];
    },
    pickerStyles(): ClassName {
      return {
        [`${name}__container`]: true,
        [`${name}-picker--open`]: this.isOpen || this.inlineView,
        [`${name}--calendar-inline-view`]: this.inlineView,
        [`${name}--range`]: this.range,
      };
    },
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
  },
  mounted() {
    this.attachDatePicker();
  },
  methods: {
    handleTInputFocus() {
      // TODO: 待改成select-input后删除
      // hack 在input聚焦时马上blur 避免出现输入光标
      this.$nextTick(() => {
        (this.$refs.native as HTMLInputElement).blur();
      });
    },
    handleTimePick(col: EPickerCols, time: number, index: number) {
      if (!this.range || index === 0) {
        const start = new Date(this.start);
        start[`set${firstUpperCase(col)}s`](time);
        this.start = start;
        this.startTimeValue = dayjs(start);
        this.dateClick(new Date(start));
      } else {
        const end = new Date(this.end);
        end[`set${firstUpperCase(col)}s`](time);
        this.end = end;
        this.endTimeValue = dayjs(end);
        this.dateClick(new Date(end));
      }
    },
    attachDatePicker(): any {
      const startDate: Date = new Date();
      const endDate: Date = new Date();
      this.dateFormat = this.format || this.global.format;
      const start = new Date(startDate);
      let end = new Date(endDate);
      if (!this.range) {
        // ignore endDate for not range DatePicker
        end = new Date(startDate);
      }
      this.start = start;
      this.end = end;
      const val = this.value || this.defaultValue || '';
      this.setDate(val, false);
      if (this.inlineView) {
        this.open();
      }
    },
    /**
     * Watch for value changed by date-picker itself and notify parent component
     *
     * @param event
     */
    onNativeInput(event?: any): void {
      const val: any = event.target.value;
      this.formattedValue = val;
      const d1: any = this.parseDate(val);

      if (d1 instanceof Date) {
        const d2: string = this.formatDate(d1);
        this.$emit('input', d2);
      }
    },
    onNativeFocus(event?: MouseEvent): void {
      if (!this.isOpen) {
        this.open();
      }
      this.$emit('focus', event);
    },
    onClick(event?: MouseEvent): void {
      if (!this.isOpen) {
        this.open();
      }
      this.$emit('click', event);
    },

    normalizeDateTime(value: Date, oldValue: Date): Date {
      const newDate = dayjs(value);
      const oldDate = dayjs(oldValue);
      if (this.enableTimePicker) {
        newDate.hour(oldDate.hour());
        newDate.minute(oldDate.minute());
        newDate.second(oldDate.second());
        newDate.millisecond(oldDate.millisecond());
      }

      return newDate.toDate();
    },

    dateClick(value: Date) {
      let mode = this.range ? 'range' : this.mode;

      if (this.showTime) {
        mode = 'time';
      }

      switch (mode) {
        case 'time':
          this.selectedDates = this.range ? [this.start, this.end] : [value];
          this.clickedApply(false);
          break;
        case 'year':
        case 'month':
        case 'date':
          this.start = this.normalizeDateTime(value, this.start);
          this.selectedDates = [this.start];
          // 有时间选择时，点击日期不关闭弹窗
          this.clickedApply(!this.enableTimePicker);
          break;
        case 'range':
          if (this.inSelection) {
            this.inSelection = false;
            this.start = this.normalizeDateTime(value[0], this.end);
            this.end = this.normalizeDateTime(value[1], this.end);

            if (this.end < this.start) {
              this.inSelection = true;
              this.start = this.normalizeDateTime(value[0], this.start);
            }
          } else {
            this.start = this.normalizeDateTime(value[0], this.start);
            this.end = this.normalizeDateTime(value[1], this.end);
            this.inSelection = true;
          }

          // 有时间选择时，点击日期不关闭弹窗
          this.clickedApply(!this.enableTimePicker);
          break;
      }
    },
    toggle() {
      if (!this.tDisabled) {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }
    },
    open() {
      if (!this.tDisabled) {
        const { formattedValue } = this;
        // set default value;
        if (formattedValue) {
          this.setDate(formattedValue);
        }
        this.tempValue = '';
        // open
        this.isOpen = true;
        this.$nextTick(() => {
          this.$emit('open', this.selectedDates);
        });
      }
    },
    close() {
      if (!this.tDisabled) {
        this.tempValue = '';
        this.isOpen = false;
        this.showTime = false;
        this.$emit('close', this.selectedDates);
      }
    },
    clickedApply(closePicker = true): void {
      if (this.range) {
        this.selectedDates = [this.start, this.end];
      }

      const selectedDates = this.selectedDates.map((d: Date) => {
        const fd = this.formatDate(d);
        return fd;
      });
      // submit format date
      this.submitInput(selectedDates, true);
      this.$emit('onChange', selectedDates);

      if (closePicker) {
        this.close();
      }
    },
    toggleTime() {
      this.startTimeValue = dayjs(this.start);
      this.endTimeValue = dayjs(this.end);

      this.showTime = !this.showTime;
      this.$nextTick(() => {
        const timePickerPanel = this.$refs.timePickerPanel as TimePickerPanelInstance;
        timePickerPanel && timePickerPanel.panelColUpdate();
      });
    },

    clickAway() {
      if (this.isOpen) {
        // reset start and end
        const { selectedDates } = this;
        if (selectedDates.length > 1) {
          this.start = new Date(selectedDates[0]);
          this.end = new Date(selectedDates[1]);
        }
        this.close();
      }
    },
    clickRange(value: DateValue) {
      if (Array.isArray(value)) {
        const [start, end] = value as dayjs.ConfigType[];
        this.start = dayjs(start).toDate();
        this.end = dayjs(end || start).toDate();
        this.monthDate = dayjs(start).toDate();
      } else {
        this.start = dayjs(value).toDate();
        this.end = dayjs(value).toDate();
        this.monthDate = dayjs(value).toDate();
      }
      this.clickedApply();
    },
    clear(triggerChange = false): void {
      // close picker
      this.close();

      // set value
      if (!this.tDisabled) {
        const selectedDates: any[] = [];
        this.selectedDates = selectedDates;
        this.formattedValue = '';
        this.start = new Date();
        this.end = new Date();
        this.submitInput(selectedDates, triggerChange);
      }
    },
    submitInput(selectedDates: any[], triggerChange = true) {
      const { multiSeparator } = this;
      const mode = this.range ? 'range' : this.mode;

      switch (mode) {
        case 'date':
        case 'month':
        case 'year':
          if (triggerChange) {
            this.$emit('input', selectedDates.join(multiSeparator));
            this.$emit('change', selectedDates.join(multiSeparator));
          }
          break;
        case 'range':
          if (triggerChange) {
            this.$emit('input', selectedDates);
            this.$emit('change', selectedDates);
          }
          break;
      }
    },
    parseDate(value: any = '', format = ''): Date | boolean {
      if (value instanceof Date) {
        return new Date(value);
      }
      if (format) {
        const oDate: dayjs.Dayjs = dayjs(value, format);
        if (oDate.isValid()) {
          return new Date(oDate.toDate());
        }
        return false;
      }

      const d2: dayjs.Dayjs = dayjs(value);
      if (d2.isValid()) {
        return new Date(d2.toDate());
      }
      return false;
    },
    isEnabled(value: Date): boolean {
      const {
        min, max, disableDate, dateFormat,
      } = this;
      if (!disableDate) {
        return true;
      }
      let isEnabled = true;
      // 值类型为 Function 则表示返回值为 true 的日期会被禁用
      if (typeof disableDate === 'function') {
        return !disableDate(value);
      }

      // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
      if (Array.isArray(disableDate)) {
        let isIncludes = false;
        const formattedDisabledDate = disableDate.map((item: string) => dayjs(item, dateFormat));
        formattedDisabledDate.forEach((item) => {
          if (item.isSame(dayjs(value))) {
            isIncludes = true;
          }
        });
        return !isIncludes;
      }

      // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
      const { from, to } = disableDate;
      if (from && to) {
        const compareMin = dayjs(new Date(from));
        const compareMax = dayjs(new Date(to));

        return !dayjs(value).isBetween(compareMin, compareMax, this.mode, '[]');
      }

      // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
      if (max && min) {
        const compareMin = dayjs(new Date(min));
        const compareMax = dayjs(new Date(max));

        isEnabled = dayjs(value).isBetween(compareMin, compareMax, this.mode, '[]');
      } else if (min) {
        const compareMin = dayjs(new Date(min));
        isEnabled = !dayjs(value).isBefore(compareMin, this.mode);
      } else if (max) {
        const compareMax = dayjs(new Date(max));
        isEnabled = !dayjs(value).isAfter(compareMax, this.mode);
      }
      return isEnabled;
    },
    setDate(inputDate: any = '', triggerChange = false): void {
      if ((inputDate !== 0 && !inputDate) || (inputDate instanceof Array && inputDate.length === 0)) {
        return this.clear(triggerChange);
      }

      const selectedDates = this.getDates(inputDate);

      this.selectedDates = selectedDates;
      if (selectedDates.length > 0) {
        const [start, end] = selectedDates;
        this.start = start;
        this.end = end || start;
      }
    },
    getDates(inputDate: any = ''): Date[] {
      if ((inputDate !== 0 && !inputDate) || (inputDate instanceof Array && inputDate.length === 0)) {
        return [];
      }

      const format = this.dateFormat || '';

      let dates: any[] = [];
      if (inputDate instanceof Array) {
        dates = inputDate.map((d) => {
          const d1 = this.parseDate(d, format);
          return d1;
        });
      } else if (inputDate instanceof Date || typeof inputDate === 'number') {
        dates = [this.parseDate(inputDate, format)];
      } else if (typeof inputDate === 'string') {
        const mode = this.range ? 'range' : this.mode;

        switch (mode) {
          case 'date':
          case 'month':
          case 'year':
            dates = [this.parseDate(inputDate, format)];
            break;

          case 'range':
            dates = inputDate.split(this.global.rangeSeparator || '-').map((d) => {
              const d1 = this.parseDate(d, format);
              return d1;
            });

            break;

          default:
            break;
        }
      }
      const selectedDates = dates.filter((d) => {
        const isEnable = d instanceof Date && this.isEnabled(d);
        return isEnable;
      });
      selectedDates.sort((a, b) => a.getTime() - b.getTime());

      return selectedDates;
    },
    formatDate(date: Date, format = ''): string {
      let dateFormat = format || this.dateFormat || this.global.format;
      const arrTime = ['H', 'h', 'm', 's'];
      const hasTime = arrTime.some((f) => String(dateFormat).includes(f));
      if (this.enableTimePicker && !hasTime) {
        dateFormat = [dateFormat, 'HH:mm:ss'].join(' ');
      }
      const d1 = new Date(date);
      return dayjs(d1).format(dateFormat);
    },
    getPlaceholderText() {
      const { placeholder, mode } = this;
      let placeholderStr = placeholder || this.global?.placeholder?.[mode];
      if (placeholder && Array.isArray(placeholder)) {
        placeholderStr = placeholder.join(this.global.rangeSeparator);
      }
      return placeholderStr;
    },
    onPopupVisibleChange(
      visible: boolean,
      context: {
        trigger: string;
      },
    ) {
      if (context.trigger === 'document') {
        this.toggle();
      }
    },
  },
  render() {
    const {
      popupProps,
      tDisabled,
      clearable,
      allowInput,
      size,
      inputProps,
      enableTimePicker,
      mode,
      range,
      presets,
      firstDayOfWeek,
    } = this;
    const {
      start, end, showTime, startTimeValue, global, isOpen, endTimeValue,
    } = this;
    const panelProps = {
      value: range ? [start, end] : start,
      mode,
      firstDayOfWeek: firstDayOfWeek === undefined ? 1 : firstDayOfWeek,
      disableDate: (d: Date) => !this.isEnabled(d),
      onChange: this.dateClick,
      global: this.global,
    };

    const onPick = (date: DateValue, context: PickContext) => {
      this.$emit('pick', date, context);
    };

    const panelComponent = range ? (
      <TDateRange {...{ props: { ...panelProps, onPick } }} />
    ) : (
      <TDate {...{ props: { ...panelProps } }} />
    );

    const popupContent = () => (
      <div ref="dropdownPopup" class={this.pickerStyles}>
        {enableTimePicker && showTime && (
          <div>
            <t-time-picker-panel
              ref="timePickerPanel"
              format={extractTimeFormat(this.dateFormat) || 'HH:mm:ss'}
              cols={[EPickerCols.hour, EPickerCols.minute, EPickerCols.second]}
              steps={[1, 1, 1]}
              value={!range ? [startTimeValue] : [startTimeValue, endTimeValue]}
              ontime-pick={this.handleTimePick}
              range
              isFooterDisplay={false}
            />
          </div>
        )}
        {!showTime && panelComponent}
        {(!!presets || enableTimePicker) && (
          <div class={`${prefix}-date-picker__footer`}>
            <calendar-presets
              presets={presets}
              global={global}
              {...{ props: { onClick: range ? this.clickRange : this.dateClick } }}
            />
            {enableTimePicker && (
              <div class={`${name}--apply`}>
                {enableTimePicker && (
                  <t-button theme="primary" variant="text" onClick={this.toggleTime}>
                    {showTime ? global.selectDate : global.selectTime}
                  </t-button>
                )}
                {
                  <t-button theme="primary" onClick={this.clickedApply}>
                    {global.confirm}
                  </t-button>
                }
              </div>
            )}
          </div>
        )}
      </div>
    );
    const inputClassNames = [
      `${prefix}-form-controls`,
      {
        [CLASSNAMES.STATUS.active]: this.isOpen,
      },
    ];
    const prefixIcon = renderTNodeJSX(this, 'prefixIcon');
    const suffixIconSlot = renderTNodeJSX(this, 'suffixIcon');
    const suffixIcon = () => {
      if (suffixIconSlot) {
        return suffixIconSlot;
      }
      if (enableTimePicker) {
        return <time-icon />;
      }
      return <calendar-icon />;
    };

    return (
      <div class={this.classes}>
        <t-popup
          ref="popup"
          class={`${name}__popup-reference`}
          trigger="click"
          placement="bottom-left"
          disabled={tDisabled}
          showArrow={false}
          visible={isOpen}
          popupProps={popupProps}
          overlayClassName={name}
          content={popupContent}
          expandAnimation={true}
          on={{ 'visible-change': this.onPopupVisibleChange }}
        >
          <div class={inputClassNames} onClick={this.toggle}>
            <t-input
              ref="native"
              v-model={this.formattedValue}
              disabled={tDisabled}
              clearable={clearable}
              placeholder={this.getPlaceholderText()}
              allowInput={allowInput ? 1 : 0}
              size={size}
              inputProps={inputProps}
              onClear={(context: { e: MouseEvent }) => {
                context.e.stopPropagation();
                this.clear(true);
              }}
              {...{ props: { ...this.inputListeners } }}
              prefixIcon={prefixIcon}
              suffixIcon={suffixIcon}
              onFocus={this.handleTInputFocus}
            />
          </div>
        </t-popup>
      </div>
    );
  },
});
