import Vue from 'vue';
import { RoundIcon, ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-vue';
import TButton from '../../button/button';
import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { DatePickerConfig } from '../../config-provider/config-receiver';
import { prefix } from '../../config';

export default mixins(getConfigReceiverMixins<Vue, DatePickerConfig>('datePicker')).extend({
  components: {
    TButton,
    RoundIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  props: {
    year: Number,
    month: Number,
    type: {
      type: String,
      default: 'date',
      validator: (v) => ['year', 'month', 'date'].indexOf(v) > -1,
    },
    onBtnClick: Function,
    onTypeChange: Function,
  },
  render() {
    const {
      type, year, month, onBtnClick, onTypeChange,
    } = this.$props;
    const startYear = parseInt((this.year / 10).toString(), 10) * 10;
    const {
      rangeSeparator, yearAriaLabel, now, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade,
    } = this.global;
    let preLabel;
    let nextLabel;
    if (type === 'year') {
      preLabel = preDecade;
      nextLabel = nextDecade;
    } else if (type === 'date') {
      preLabel = preMonth;
      nextLabel = nextMonth;
    } else {
      preLabel = preYear;
      nextLabel = nextYear;
    }
    return (
      <div class={`${prefix}-date-picker__header`}>
        <span class={`${prefix}-date-picker__header-title`}>
          {type === 'year' && (
            <span>
              <span>{startYear}</span>
              {rangeSeparator}
              <span>{startYear + 9}</span>
            </span>
          )}
          {type !== 'year' && (
            <t-button
              class={`${prefix}-date-picker__header-btn`}
              variant="text"
              size="small"
              onClick={() => onTypeChange('year')}
            >
              {`${year} ${yearAriaLabel}`}
            </t-button>
          )}
          {type === 'date' && (
            <t-button
              class={`${prefix}-date-picker__header-btn`}
              variant="text"
              size="small"
              onClick={() => onTypeChange('month')}
            >
              {this.global.months[month]}
            </t-button>
          )}
        </span>

        <span class={`${prefix}-date-picker__header-controller`}>
          <t-button
            class={`${prefix}-date-picker__header-controller__btn`}
            variant="text"
            onClick={() => onBtnClick(-1)}
            title={preLabel}
          >
            <chevron-left-icon slot="icon" />
          </t-button>
          <t-button
            class={[
              `${prefix}-date-picker__header-controller__btn`,
              `${prefix}-date-picker__header-controller__btn--now`,
            ]}
            variant="text"
            onClick={() => onBtnClick(0)}
            title={now}
          >
            <round-icon slot="icon" />
          </t-button>
          <t-button
            class={`${prefix}-date-picker__header-controller__btn`}
            variant="text"
            onClick={() => onBtnClick(1)}
            title={nextLabel}
          >
            <chevron-right-icon slot="icon" />
          </t-button>
        </span>
      </div>
    );
  },
});
