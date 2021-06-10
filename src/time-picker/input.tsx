import Vue, { VueConstructor } from 'vue';

import { TimeInputInstance, TimeInputType, InputEvent, InputTime } from './type';
import RenderComponent from '../utils/render-component';
import {
  componentName,
  meridianZHList,
  meridianENList,
  meridianBeforeFormatREG,
} from './constant';

import { prefix } from '../config';

const name = `${prefix}-time-picker-input`;

export default (Vue as VueConstructor<TimeInputInstance>).extend({
  name,

  components: {
    RenderComponent,
  },
  props: {
    // 格式化标准
    format: {
      type: String,
    },
    // 时间
    dayjs: {
      type: [Object, Array, undefined],
      default: undefined,
    },
    // placeholder
    placeholder: {
      type: String,
    },
    allowInput: {
      type: Boolean,
    },
    isRangePicker: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    displayTimeList(): Array<InputTime | undefined> {
      return this.isRangePicker ? this.dayjs : [this.dayjs];
    },
  },

  methods: {
    // 输入事件
    onInput(e: Event, type: TimeInputType, index: number): void {
      if (!this.allowInput) return;
      const { target, data } = e as InputEvent;
      const { value } = target;
      const { $props: { format } } = this;
      const curDayJs = this.displayTimeList[index];
      let number = Number(value);
      if (
        (
          curDayJs[type] === '00'
          && number === 0
        ) || value === ''
      ) {
        // 输入之前是00 输入之后是0
        // 清空
        this.$emit('change', {
          value: -1,
          type,
          index,
        });
      } else if (`${number}`.length > 2) {
        // 当前输入的数值大于两位数
        number = Number(data);
      }
      // 两位数判断
      // 是否使有效输入
      let emitChange = true;
      // 过滤掉非法输入
      if (!isNaN(number)) {
        switch (type) {
          case 'hour':
            if (number > ((/[h]{1}/.test(format)) ? 12 : 24) || number < 0) {
              emitChange = false;
            }
            ;
            break;
          case 'minute':
            if (number > 59 || number < 0) {
              emitChange = false;
            }
            ;
            break;
          case 'second':
            if (number > 59 || number < 0) {
              emitChange = false;
            }
            ;
            break;
          default:
            break;
        }
        if (emitChange) this.$emit('change', {
          value: number,
          type,
          index,
        });
      }
      // 完全受控
      this.$nextTick(() => {
        if (curDayJs[type] !== undefined) this.setInputValue(curDayJs[type], target);
      });
    },
    // 失去焦点
    onBlur(_e: Event, type: TimeInputType, index: number): void {
      // todo 无填充需要填充
      const curDayJs = this.displayTimeList[index];
      if (curDayJs[type] === undefined) {
        this.$emit('blurDefault', type, index);
      }
    },
    // 键盘监听
    onKeydown(e: any, type: TimeInputType, index: number): void {
      if (!this.allowInput) return;
      const { which } = e;
      const {
        $props: {
          format,
        },
      } = this;
      const curDayJs = this.displayTimeList[index];
      // 增加减少
      if ([38, 40].includes(which)) {
        if (type === 'meridian') return;
        // 加减
        const current = curDayJs[type] ? Number(curDayJs[type]) : 0;
        const operate = (which === 38 ? 1 : -1);
        let result = current + operate;
        // 边界检测
        if (type === 'hour') {
          if (result > ((/[h]{1}/.test(format)) ? 11 : 23)) {
            // 上限
            result = 0;
          } else if (result < 0) {
            result = ((/[h]{1}/.test(format)) ? 11 : 23);
          }
        } else {
          if (result > 59) {
            result = 1;
          } else if (result < 0) {
            result = 59;
          }
        }
        // 发送变动
        this.$emit('change', {
          value: result,
          type,
          index,
        });
      } else if ([37, 39].includes(which)) {
        // 移动方向
        // const direction = which === 37 ? -1 : 1;
        const { target } = e;
        // 查找上下一个兄弟节点
        const { parentNode } = target;
        const focus = which === 37 ? parentNode.previousSibling : parentNode.nextSibling;
        if (focus) {
          const input = focus.querySelector('input');
          if (!input.focus) return;
          input.focus();
        }
      }
    },
    // 切换上下午
    onToggleMeridian(index: number) {
      this.$emit('toggleMeridian', index);
    },
    // 设置输入框原始值，使其完全受控
    setInputValue(v: string | number, input: HTMLInputElement): void {
      const sV = String(v);
      if (!input) {
        return;
      }
      if (input.value !== sV) {
        // input.value = sV;
        Object.assign(input, { value: sV });
        // input.setAttribute('value', sV);
      }
    },
    // ==== 渲染逻辑层 START ====
    // 渲染输入组件
    switchRenderComponent() {
      const {
        $props: {
          format,
          placeholder,
          allowInput,
        },
      } = this;

      // 判定placeholder展示
      function isEmptyDayjs(val: InputTime) {
        return (val === undefined) || (val.hour === undefined && val.minute === undefined && val.second === undefined);
      }
      const isEmptyVal = this.displayTimeList.every(date => isEmptyDayjs(date));
      if (isEmptyVal) {
        return <span class={`${componentName}__input-placeholder`}>{placeholder}</span>;
      }
      const itemClasses = [
        `${componentName}__input-item`,
      ];
      const inputClass = [
        `${componentName}__input-item-input`,
      ];
      const render: any = [];
      this.displayTimeList.forEach((inputTime: InputTime | undefined, index: number) => {
        if (index > 0) render.push('-');
        // 渲染组件 - 默认有小时输入
        render.push(<span class={itemClasses}>
          <input
            class={inputClass}
            value={inputTime.hour}
            disabled={!allowInput}
            id="time"
            onKeydown={(e: Event) => this.onKeydown(e, 'hour', index)}
            onInput={(e: Event) => this.onInput(e, 'hour', index)}
            onBlur={(e: Event) => this.onBlur(e, 'hour', index)}/>
        </span>);
        // 判断分秒输入
        if (/[hH]{1,2}:m{1,2}/.test(format)) {
          // 需要分钟输入器
          render.push(<span class={itemClasses}>
              &#58;<input
            class={inputClass}
            value={inputTime.minute}
            disabled={!allowInput}
            onKeydown={(e: Event) => this.onKeydown(e, 'minute', index)}
            onInput={(e: Event) => this.onInput(e, 'minute', index)}
            onBlur={(e: Event) => this.onBlur(e, 'minute', index)}/>
            </span>);
          // 需要秒输入器
          if (/[hH]{1,2}:m{1,2}:s{1,2}/.test(format)) {
            render.push(<span class={itemClasses}>
              &#58;<input
              class={inputClass}
              value={inputTime.second}
              disabled={!allowInput}
              onKeydown={(e: Event) => this.onKeydown(e, 'second', index)}
              onInput={(e: Event) => this.onInput(e, 'second', index)}
              onBlur={(e: Event) => this.onBlur(e, 'second', index)}/>
              </span>);
          }
        }
        // 判断上下午位置
        if ((/[h]{1}/.test(format)) && (format.includes('A') || format.includes('a'))) {
          const tmp = (meridianBeforeFormatREG.test(format) ? meridianZHList : meridianENList)
            .find((item: { value: string; label: string }) => item.value === inputTime.meridian);
          const text = tmp ? tmp.label : '';
          // 放在前面or后面
          render[meridianBeforeFormatREG.test(format) ? 'unshift' : 'push'](<span
            class={itemClasses}
            onClick={() => this.onToggleMeridian(index)}>
              <input
                readonly
                class={inputClass}
                value={text}
                onKeydown={(e: Event) => this.onKeydown(e, 'meridian', index)}/>
            </span>);
        }
      });
      return render;
    },
    // ==== 渲染逻辑层 END ====
  },

  render() {
    const classes = [
      `${componentName}__input`,
    ];
    return <span class={classes}>
      {
        this.switchRenderComponent()
      }
    </span>;
  },

});
