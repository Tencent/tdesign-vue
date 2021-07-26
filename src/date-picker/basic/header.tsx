
import Vue from 'vue';
import TButton from '../../button/button';
import TIconRound from '../../icon/round';
import TIconChevronLeft from '../../icon/chevron-left';
import TIconChevronRight from '../../icon/chevron-right';

export default Vue.extend({
  components: {
    TButton,
    TIconChevronLeft,
    TIconChevronRight,
    TIconRound,
  },
  props: {
    year: Number,
    month: Number,
    type: {
      type: String,
      default: 'date',
      validator: v => ['year', 'month', 'date'].indexOf(v) > -1,
    },
    onBtnClick: Function,
    onTypeChange: Function,
  },
  render() {
    const { type, year, month, onBtnClick, onTypeChange } = this.$props;
    const startYear = parseInt((this.year / 10).toString(), 10) * 10;
    return (
      <div class="t-date-picker-header">
        <span class="t-date-picker-header-title">
          {
            type === 'year' && (
              <span>
                <span>
                  {startYear}
                </span>
                  {' 至 '}
                <span>
                  {startYear + 9}
                </span>
              </span>
            )
          }
          {
            type !== 'year' && (
              <t-button
                class="t-date-header__btn"
                variant="text"
                size="small"
                onClick={() => onTypeChange('year')}
              >
                { `${year} 年`}
              </t-button>
            )
          }
          {
            type === 'date' && (
              <t-button
                class="t-date-header__btn"
                variant="text"
                size="small"
                onClick={() => onTypeChange('month')}
              >
                { `${month === 12 ? 1 : month + 1} 月`}
              </t-button>
            )
          }
        </span>

        <span class="t-date-picker-header-controller">
          <t-button class="t-date-picker-header-controller__btn" variant="text" onClick={() => onBtnClick(-1)}>
            <t-icon-chevron-left />
          </t-button>
          <t-button class="t-date-picker-header-controller__btn t-date-picker-header-controller__btn--now" variant="text" onClick={() => onBtnClick(0)}>
            <t-icon-round />
          </t-button>
          <t-button class="t-date-picker-header-controller__btn" variant="text" onClick={() => onBtnClick(1)}>
            <t-icon-chevron-right />
          </t-button>
        </span>
      </div>
    );
  },
});
