import Vue, { VNode } from 'vue';
import { emitEvent } from '../utils/event';
import { TNode, ClassName } from '../common';
import props from './props';
import { prefix } from '../config';
import InputNumber from '../input-number/index';
import TSliderMark from './slider-mark';
import { SliderValue, TdSliderProps } from './type';
import TSliderButton from './slider-button';

const name = `${prefix}-slider`;
export interface MarkItem {
  point: number;
  position: number;
  mark: string | number | TNode<{ value: number }>;
}
interface SliderButtonType extends Vue {
  setPosition: (param: number) => {};
}

export default Vue.extend({
  name: 'TSlider',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    ...props,
  },
  components: {
    TSliderMark,
    TInputNumber: InputNumber,
  },
  provide(): { slider: any } {
    return {
      slider: this,
    };
  },
  data() {
    return {
      firstValue: 0,
      secondValue: 0,
      prevValue: 0,
      dragging: false,
      sliderSize: 1,
      inputDecimalPlaces: 0,
      inputFormat: null,
      inputPlaceholder: '',
      inputTheme: 'column',
      showSteps: false,
      // 表单控制禁用态时的变量
      formDisabled: undefined,
    };
  },
  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    containerClass(): ClassName {
      return [`${name}__container`, { 'is-vertical': this.vertical }];
    },
    sliderClass(): ClassName {
      return [
        `${name}`,
        {
          'is-vertical': this.vertical,
          [`${name}--with-input`]: this.inputNumberProps,
          [`${name}--vertical`]: this.vertical,
          [`${prefix}-is-disabled`]: this.tDisabled,
        },
      ];
    },
    sliderRailClass(): ClassName {
      return [`${name}__rail`, { 'show-input': this.inputNumberProps, [`${prefix}-is-disabled`]: this.tDisabled }];
    },
    sliderNumberClass(): ClassName {
      return [
        `${name}__input`,
        {
          'is-vertical': this.vertical,
        },
      ];
    },
    vertical(): boolean {
      return this.layout === 'vertical';
    },
    // 差值范围
    rangeDiff(): number {
      return this.max - this.min;
    },
    steps(): number[] {
      const {
        min, max, rangeDiff, step,
      } = this;
      if (!this.showSteps || min > max) return [];
      if (this.step === 0) {
        console.warn('[Element Warn][Slider]step should not be 0.');
        return [];
      }
      const stepCount = rangeDiff / step;
      const stepWidth = (100 * step) / rangeDiff;
      const result = [];
      for (let i = 1; i < stepCount; i++) {
        result.push(i * stepWidth);
      }
      if (this.range) {
        return result.filter(
          (step) => step < (100 * (this.minValue - min)) / rangeDiff || step > (100 * (this.maxValue - min)) / rangeDiff,
        );
      }
      return result.filter((step) => step > (100 * (this.firstValue - min)) / rangeDiff);
    },
    markList(): Array<MarkItem> {
      if (!this.marks) {
        return [];
      }
      const legalMarks: Array<MarkItem> = [];
      Object.keys(this.marks)
        .map(parseFloat)
        .sort((a, b) => a - b)
        .filter((point) => point <= this.max && point >= this.min)
        .forEach((point) => {
          const item: MarkItem = {
            point,
            position: ((point - this.min) * 100) / this.rangeDiff,
            mark: this.marks[point],
          };
          legalMarks.push(item);
        });
      return legalMarks;
    },
    minValue(): number {
      return Math.min(this.firstValue, this.secondValue);
    },
    maxValue(): number {
      return Math.max(this.firstValue, this.secondValue);
    },
    barSize(): string {
      const diff = this.range ? this.maxValue - this.minValue : this.prevValue - this.min;
      return `${(100 * diff) / this.rangeDiff}%`;
    },
    barStart(): string {
      return this.range ? `${(100 * (this.minValue - this.min)) / this.rangeDiff}%` : '0%';
    },
    precision(): number {
      const precisions = [this.min, this.max, this.step].map((item) => {
        const decimalArr = `${item}`.split('.');
        return decimalArr[1] ? decimalArr[1].length : 0;
      });
      return Math.max.apply(null, precisions);
    },
    runwayStyle(): object {
      return this.vertical ? { height: '100%' } : {};
    },
    barStyle(): object {
      return this.vertical
        ? {
          height: this.barSize,
          bottom: this.barStart,
        }
        : {
          width: this.barSize,
          left: this.barStart,
        };
    },
    calcInputNumberProps(): object {
      const defaultInputNumberProps = {
        decimalPlaces: 0,
        placeholder: '',
        theme: 'column',
      };
      if (typeof this.inputNumberProps === 'object') {
        return {
          ...defaultInputNumberProps,
          ...this.inputNumberProps,
        };
      }
      return defaultInputNumberProps;
    },
  },
  watch: {
    value(newVal: SliderValue) {
      if (this.dragging === true) return;
      if (Array.isArray(newVal) && this.range) {
        [this.firstValue, this.secondValue] = newVal;
      } else {
        this.prevValue = newVal as number;
      }
    },
    firstValue(val: number) {
      if (this.range) {
        this.emitChange([this.minValue, this.maxValue]);
      } else {
        this.emitChange(val);
      }
    },

    secondValue() {
      if (this.range) {
        this.emitChange([this.minValue, this.maxValue]);
      }
    },

    prevValue(val: number) {
      this.emitChange(val);
    },
    dragging(newVal: boolean) {
      if (newVal === false) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resetSize);
  },
  methods: {
    // 初始化传入的value
    init(): void {
      let valuetext: string | number;

      const { min, max, value } = this;
      if (this.range) {
        if (Array.isArray(value)) {
          this.firstValue = Math.max(min || 0, value[0]);
          this.secondValue = Math.min(max || 100, value[1]);
        } else {
          this.firstValue = min || 0;
          this.secondValue = max || 100;
        }
        valuetext = `${this.firstValue}-${this.secondValue}`;
      } else {
        if (typeof this.value !== 'number') {
          this.prevValue = min;
        } else {
          this.prevValue = Math.min(max, Math.max(min, value as number));
        }
        valuetext = String(this.prevValue);
      }
      this.$el.setAttribute('aria-valuetext', valuetext);
      this.resetSize();
      window.addEventListener('resize', this.resetSize);
    },
    valueChanged(): boolean {
      if (this.range) {
        return ![this.minValue, this.maxValue].every((item, index) => item === this.prevValue[index]);
      }
      return this.value !== this.prevValue;
    },
    // 防止值越级
    setValues(value: SliderValue): SliderValue {
      const [min, max] = [this.min, this.max];
      if (min > max) {
        console.warn('[Slider] max should be greater than min.');
        return;
      }
      // 双向滑块
      if (this.range && Array.isArray(value)) {
        let [firstValue, secondValue] = [Math.min(...value), Math.max(...value)];
        if (firstValue > max) firstValue = this.firstValue;
        if (firstValue < min) firstValue = min;
        if (secondValue < min) secondValue = this.secondValue;
        if (secondValue > max) secondValue = max;
        [this.firstValue, this.secondValue] = [firstValue, secondValue];
        return [firstValue, secondValue];
      }
      let prevValue = value as number;
      if (prevValue < min) prevValue = min;
      if (prevValue > max) prevValue = max;
      this.prevValue = prevValue;
      return prevValue;
    },
    // 相应button的位置
    setPosition(percent: number): void {
      let targetValue = (percent * this.rangeDiff) / 100;
      targetValue = this.min + targetValue;
      if (!this.range) {
        (this.$refs.button1 as SliderButtonType).setPosition(percent);
        return;
      }
      let button;
      if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
        button = this.firstValue < this.secondValue ? 'button1' : 'button2';
      } else {
        button = this.firstValue > this.secondValue ? 'button1' : 'button2';
      }
      (this.$refs[button] as SliderButtonType).setPosition(percent);
    },
    // 全局点击
    onSliderClick(event: MouseEvent): void {
      if (this.tDisabled || this.dragging) {
        return;
      }
      this.resetSize();
      let value = 0;
      if (this.vertical) {
        const sliderOffsetBottom = (this.$refs.slider as Element).getBoundingClientRect().bottom;
        value = ((sliderOffsetBottom - event.clientY) / this.sliderSize) * 100;
        this.setPosition(value);
      } else {
        const sliderOffsetLeft = (this.$refs.slider as Element).getBoundingClientRect().left;
        value = ((event.clientX - sliderOffsetLeft) / this.sliderSize) * 100;
        this.setPosition(value);
      }
    },
    resetSize(): void {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider[`client${this.vertical ? 'Height' : 'Width'}`];
      }
    },
    // 只要触发修改就要有这个方法抛出change事件
    emitChange(value: SliderValue) {
      let changeValue = value;
      if (changeValue === undefined) {
        if (this.range) {
          changeValue = [this.firstValue, this.secondValue];
        } else {
          changeValue = this.prevValue;
        }
      }
      const fixValue: SliderValue = this.setValues(changeValue);
      emitEvent<Parameters<TdSliderProps['onChange']>>(this, 'change', fixValue);
    },
    getStopStyle(position: number) {
      return this.vertical ? { top: `calc(${100 - position}% - 1px)` } : { left: `${position}%` };
    },

    // mark 点击触发修改事件
    changeValue(point: number) {
      if (this.tDisabled || this.dragging) {
        return;
      }
      this.resetSize();
      const value = Number((point / this.rangeDiff) * 100);
      this.setPosition(value);
      this.emitChange(point);
    },
    renderMask(): VNode {
      if (this.markList.length) {
        return (
          <div>
            <div>
              {this.markList.map((item, index) => (
                <div
                  class={[`${name}__stop`, `${name}__mark-stop`]}
                  style={this.getStopStyle(item.position)}
                  key={index}
                ></div>
              ))}
            </div>
            <div class={`${name}__mark`}>
              {this.markList.map((item, key) => (
                <t-slider-mark
                  mark={item.mark}
                  point={item.point}
                  key={key}
                  style={this.getStopStyle(item.position)}
                  on-change-value={this.changeValue}
                ></t-slider-mark>
              ))}
            </div>
          </div>
        );
      }
    },
    renderInputButton(): VNode {
      const {
        max, min, sliderNumberClass, range,
      } = this;
      return (
        <div
          class={[
            `${name}__input-container`,
            {
              'is-vertical': this.vertical,
            },
          ]}
        >
          {
            <t-input-number
              class={sliderNumberClass}
              value={range ? this.firstValue : this.prevValue}
              ref="input"
              step={this.step}
              onChange={(v: number) => {
                this.range ? (this.firstValue = v) : (this.prevValue = v);
              }}
              disabled={this.tDisabled}
              min={min}
              max={max}
              props={this.calcInputNumberProps}
            ></t-input-number>
          }
          {range && <div class={`${name}__center-line`} />}
          {range && (
            <t-input-number
              class={this.sliderNumberClass}
              v-model={this.secondValue}
              ref="input"
              step={this.step}
              disabled={this.tDisabled}
              min={min}
              max={max}
              props={this.calcInputNumberProps}
            ></t-input-number>
          )}
        </div>
      );
    },
  },
  render(): VNode {
    const {
      min, max, layout, disabled, vertical, range,
    } = this;
    const buttonGroup = this.inputNumberProps && this.renderInputButton();
    const masks = this.renderMask();
    return (
      <div class={this.containerClass}>
        <div
          class={this.sliderClass}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-orientation={layout}
          aria-disabled={disabled}
          tooltip-props={this.tooltipProps}
        >
          <div class={this.sliderRailClass} style={this.runwayStyle} onClick={this.onSliderClick} ref="slider">
            <div class={`${name}__track`} style={this.barStyle}></div>
            <TSliderButton
              vertical={vertical}
              value={range ? this.firstValue : this.prevValue}
              ref="button1"
              disabled={this.tDisabled}
              label={this.label}
              range={this.range}
              position="start"
              tooltip-props={this.tooltipProps}
              onInput={(v: number) => {
                this.range ? (this.firstValue = v) : (this.prevValue = v);
              }}
            ></TSliderButton>
            {this.range && (
              <TSliderButton
                vertical={vertical}
                v-model={this.secondValue}
                ref="button2"
                disabled={this.tDisabled}
                range={this.range}
                position="end"
                label={this.label}
                tooltip-props={this.tooltipProps}
              ></TSliderButton>
            )}

            {this.showSteps && (
              <div>
                {this.steps.map((item, key) => (
                  <div class={`${name}__stop`} key={key} style={this.getStopStyle(item)}></div>
                ))}
              </div>
            )}
            {masks}
          </div>
        </div>
        {buttonGroup}
      </div>
    );
  },
});
