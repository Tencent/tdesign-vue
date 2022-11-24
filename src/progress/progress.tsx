import { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import {
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  CloseIcon as TdCloseIcon,
  CheckIcon as TdCheckIcon,
  ErrorIcon as TdErrorIcon,
} from 'tdesign-icons-vue';
import { getBackgroundColor } from '../utils/helper';
import {
  PRO_THEME, CIRCLE_SIZE, CIRCLE_SIZE_PX, STATUS_ICON, CIRCLE_FONT_SIZE_RATIO,
} from './constants';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { Styles } from '../common';
import { getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('progress');

export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TProgress',

  props: { ...props },

  computed: {
    statusStyle(): string {
      if (!this.status && this.percentage >= 100) {
        return 'success';
      }
      return this.status;
    },
    themeClass(): string {
      const Line = PRO_THEME.LINE;
      if (this.theme === Line) {
        return 'thin';
      }
      return this.theme;
    },
    trackBgStyle(): Styles {
      const { strokeWidth } = this;
      let height = typeof strokeWidth === 'string' ? strokeWidth : `${strokeWidth}px`;
      const Plump = PRO_THEME.PLUMP;
      if (this.theme === Plump) {
        height = '';
      }
      return {
        height,
        backgroundColor: this.trackColor,
        borderRadius: height,
      };
    },
    circleStrokeStyle(): Styles {
      return {
        stroke: this.trackColor,
      };
    },
    barStyle(): Styles {
      return {
        width: `${this.percentage}%`,
        background: this.color && getBackgroundColor(this.color),
      };
    },
    circlePathStyle(): Styles {
      const strokeColor = typeof this.color === 'object' ? '' : this.color;
      return {
        stroke: strokeColor,
      };
    },
    isShowIcon(): boolean {
      return STATUS_ICON.includes(this.status) && typeof this.label === 'boolean';
    },
    // theme=circle 获取直径
    diameter(): number {
      let diameter = CIRCLE_SIZE_PX.MEDIUM;
      if (!this.size) {
        return diameter;
      }
      const { SMALL, LARGE, MEDIUM } = CIRCLE_SIZE;
      switch (this.size) {
        case SMALL:
          diameter = CIRCLE_SIZE_PX.SMALL;
          break;
        case MEDIUM:
          diameter = CIRCLE_SIZE_PX.MEDIUM;
          break;
        case LARGE:
          diameter = CIRCLE_SIZE_PX.LARGE;
          break;
        default:
          diameter = Number(this.size);
          break;
      }
      return diameter;
    },
    rPoints(): number {
      return this.diameter / 2;
    },
    radius(): number {
      return this.rPoints - this.circleStrokeWidth / 2;
    },
    circleStyle(): Styles {
      if (this.theme !== PRO_THEME.CIRCLE) {
        return {};
      }

      let fontSize = this.diameter * CIRCLE_FONT_SIZE_RATIO.MEDIUM;
      if (this.diameter <= CIRCLE_SIZE_PX.SMALL) {
        fontSize = this.diameter * CIRCLE_FONT_SIZE_RATIO.SMALL;
      } else if (this.diameter >= CIRCLE_SIZE_PX.LARGE) {
        fontSize = this.diameter * CIRCLE_FONT_SIZE_RATIO.LARGE;
      }

      return {
        width: `${this.diameter}px`,
        height: `${this.diameter}px`,
        fontSize: `${fontSize}px`,
      };
    },
    // theme=circle 环形进度条 环形宽度
    circleStrokeWidth(): number {
      const defaultWidth = this.size === CIRCLE_SIZE.SMALL ? 4 : 6;
      return this.strokeWidth ? Number(this.strokeWidth) : defaultWidth;
    },
    strokeDashArr(): string {
      const radius = (this.diameter - this.circleStrokeWidth) / 2;
      const perimeter = Math.PI * 2 * radius;
      const percent = this.percentage / 100;
      return `${perimeter * percent}  ${perimeter * (1 - percent)}`;
    },
    plumpStyles(): Styles {
      return {};
      // return this.percentage > 10 ? { color: '#fff' } : { right: '-2.5rem' };
    },
  },

  methods: {
    getIconMap() {
      const {
        CloseCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseIcon, CheckIcon, ErrorIcon,
      } = this.useGlobalIcon({
        CloseCircleFilledIcon: TdCloseCircleFilledIcon,
        CheckCircleFilledIcon: TdCheckCircleFilledIcon,
        ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
        CloseIcon: TdCloseIcon,
        CheckIcon: TdCheckIcon,
        ErrorIcon: TdErrorIcon,
      });
      const CIRCLE_ICONS = {
        success: CheckIcon,
        warning: ErrorIcon,
        error: CloseIcon,
      };
      const NORMAL_ICONS = {
        success: CheckCircleFilledIcon,
        warning: ErrorCircleFilledIcon,
        error: CloseCircleFilledIcon,
      };
      return this.theme === PRO_THEME.CIRCLE ? CIRCLE_ICONS : NORMAL_ICONS;
    },
    getLabelContent(): ScopedSlotReturnValue {
      let labelContent: string | VNode = `${this.percentage}%`;
      const status = this.status || '';
      if (STATUS_ICON.includes(status) && this.theme !== PRO_THEME.PLUMP) {
        const components = this.getIconMap();
        const component = components[status];
        if (component) {
          labelContent = <component class={[`${this.componentName}__icon`]}></component>;
        }
      }
      return labelContent;
    },
  },

  render() {
    const labelContent = (
      <div class={`${this.componentName}__info`}>{renderTNodeJSX(this, 'label', this.getLabelContent())}</div>
    );
    // 进度大于 10 ，进度百分比显示在内部；进度百分比小于 10 进度显示在外部
    const PLUMP_SEPARATE = 10;
    const separateClasses = this.percentage > PLUMP_SEPARATE ? `${this.componentName}--over-ten` : `${this.componentName}--under-ten`;
    return (
      <div class={this.componentName}>
        {this.theme === PRO_THEME.LINE && (
          <div class={`${this.componentName}--thin ${this.componentName}--status--${this.statusStyle}`}>
            <div class={`${this.componentName}__bar`} style={this.trackBgStyle}>
              <div class={`${this.componentName}__inner`} style={this.barStyle}></div>
            </div>
            {labelContent}
          </div>
        )}

        {this.theme === PRO_THEME.PLUMP && (
          <div
            class={[
              `${this.componentName}__bar ${this.componentName}--plump ${separateClasses}`,
              { [`${this.componentName}--status--${this.statusStyle}`]: this.statusStyle },
            ]}
            style={this.trackBgStyle}
          >
            <div class={`${this.componentName}__inner`} style={this.barStyle}>
              {this.percentage > PLUMP_SEPARATE && labelContent}
            </div>
            {this.percentage <= PLUMP_SEPARATE && labelContent}
          </div>
        )}

        {this.theme === PRO_THEME.CIRCLE && (
          <div
            class={`${this.componentName}--circle ${this.componentName}--status--${this.statusStyle}`}
            style={this.circleStyle}
          >
            {labelContent}
            <svg width={this.diameter} height={this.diameter} viewBox={`0 0 ${this.diameter} ${this.diameter}`}>
              <circle
                cx={this.rPoints}
                cy={this.rPoints}
                r={this.radius}
                stroke-width={this.circleStrokeWidth}
                stroke={this.trackColor}
                fill="none"
                class={`${this.componentName}__circle-outer`}
                style={this.circleStrokeStyle}
              />
              {this.percentage > 0 && (
                <circle
                  cx={this.rPoints}
                  cy={this.rPoints}
                  r={this.radius}
                  stroke-width={this.circleStrokeWidth}
                  fill="none"
                  stroke-linecap="round"
                  class={`${this.componentName}__circle-inner`}
                  transform={`matrix(0,-1,1,0,0,${this.diameter})`}
                  stroke-dasharray={this.strokeDashArr}
                  style={this.circlePathStyle}
                />
              )}
            </svg>
          </div>
        )}
      </div>
    );
  },
});
