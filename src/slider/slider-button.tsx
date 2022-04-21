import Vue, { VNode, PropType, VueConstructor } from 'vue';
import { Styles } from '@src/common';
import { prefix } from '../config';
import Slider from './slider';
import Tooltip from '../tooltip/index';
import ITooltip from '../tooltip/tooltip';
import { getIEVersion } from '../_common/js/utils/helper';
import { TdSliderProps } from './type';
import { TdTooltipProps } from '../tooltip/type';
import { renderTNodeJSXDefault } from '../utils/render-tnode';

const name = `${prefix}-slider-button`;
interface SliderInstanceType extends Vue {
  slider: InstanceType<typeof Slider>;
}

type TooltipInstanceType = InstanceType<typeof ITooltip>;

export default (Vue as VueConstructor<SliderInstanceType>).extend({
  name,
  props: {
    value: {
      type: [Number, String] as PropType<TdSliderProps['value']>,
      default: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    popupClass: {
      type: String,
      default: '',
    },
    tooltipProps: {
      type: [Boolean, Object] as PropType<TdSliderProps['tooltipProps']>,
      default: true,
    },
    label: {
      type: [String, Function, Boolean] as PropType<TdSliderProps['label']>,
      default: true,
    },
    range: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
    },
  },
  inject: {
    slider: { default: undefined },
  },
  computed: {
    placement(): string {
      if (this.tooltipProps instanceof Object) {
        const { placement } = this.tooltipProps;
        if (placement) return placement;
      }

      return this.vertical ? 'right' : 'top';
    },
    rangeDiff(): number {
      return this.max - this.min;
    },
    disabled(): boolean {
      return this.slider.disabled;
    },
    max(): number {
      return this.slider.max;
    },
    min(): number {
      return this.slider.min;
    },
    step(): number {
      return this.slider.step;
    },
    precision(): number {
      return this.slider.precision;
    },
    currentPos(): string {
      return `${(((this.value as number) - this.min) / this.rangeDiff) * 100}%`;
    },
    wrapperStyle(): Styles {
      return this.vertical ? { bottom: this.currentPos } : { left: this.currentPos };
    },
  },
  data() {
    return {
      visible: false,
      hovering: false,
      dragging: false,
      isClick: false,
      clientX: 0,
      clientY: 0,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      startPos: 0,
      newPos: null,
      prevValue: this.value,
      showTooltip: true,
      trigger: 'hover',
      showArrow: true,
      overlayStyle: undefined,
      overlayClassName: undefined,
      attach: 'body',
      destroyOnClose: null,
    };
  },
  watch: {
    disabled() {
      this.handleIE();
    },
  },
  mounted() {
    this.showTooltip = !this.tooltipProps === false;
    this.setTooltipProps();
    this.handleIE();
  },
  methods: {
    getTooltipContent() {
      if (typeof this.label === 'boolean') return String(this.value);
      return renderTNodeJSXDefault(this, 'label', {
        params: this.range
          ? {
            value: this.value,
            position: this.position,
          }
          : { value: this.value },
      });
    },
    setTooltipProps() {
      if (this.tooltipProps instanceof Object) {
        const {
          trigger, destroyOnClose, showArrow, overlayStyle, overlayClassName, attach,
        } = this.tooltipProps;
        if (!this.empty(trigger)) {
          this.trigger = trigger;
        }
        this.destroyOnClose = destroyOnClose;
        if (!this.empty(showArrow)) {
          this.showArrow = showArrow;
        }

        this.overlayStyle = overlayStyle;
        this.overlayClassName = overlayClassName;
        if (!this.empty(attach)) {
          this.attach = attach as string;
        }
      }
    },
    getTooltipProps(): TdTooltipProps {
      if (this.tooltipProps instanceof Object) {
        return this.tooltipProps;
      }
      return {};
    },
    handleIE() {
      if (getIEVersion() <= 11) {
        this.$nextTick(() => {
          this.$el.removeAttribute('disabled');
        });
      }
    },
    showTooltipComponent() {
      this.visible = true;
    },
    hideTooltipComponent() {
      this.visible = false;
    },

    handleMouseEnter() {
      this.hovering = true;
      this.showTooltipComponent();
      (this.$refs.button as HTMLElement).focus();
    },
    handleMouseLeave() {
      this.hovering = false;
      if (!this.dragging) {
        this.hideTooltipComponent();
      }
    },
    onButtonDown(event: MouseEvent) {
      if (this.disabled) {
        return;
      }
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },
    onNativeKeyDown(e: KeyboardEvent) {
      const { code } = e;
      e.preventDefault();
      if (code === 'ArrowDown' || code === 'ArrowLeft') {
        this.onKeyDown('sub');
      }
      if (code === 'ArrowUp' || code === 'ArrowRight') {
        this.onKeyDown('add');
      }
    },
    onLeftKeyDown() {
      this.onKeyDown('sub');
    },
    onRightKeyDown() {
      this.onKeyDown('add');
    },
    onKeyDown(state: string) {
      if (this.disabled) {
        return;
      }
      let stepLength = (this.step / this.rangeDiff) * 100;
      if (state === 'sub') {
        stepLength = -stepLength;
      }
      this.newPos = parseFloat(this.currentPos) + stepLength;
      this.setPosition(this.newPos);
    },
    onDragStart(event: Event) {
      this.dragging = true;
      this.isClick = true;
      const { type } = event;
      let { clientY, clientX } = event as MouseEvent;
      if (type === 'touchstart') {
        const touch = (event as TouchEvent).touches;
        [clientY, clientX] = [touch[0].clientY, touch[0].clientX];
      }
      if (this.vertical) {
        this.startY = clientY;
      } else {
        this.startX = clientX;
      }
      this.startPos = parseFloat(this.currentPos);
      this.newPos = this.startPos;
    },
    onDragging(e: Event) {
      const event = e;
      if (!this.dragging) {
        return;
      }

      this.isClick = false;
      this.showTooltipComponent();
      this.slider.resetSize();
      let diff = 0;

      const parentSliderSize = this.slider.sliderSize;
      if (this.vertical) {
        this.currentY = (event as MouseEvent).clientY;
        diff = this.startY - this.currentY;
      } else {
        this.currentX = (event as MouseEvent).clientX;
        diff = this.currentX - this.startX;
      }

      if (event.type === 'touchmove') {
        const touch = (event as TouchEvent).touches;
        const [clientY, clientX] = [touch[0].clientY, touch[0].clientX];
        this.clientY = clientY;
        this.clientX = clientX;
      }

      diff = (diff / parentSliderSize) * 100;
      this.newPos = this.startPos + diff;
      this.setPosition(this.newPos);
    },
    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
          this.hideTooltipComponent();
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },
    setPosition(pos: number) {
      let newPos = pos;
      if (newPos === null || isNaN(newPos)) {
        return;
      }

      if (newPos > 100) {
        newPos = 100;
      } else if (newPos < 0) {
        newPos = 0;
      }
      const perStepLen = (100 * this.step) / this.rangeDiff;
      const steps = Math.round(newPos / perStepLen);
      let value = steps * perStepLen * this.rangeDiff * 0.01;
      value += this.min;
      value = Number(parseFloat(`${value}`).toFixed(this.precision));
      this.$emit('input', value);
      this.$nextTick(() => {
        this.showTooltipComponent();
        this.$refs.tooltip && (this.$refs.tooltip as TooltipInstanceType).updatedTooltip();
      });
      if (!this.dragging && this.value !== this.prevValue) {
        this.prevValue = this.value;
      }
    },
    empty(str: any) {
      return str === undefined || str === null;
    },
  },

  render(): VNode {
    return (
      <div
        ref="button"
        class={`${prefix}-slider__button-wrapper`}
        style={this.wrapperStyle}
        tabindex="0"
        show-tooltip={this.showTooltip}
        onmouseenter={this.handleMouseEnter}
        onmouseleave={this.handleMouseLeave}
        onmousedown={this.onButtonDown}
        ontouchstart={this.onButtonDown}
        onfocus={this.handleMouseEnter}
        onblur={this.handleMouseLeave}
        onKeydown={this.onNativeKeyDown}
      >
        <Tooltip
          ref="tooltip"
          props={this.getTooltipProps()}
          visible={this.label && this.visible}
          content={this.getTooltipContent}
        >
          <div class={[`${prefix}-slider__button`, { [`${prefix}-slider__button--dragging`]: this.dragging }]} />
        </Tooltip>
      </div>
    );
  },
});
