import Vue, { VueConstructor } from 'vue';
import dayjs from 'dayjs';
import isFunction from 'lodash/isFunction';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { TimePickerInstance, TimePickerPanelInstance, TimeInputEvent, InputTime, TimeInputType } from './type';
import { PopupVisibleChangeContext } from '../../types/popup/TdPopupProps';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import PickerPanel from './panel';
import TInput from '../input';
import TIconTime from '../icon/time';
import TPopup from '../popup';
import InputItems from './input-items';

import props from '../../types/time-picker/props';

import { EPickerCols, pmList, amList, EMPTY_VALUE, componentName, AM } from './constant';

const name = `${prefix}-time-picker`;

dayjs.extend(customParseFormat);

export default (Vue as VueConstructor<TimePickerInstance>).extend({
  name,

  components: {
    PickerPanel,
    TIconTime,
    TPopup,
    TInput,
    InputItems,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: { ...props },

  data() {
    const { defaultValue, value } = this.$props;
    // 初始化默认值
    const time = value || defaultValue;
    // 初始化数据
    return {
      els: [],
      focus: false,
      isShowPanel: false,
      // 时间对象
      time: time ? dayjs(time, this.format) : undefined,
      // 初始值转input展示对象
      inputTime: time ? this.setInputValue(dayjs(time, this.format)) : undefined,
      needClear: false,
    };
  },

  computed: {
    // 传递给选择面板的时间值
    panelValue(): Array<dayjs.Dayjs> {
      const {
        $data: { time },
      } = this;

      return time ? [dayjs(time, this.format)] : [dayjs()];
    },
    textClassName(): string {
      const isDefault = (this.inputTime as any).some((item: InputTime) => !!item.hour && !!item.minute && !!item.second);
      return isDefault ? '' : `${name}__group-text`;
    },
  },

  watch: {
    // 监听选中时间变动
    time: {
      handler() {
        this.output();
      },
    },
    value: {
      handler() {
        this.time = this.value ? dayjs(this.value, this.format) : undefined;
        this.inputTime = this.setInputValue(dayjs(this.value, this.format));
      },
    },
  },
  methods: {
    // 输入变化
    inputChange(data: TimeInputEvent) {
      const { type, value } = data;
      const {
        $data: {
          // 鉴别是range还是单picker
          time,
        },
      } = this;
      let newTime = time;
      if (value === EMPTY_VALUE) {
        // 特殊标识，需要清空input
        this.inputTime[type] = undefined;
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
      this.time = dayjs(newTime);
      // 转化展示数据
      this.inputTime = this.setInputValue(dayjs(newTime));
      const panelRef = this.$refs.panel as TimePickerPanelInstance;
      panelRef.panelColUpate();
    },
    // 输入失焦，赋值默认
    inputBlurDefault(type: TimeInputType) {
      this.inputTime[type] = '00';
    },
    // 面板展示隐藏
    panelVisibleChange(val: boolean, context?: PopupVisibleChangeContext) {
      if (context) {
        const isClickDoc = context.trigger === 'document';
        this.isShowPanel = !isClickDoc;
        this.$emit(isClickDoc ? 'close' : 'open');
      } else {
        this.isShowPanel = val;
        this.$emit(val ? 'open' : 'close');
      }
    },
    // 切换上下午
    toggleInputMeridiem() {
      const {
        $data: { time },
      } = this;
      const current = time.format('a');
      const currentHour = time.hour() + (current === AM ? 12 : -12);
      // 时间变动
      this.inputChange({
        type: 'hour',
        value: currentHour,
      });
    },
    // 选中时间发生变动
    pickTime(col: EPickerCols, change: string | number, index: number, value: Record<string, any>) {
      const {
        $data: { time },
      } = this;
      let _setTime = time;
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
      this.time = _setTime;

      this.inputTime = this.setInputValue(_setTime);
      this.$emit('change', dayjs(_setTime).format(this.format));
      isFunction(this.onChange) && this.onChange(dayjs(_setTime).format(this.format));
    },
    // 确定按钮
    makeSure() {
      this.panelVisibleChange(false);
      this.output();
    },
    // 此刻按钮
    nowAction() {
      const currentTime = dayjs();
      // 如果此刻在不可选的时间上, 直接return
      if (isFunction(this.disableTime) && this.disableTime(currentTime.get('hour'), currentTime.get('minute'), currentTime.get('second'))) {
        return;
      }
      this.time = currentTime;
      this.inputTime = this.setInputValue(this.time);
    },
    // format输出结果
    output() {
      if (this.needClear) {
        this.inputTime = this.setInputValue(undefined);
        this.needClear = false;
      } else if (this.time) this.inputTime = this.setInputValue(this.time);
      else this.inputTime = this.setInputValue(dayjs());
      return this.time;
    },
    // 设置输入框展示
    setInputValue(val: dayjs.Dayjs | undefined): InputTime | undefined {
      const ans: InputTime = {
        hour: undefined,
        minute: undefined,
        second: undefined,
        meridiem: 'AM',
      };
      if (!val) return ans;
      return this.dayjs2InputTime(val);
    },
    // dayjs对象转换输入展示数据
    dayjs2InputTime(val: dayjs.Dayjs): InputTime {
      const {
        $props: { format },
      } = this;
      if (!val) {
        return {
          hour: undefined,
          minute: undefined,
          second: undefined,
          meridiem: 'AM',
        };
      }

      let hour: number | string = val.hour();
      let minute: number | string = val.minute();
      let second: number | string = val.second();
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

      return {
        hour,
        minute,
        second,
        meridiem: val.format('a'),
      };
    },
    // 清除选中
    clear() {
      this.time = undefined;
      this.needClear = true;
      this.inputTime = this.setInputValue(undefined);
      this.$emit('onChange', undefined);
    },
    renderInput() {
      return (
        <div class={`${name}__group`} onClick={() => this.isShowPanel = true}>
          <t-input
            disabled={this.disabled}
            size={this.size}
            onClear={this.clear}
            clearable={this.clearable}
            readonly
            value={this.time ? ' ' : undefined}
          >
            <t-icon-time slot="suffix-icon"></t-icon-time>
          </t-input>
          <input-items
            size={this.size}
            dayjs={this.inputTime}
            disabled={this.disabled}
            format={this.format}
            allowInput={this.allowInput}
            placeholder={this.placeholder}
            onToggleMeridiem={() => this.toggleInputMeridiem()}
            onBlurDefault={(type: TimeInputType) => this.inputBlurDefault(type)}
            onChange={(e: TimeInputEvent) => this.inputChange(e)}
          />
        </div>
      );
    },
  },

  render() {
    // 初始化数据
    const {
      $props: { size, className, disabled },
    } = this;
    // 样式类名
    const classes = [name, CLASSNAMES.SIZE[size] || '', className];

    return (
      <t-popup
        ref="popup"
        placement="bottom-left"
        class={classes}
        trigger="click"
        disabled={disabled}
        visible={this.isShowPanel}
        overlayClassName={`${componentName}-panel__container`}
        on={{ 'visible-change': this.panelVisibleChange }}
      >
        {this.renderInput()}
        <template slot="content">
          <picker-panel
            ref="panel"
            format={this.format}
            value={this.panelValue}
            disabled={this.disabled}
            isShowPanel={this.isShowPanel}
            ontime-pick={this.pickTime}
            onsure={this.makeSure}
            onnow-action={this.nowAction}
            steps={this.steps}
            hideDisabledTime={this.hideDisabledTime}
            disableTime={this.disableTime}
            isFocus={this.focus}
          />
        </template>
      </t-popup>
    );
  },
});
