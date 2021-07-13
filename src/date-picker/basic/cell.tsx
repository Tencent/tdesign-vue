import Vue from 'vue';
import { prefix } from '../../config';

const name = `${prefix}-date-picker-cell`;

export default Vue.extend({
  props: {
    text: [String, Number],
    value: Date,
    active: Boolean,
    highlight: Boolean,
    disabled: Boolean,
    startOfRange: Boolean,
    endOfRange: Boolean,
    additional: Boolean,
    now: Boolean,
    firstDayOfMonth: Boolean,
    lastDayOfMonth: Boolean,
    onClick: Function,
    onMouseEnter: { type: Function },
  },
  render() {
    const {
      text,
      value,
      active,
      highlight,
      disabled,
      startOfRange,
      endOfRange,
      additional,
      now,
      firstDayOfMonth,
      lastDayOfMonth,
      onClick,
      onMouseEnter,
    } = this.$props;
    const cellClass = [
      name,
      {
        't-date-cell--now': now,
        't-date-cell--active': active,
        't-date-cell--disabled': disabled,
        't-date-cell--highlight': highlight,
        't-date-cell--active-start': startOfRange,
        't-date-cell--active-end': endOfRange,
        't-date-cell--additional': additional,
        't-date-cell--first-day-of-month': firstDayOfMonth,
        't-date-cell--last-day-of-month': lastDayOfMonth,
      },
    ];

    return (
            <td class={cellClass}>
                <div
                    class="t-date-cell__wrapper"
                    onClick={() => {
                      if (!disabled) {
                        onClick(value);
                      }
                    }}
                    onMouseenter={() => onMouseEnter && onMouseEnter(value)}
                >
                    <span class="t-date-cell__text">{{ text }}</span>
                </div>
            </td>
    );
  },
});
