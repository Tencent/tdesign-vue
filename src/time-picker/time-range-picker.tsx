import Vue, { VueConstructor } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { TimePickerInstance, TimeInputEvent, InputTime, TimeInputType } from './type';
import { prefix } from '../config';
import RenderComponent from '../utils/render-component';
import CLASSNAMES from '../utils/classnames';
import PickerPanel from './panel';
import Input from './input';
import TIconTime from '../icon/time';
import TIconClose from '../icon/close';
import { clickOut } from '../utils/dom';
import props from '../../types/time-range-picker/props';

import { EPickerCols, pmList, amList } from './constant';

const name = `${prefix}-time-picker`;

dayjs.extend(customParseFormat);

export default (Vue as VueConstructor<TimePickerInstance>).extend({
  name: `${prefix}-time-range-picker`,

  components: {
    RenderComponent,
    PickerPanel,
    TIconTime,
    TIconClose,
  },

  props: { ...props },

  data() {
    // 初始化数据
    return {
      els: [],
      focus: false,
      isShowPanel: false,
      // 时间对象
      time: [undefined, undefined],
      // 初始值转input展示对象
      inputTime: [undefined, undefined],
    };
  },

  computed: {
    // 传递给选择面板的时间值
    panelValue(): Array<dayjs.Dayjs> {
      const time = this.time || [undefined, undefined];
      return time.map((val: dayjs.Dayjs) => (val ? dayjs(val) : dayjs()));
    },
    textClassName(): string {
      const isDefault = (this.inputTime as any).some((item: InputTime) => !!item.hour && !!item.minute && !!item.second);
      return isDefault ? '' : `${name}__group-text`;
    },
    // 是否展示清空按钮
    clearVisible(): boolean {
      // 如果可以展示清空按钮并且时间值为空
      return this.clearable && this.time.every(time => time);
    },
  },

  watch: {
    value: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
        const values = Array.isArray(this.value) ? this.value : [];
        const { format } = this;
        function getVal(value: string | undefined) {
          return value ? dayjs(value, format) : undefined;
        }
        const dayjsList = [getVal(values[0]), getVal(values[1])];
        this.time = dayjsList;
        this.updateInputTime();
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.initEvent(this.$el);
  },

  methods: {
    initEvent(el: Element) {
      this.els.push(el);
      if (this.els.length > 1) {
        clickOut(this.els, () => {
          this.isShowPanel = false;
        });
      }
    },
    getPanelDom(el: Element) {
      this.initEvent(el);
    },
    // input外框
    handlerClickInput() {
      if (this.disabled) {
        return;
      }
      this.isShowPanel = true;
    },
    // 输入变化
    inputChange(data: TimeInputEvent, index: number) {
      const { type, value } = data;
      let newTime = this.time[index];
      if (value === -1) {
        // 特殊标识，需要清空input
        this.inputTime[index][type] = undefined;
        // 需要重置该类型时间
        newTime[type](0);
        return;
      }
      if (!newTime) {
        // 默认值不存在
        newTime = dayjs();
        newTime.hour(0);
        newTime.minute(0);
        newTime.second(0);
      }
      // 设置时间
      newTime = newTime.set(type, value);
      // 生成变动

      this.time[index] = dayjs(newTime);
      // 转化展示数据
      this.updateInputTime();
    },
    // 输入失焦，赋值默认
    inputBlurDefault(type: TimeInputType, index: number) {
      this.inputTime[index][type] = '00';
    },
    // 面板展示隐藏
    panelVisibleChange(val: boolean) {
      if (val) return this.$emit('open');
      this.$emit('close');
    },
    // 切换上下午
    toggleInputMeridian(index: number) {
      const curTime = this.time[index];
      const current = curTime.format('a');
      const currentHour = curTime.hours() + (current === 'am' ? 12 : -12);
      // 时间变动
      this.inputChange(
        {
          type: 'hour',
          value: currentHour,
        },
        index,
      );
    },
    // 选中时间发生变动
    pickTime(col: EPickerCols, change: string | number, index: number, value: Record<string, any>) {
      const {
        $data: { time },
      } = this;
      let _setTime = time[index];
      if ([EPickerCols.hour, EPickerCols.minute, EPickerCols.second].includes(col)) {
        // 时分秒 dayjs hour minute second api变动时间
        _setTime = value.set(col, change);
      } else {
        // 当前上下午
        let currentHour = value.hour();
        // 上下午
        if (amList.includes(change as string)) {
          // 上午
          currentHour -= 12;
        } else if (pmList.includes(change as string)) {
          // 下午
          currentHour += 12;
        }
        _setTime = value.hour(currentHour);
      }
      this.time[index] = _setTime;
      this.updateInputTime();
    },
    // 确定按钮
    makeSure() {
      this.isShowPanel = false;
    },
    // 设置输入框展示
    updateInputTime() {
      const {
        $props: { format },
      } = this;
      const disPlayValues: Array<InputTime> = [];
      (this.time || []).forEach((time: dayjs.Dayjs | undefined) => {
        if (!time) {
          disPlayValues.push({
            hour: undefined,
            minute: undefined,
            second: undefined,
            meridian: 'am',
          });
        } else {
          let hour: number | string = time.hour();
          let minute: number | string = time.minute();
          let second: number | string = time.second();
          // 判断12小时制上下午显示问题
          if (/[h]{1}/.test(format)) {
            hour %= 12;
          }
          // 判定是否补齐小于10
          if (/[h|H]{2}/.test(format)) {
            hour = hour < 10 ? `0${hour}` : hour;
          }
          if (/[m|M]{2}/.test(format)) {
            minute = minute < 10 ? `0${minute}` : minute;
          }
          if (/[s|S]{2}/.test(format)) {
            second = second < 10 ? `0${second}` : second;
          }
          disPlayValues.push({
            hour,
            minute,
            second,
            meridian: time.format('a'),
          });
        }
      });
      this.inputTime = disPlayValues;
      this.triggleUpdateValue();
    },
    // 清除选中
    clear() {
      if (this.clearVisible) {
        this.time = [undefined, undefined];
        this.updateInputTime();
      }
    },
    triggleUpdateValue() {
      const values: Array<any> = [];
      this.time.forEach((time) => {
        if (time) {
          values.push(time.format(this.format));
        }
      });
      this.$emit('change', values);
    },
    renderInputItem() {
      return (
        <Input
          size={this.size}
          dayjs={this.inputTime}
          format={this.format}
          allowInput={this.allowInput}
          placeholder={this.placeholder}
          isRangePicker
          onToggleMeridian={(index: number) => this.toggleInputMeridian(index)}
          onBlurDefault={(type: TimeInputType, index: number) => this.inputBlurDefault(type, index)}
          onChange={(e: TimeInputEvent, index: number) => this.inputChange(e, index)}
        ></Input>
      );
    },
    renderInput() {
      const inputClassName = [`${name}__group`];
      if (this.disabled) {
        inputClassName.push('disabled');
        inputClassName.push(`${name}__input-disabled`);
      }
      if (this.isShowPanel) {
        inputClassName.push('active');
      }
      return (
        <div class={inputClassName} onClick={this.handlerClickInput}>
          {this.renderInputItem()}
        </div>
      );
    },
  },

  render() {
    // 初始化数据
    const {
      $props: { size, className },
    } = this;
    // 样式类名
    const classes = [name, CLASSNAMES.SIZE[size], className];

    return (
      <span class={classes} ref="timePickerReference">
        {this.renderInput()}
        <PickerPanel
          ref="panel"
          format={this.format}
          dayjs={this.panelValue}
          disabled={this.disabled}
          isShowPanel={this.isShowPanel}
          ondom={this.getPanelDom}
          ontime-pick={this.pickTime}
          onsure={this.makeSure}
          onvisible-change={this.panelVisibleChange}
          steps={this.steps}
          hideDisabledTime={this.hideDisabledTime}
          disableTime={this.disableTime}
          refDom={this.$refs.timePickerReference}
          isFocus={this.focus}
        />
        {
          <span class={[`${name}__icon-wrap`]} onClick={this.clear}>
            {this.clearVisible ? (
              <t-icon-close class={[`${name}__icon`, `${name}__icon-clear`]} size={this.size} />
            ) : (
              <t-icon-time
                class={[`${name}__icon`, `${name}__icon-time`, `${name}__icon-time-show`]}
                size={this.size}
              />
            )}
          </span>
        }
      </span>
    );
  },
});
