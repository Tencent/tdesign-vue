import Vue, { VueConstructor } from 'vue';

import { TimeInputInstance, TimeInputType } from './type/index.d';
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

  props: {
    // 格式化标准
    format: {
      type: String,
    },
    // 时间
    moment: {
      type: [Object, undefined],
      default: undefined,
    },
    // placeholder
    placeholder: {
      type: String,
    },
    allowInput: {
      type: Boolean,
    },
  },

  methods: {
    // 输入事件
    onInput(e: any, type: TimeInputType): void {
      if (!this.allowInput) return;
      const { target, data } = e;
      const { value } = (target as HTMLInputElement);
      const { $props: { format } } = this;
      let number = Number(value);
      if (
        (
          this.moment[type] === '00'
          && number === 0
        ) || value === ''
      ) {
        // 输入之前是00 输入之后是0
        // 清空
        this.$emit('change', {
          value: -1,
          type,
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
            };
            break;
          case 'minute':
            if (number > 59 || number < 0) {
              emitChange = false;
            };
            break;
          case 'second':
            if (number > 59 || number < 0) {
              emitChange = false;
            };
            break;
          default:
            break;
        }
        if (emitChange) this.$emit('change', {
          value: number,
          type,
        });
      }
      // 完全受控
      this.$nextTick(() => {
        if (this.moment[type] !== undefined) this.setInputValue(this.moment[type], target);
      });
    },
    // 失去焦点
    onBlur(_e: any, type: TimeInputType): void {
      // todo 无填充需要填充
      if (this.moment[type] === undefined) {
        this.$emit('blurDefault', type);
      }
    },
    // 键盘监听
    onKeydown(e: any, type: TimeInputType): void {
      if (!this.allowInput) return;
      const { which } = e;
      const {
        $props: {
          format,
        },
      } = this;
      // 增加减少
      if ([38, 40].includes(which)) {
        if (type === 'meridian') return;
        // 加减
        const current = this.moment[type] ? Number(this.moment[type]) : 0;
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
    onToggleMeridian() {
      this.$emit('toggleMeridian');
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
          moment,
          placeholder,
        },
      } = this;
      // 判定placeholder展示
      if (
        moment.hour === undefined
        && moment.minute === undefined
        && moment.second === undefined
      ) {
        return <span class={`${componentName}__input-placeholder`}>{placeholder}</span>;
      }
      const itemClasses = [
        `${componentName}__input-item`,
      ];
      const inputClass = [
        `${componentName}__input-item-input`,
      ];
      // 渲染组件 - 默认有小时输入
      const render = [
        <span class={itemClasses}>
          <input
            class={inputClass}
            value={moment.hour}
            id="time"
            onKeydown={(e: Event) => this.onKeydown(e, 'hour')}
            onInput={(e: Event) => this.onInput(e, 'hour')}
            onBlur={(e: Event) => this.onBlur(e, 'hour')} />
        </span>,
      ];
      // 判断分秒输入
      if (/[hH]{1,2}:m{1,2}/.test(format)) {
        // 需要分钟输入器
        render.push(<span class={itemClasses}>
            &#58;<input
              class={inputClass}
              value={moment.minute}
              onKeydown={(e: Event) => this.onKeydown(e, 'minute')}
              onInput={(e: Event) => this.onInput(e, 'minute')}
              onBlur={(e: Event) => this.onBlur(e, 'minute')} />
          </span>);
        // 需要秒输入器
        if (/[hH]{1,2}:m{1,2}:s{1,2}/.test(format)) {
          render.push(<span class={itemClasses}>
            &#58;<input
              class={inputClass}
              value={moment.second}
              onKeydown={(e: Event) => this.onKeydown(e, 'second')}
              onInput={(e: Event) => this.onInput(e, 'second')}
              onBlur={(e: Event) => this.onBlur(e, 'second')} />
            </span>);
        }
      }
      // 判断上下午位置
      if ((/[h]{1}/.test(format)) && (format.includes('A') || format.includes('a'))) {
        const text = (meridianBeforeFormatREG.test(format) ? meridianZHList : meridianENList)
          .find((item: { value: string; label: string }) => item.value === moment.meridian).label;
        // 放在前面or后面
        render[meridianBeforeFormatREG.test(format) ? 'unshift' : 'push'](<span
          class={itemClasses}
          onClick={this.onToggleMeridian}>
            <input
              readonly
              class={inputClass}
              value={text}
              onKeydown={(e: Event) => this.onKeydown(e, 'meridian')} />
          </span>);
      }

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
