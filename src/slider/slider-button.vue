<template>
  <div
    :class="[{ hover: hovering, dragging: dragging }, 't-slider__button-wrapper']"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
    :show-tooltip="showTooltip"
    v-bind:disabled="disabled"
  >
    <t-popup
      ref="popup"
      :popper-class="popupClass"
      :disabled="!showTooltip"
      v-bind:content="String(formatValue)"
      :placement="placement"
      :trigger="trigger"
      :show-arrow="showArrow"
      :overlay-style="overlayStyle"
      :overlay-class-name="overlayClassName"
      :attach="attach"
    >
      <span slot="content">{{ formatValue }}</span>
      <div class="t-slider__button" :class="{ hover: hovering, dragging: dragging }"></div>
    </t-popup>
  </div>
</template>

<script>
import { prefix } from '../config';

const name = `${prefix}-slider-button`;
export default {
  name,
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    // showTooltip: {
    //   type: Boolean,
    //   default: true,
    // },
    popupClass: {
      type: String,
      default: '',
    },
    tooltipProps: {
      type: [Boolean, Object],
      default: true,
    },
  },
  data() {
    return {
      hovering: false,
      dragging: false,
      isClick: false,
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
    };
  },

  computed: {
    placement() {
      if (this.tooltipProps instanceof Object) {
        const {
          placement,
        } = this.tooltipProps;
        if (placement) return placement;
      }

      return this.vertical ? 'right' : 'top';
    },
    rangeDiff() {
      return this.max - this.min;
    },
    formatValue() {
      return (this.enableFormat && this.$parent.formatpopup(this.value)) || this.value;
    },
    disabled() {
      return this.$parent.disabled;
    },
    max() {
      return this.$parent.max;
    },
    min() {
      return this.$parent.min;
    },
    step() {
      return this.$parent.step;
    },
    precision() {
      return this.$parent.precision;
    },
    currentPos() {
      return `${((this.value - this.min) / this.rangeDiff) * 100}%`;
    },
    enableFormat() {
      return this.$parent.formatpopup instanceof Function;
    },
    wrapperStyle() {
      return this.vertical ? { bottom: this.currentPos } : { left: this.currentPos };
    },
  },
  watch: {
    dragging(val) {
      this.$parent.dragging = val;
    },
  },
  mounted() {
    this.showTooltip = !this.tooltipProps === false;
    this.setTooltipProps();
  },
  methods: {
    setTooltipProps() {
      if (this.tooltipProps instanceof Object) {
        const {
          trigger,
          destroyOnHide,
          showArrow,
          overlayStyle,
          overlayClassName,
          attach,
        } = this.tooltipProps;
        if (!this.empty(trigger)) {
          this.trigger = trigger;
        }
        this.destroyOnHide = destroyOnHide;
        if (!this.empty(showArrow)) {
          this.showArrow = showArrow;
        }

        this.overlayStyle = overlayStyle;
        this.overlayClassName = overlayClassName;
        if (!this.empty(attach)) {
          this.attach = attach;
        }
      }
    },
    operatePopup(state) {
      if (this.$refs.popup) {
        this.$refs.popup.showPopper = state;
      }
    },
    showPopup() {
      this.operatePopup(true);
    },
    hidePopup() {
      this.operatePopup(false);
    },

    handleMouseEnter() {
      this.hovering = true;
      this.$refs.button.focus();
      this.showPopup();
    },
    handleMouseLeave() {
      this.hovering = false;
      this.hidePopup();
    },
    onButtonDown(event) {
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
    onLeftKeyDown() {
      this.onKeyDown('sub');
    },
    onRightKeyDown() {
      this.onKeyDown('add');
    },
    onKeyDown(state) {
      if (this.disabled) {
        return;
      }
      let stepLength = (this.step / this.rangeDiff) * 100;
      if (state === 'sub') {
        stepLength = -stepLength;
      }
      this.newPos = parseFloat(this.currentPos) + stepLength;
      this.setPosition(this.newPos);
      // this.$parent.emitChange(parseInt(this.newPos));
    },
    onDragStart(event) {
      this.dragging = true;
      this.isClick = true;
      const { type } = event;
      let { clientY, clientX } = event;
      if (type === 'touchstart') {
        const touch = event.touches;
        [clientY, clientX] = [touch.clientY, touch.clientX];
      }
      if (this.vertical) {
        this.startY = clientY;
      } else {
        this.startX = clientX;
      }
      this.startPos = parseFloat(this.currentPos);
      this.newPos = this.startPos;
    },
    onDragging(e) {
      const event = e;
      if (!this.dragging) {
        return;
      }
      this.isClick = false;
      this.showPopup();
      this.$parent.resetSize();
      let diff = 0;
      if (event.type === 'touchmove') {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }
      const parentSliderSize = this.$parent.sliderSize;
      if (this.vertical) {
        this.currentY = event.clientY;
        diff = this.startY - this.currentY;
      } else {
        this.currentX = event.clientX;
        diff = this.currentX - this.startX;
      }

      diff = (diff / parentSliderSize) * 100;
      this.newPos = this.startPos + diff;
      this.setPosition(this.newPos);
    },
    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
          this.hidePopup();
          if (!this.isClick) {
            this.setPosition(this.newPos);
            // this.$parent.emitChange(parseInt(this.newPos));
          }
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },
    setPosition(pos) {
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
      value = Number(parseFloat(value).toFixed(this.precision));
      this.$emit('input', value);
      this.$nextTick(() => {
        this.showPopup();
        this.$refs.popup && this.$refs.popup.updatePopper();
      });
      if (!this.dragging && this.value !== this.prevValue) {
        this.prevValue = this.value;
      }
    },
    empty(str) {
      return str === undefined || str === null;
    },
  },
};
</script>
