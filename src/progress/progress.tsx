import Vue, { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import {
  CloseCircleFilledIcon as IconClearCircleFilled,
  CheckCircleFilledIcon as IconSuccessFill,
  ErrorCircleFilledIcon as IconWarningFill,
  ErrorIcon as IconWarningLine,
  CloseIcon as IconsClearLine,
  CheckIcon as IconSuccessLine,
} from 'tdesign-icons-vue';
import { prefix } from '../config';
import { getBackgroundColor } from '../utils/helper';
import {
  PRO_THEME, CIRCLE_SIZE, CIRCLE_SIZE_PX, STATUS_ICON, CIRCLE_FONT_SIZE_RATIO,
} from './constants';
import props from './props';
// import { RenderTNodeTemplate } from '../utils/render-tnode';
import { renderTNodeJSX } from '../utils/render-tnode';
import { Styles } from '../common';

const name = `${prefix}-progress`;

export default Vue.extend({
  name: 'TProgress',

  props: { ...props },

  data() {
    return {
      name,
    };
  },
  computed: {
    statusStyle(): string {
      if (this.percentage >= 100) {
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
      const height = typeof strokeWidth === 'string' ? strokeWidth : `${strokeWidth}px`;
      return {
        height,
        backgroundColor: this.trackColor,
        borderRadius: height,
      };
    },
    barStyle(): Styles {
      return {
        width: `${this.percentage}%`,
        background: this.color && getBackgroundColor(this.color),
      };
    },
    // 进度条的颜色
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

    /**
     * theme=circle 计算环形的周长
     */
    circleStrokePerimeter(): number {
      const radius = this.diameter / 2;
      const perimeter = Math.PI * 2 * (radius - this.circleStrokeWidth);
      return perimeter;
    },

    /**
     * theme=circle 计算环形进度条的长度
     */
    getPercentLength(): string {
      const percent = this.percentage / 100;
      return `${this.circleStrokePerimeter * percent}`;
    },
    /**
     * theme=circle 环形进度条展示百分比
     */
    strokeDashArr(): string {
      return `${this.getPercentLength} ${this.circleStrokePerimeter - Number(this.getPercentLength)}`;
    },

    /**
     * theme=circle 进度条偏移
     */
    strokeDashOff(): string {
      return `${this.getPercentLength}`;
    },

    plumpStyles(): Styles {
      return {};
      // return this.percentage > 10 ? { color: '#fff' } : { right: '-2.5rem' };
    },
  },

  methods: {
    getIconMap() {
      const CIRCLE_ICONS = {
        success: IconSuccessLine,
        warning: IconWarningLine,
        error: IconsClearLine,
      };
      const NORMAL_ICONS = {
        success: IconSuccessFill,
        warning: IconWarningFill,
        error: IconClearCircleFilled,
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
          labelContent = <component class={[`${name}__icon`]}></component>;
        }
      }
      return labelContent;
    },
  },

  render() {
    const labelContent = <div class={`${name}__info`}>{renderTNodeJSX(this, 'label', this.getLabelContent())}</div>;
    // 进度大于 10 ，进度百分比显示在内部；进度百分比小于 10 进度显示在外部
    const PLUMP_SEPARATE = 10;
    const separateClasses = this.percentage > PLUMP_SEPARATE ? `${name}--over-ten` : `${name}--under-ten`;
    return (
      <div class={name}>
        {this.theme === PRO_THEME.LINE && (
          <div class={`${name}--thin ${name}--status--${this.statusStyle}`}>
            <div class={`${name}__bar`} style={this.trackBgStyle}>
              <div class={`${name}__inner`} style={this.barStyle}></div>
            </div>
            {labelContent}
          </div>
        )}

        {/* 进度条内展示百分比 */}
        {this.theme === PRO_THEME.PLUMP && (
          <div
            class={[
              `${name}__bar ${name}--plump ${separateClasses}`,
              { [`${name}--status--${this.statusStyle}`]: this.statusStyle },
            ]}
            style={this.trackBgStyle}
          >
            <div class={`${name}__inner`} style={this.barStyle}>
              {this.percentage > PLUMP_SEPARATE && labelContent}
            </div>
            {this.percentage < PLUMP_SEPARATE && labelContent}
          </div>
        )}

        {/* 环形进度条部分 */}
        {this.theme === PRO_THEME.CIRCLE && (
          <div class={`${name}--circle ${name}--status--${this.statusStyle}`} style={this.circleStyle}>
            {labelContent}
            <svg width={this.diameter} height={this.diameter} viewBox={`0 0 ${this.diameter} ${this.diameter}`}>
              <circle
                cx={this.rPoints}
                cy={this.rPoints}
                r={this.radius}
                stroke-width={this.circleStrokeWidth}
                stroke={this.trackColor}
                fill="none"
                class={`${name}__circle-outer`}
              />
              <circle
                cx={this.rPoints}
                cy={this.rPoints}
                r={this.radius}
                stroke-width={this.circleStrokeWidth}
                fill="none"
                stroke-linecap="round"
                class={`${name}__circle-inner`}
                transform={`matrix(0,-1,1,0,0,${this.diameter})`}
                stroke-dasharray={this.strokeDashArr}
                stroke-dashoffset={this.strokeDashOff}
                style={this.circlePathStyle}
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
});
