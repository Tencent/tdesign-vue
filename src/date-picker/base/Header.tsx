import {
  defineComponent, PropType, ref, computed,
} from '@vue/composition-api';
import TJumper from '../../jumper/jumper';
import TSelect from '../../select/select';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import type { TdDatePickerProps } from '../type';

export default defineComponent({
  name: 'TDatePickerHeader',
  props: {
    mode: {
      type: String as PropType<TdDatePickerProps['mode']>,
      default: 'date',
    },
    year: Number,
    month: Number,
    onMonthChange: Function,
    onYearChange: Function,
    onJumperClick: Function,
  },
  setup(props) {
    const { classPrefix } = useConfig('classPrefix');
    const COMPONENT_NAME = usePrefixClass('date-picker__header');
    const { global } = useConfig('datePicker');

    const yearOptions = ref(initOptions(props.year));
    const showMonthPicker = props.mode === 'date' || props.mode === 'week';

    // 年份选择展示区间
    const nearestYear = computed(
      () => yearOptions.value.find((option) => option.value - props.year <= 9 && option.value - props.year >= 0)?.value
        || props.year,
    );

    const monthOptions = computed(() => global.value.months.map((item: string, index: number) => ({ label: item, value: index })));

    function initOptions(year: number) {
      const options = [];
      if (props.mode === 'year') {
        const extraYear = year % 10;
        const minYear = year - extraYear - 100;
        const maxYear = year - extraYear + 100;

        for (let i = minYear; i <= maxYear; i += 10) {
          options.push({ label: `${i} - ${i + 9}`, value: i + extraYear });
        }
      } else {
        options.push({ label: `${year}`, value: year });

        for (let i = 1; i <= 10; i++) {
          options.push({ label: `${year + i}`, value: year + i });
          options.unshift({ label: `${year - i}`, value: year - i });
        }
      }

      return options;
    }

    function loadMoreYear(year: number, type?: 'add' | 'reduce') {
      const options = [];
      if (props.mode === 'year') {
        const extraYear = year % 10;
        if (type === 'add') {
          for (let i = year - extraYear + 10; i <= year - extraYear + 50; i += 10) {
            options.push({ label: `${i} - ${i + 9}`, value: i });
          }
        } else {
          for (let i = year - extraYear - 1; i > year - extraYear - 50; i -= 10) {
            options.unshift({ label: `${i - 9} - ${i}`, value: i });
          }
        }
      } else if (type === 'add') {
        for (let i = year + 1; i <= year + 10; i++) {
          options.push({ label: `${i}`, value: i });
        }
      } else {
        for (let i = year - 1; i > year - 10; i--) {
          options.unshift({ label: `${i}`, value: i });
        }
      }

      return options;
    }

    // hover title
    const labelMap = {
      year: {
        prev: global.value.preDecade,
        current: global.value.now,
        next: global.value.nextDecade,
      },
      month: {
        prev: global.value.preYear,
        current: global.value.now,
        next: global.value.nextYear,
      },
      date: {
        prev: global.value.preMonth,
        current: global.value.now,
        next: global.value.nextMonth,
      },
    };

    function handlePanelTopClick(e: MouseEvent) {
      e.stopPropagation();

      const firstYear = yearOptions.value[0].value;
      const options = loadMoreYear(firstYear, 'reduce');
      yearOptions.value = [...options, ...yearOptions.value];
    }

    function handlePanelBottomClick(e: MouseEvent) {
      e.stopPropagation();

      const lastYear = yearOptions.value.slice(-1)[0].value;
      const options = loadMoreYear(lastYear, 'add');
      yearOptions.value = [...yearOptions.value, ...options];
    }

    return {
      COMPONENT_NAME,
      labelMap,
      nearestYear,
      classPrefix,
      monthOptions,
      yearOptions,
      showMonthPicker,
      handlePanelTopClick,
      handlePanelBottomClick,
    };
  },
  render() {
    const {
      COMPONENT_NAME,
      labelMap,
      nearestYear,
      classPrefix,
      monthOptions,
      yearOptions,
      showMonthPicker,
      handlePanelTopClick,
      handlePanelBottomClick,
    } = this;
    return (
      <div class={COMPONENT_NAME}>
        <div class={`${COMPONENT_NAME}-controller`}>
          {showMonthPicker && (
            <TSelect
              class={`${COMPONENT_NAME}-controller-month`}
              {...{
                props: {
                  value: this.month,
                  options: monthOptions,
                  onChange: (val: number) => this.onMonthChange?.(val),
                  popupProps: { attach: (triggerNode: HTMLDivElement) => triggerNode.parentElement },
                },
              }}
            />
          )}
          <TSelect
            class={`${COMPONENT_NAME}-controller-year`}
            {...{
              props: {
                value: this.mode === 'year' ? nearestYear : this.year,
                options: yearOptions,
                onChange: (val: number) => this.onYearChange?.(val),
                popupProps: { attach: (triggerNode: HTMLDivElement) => triggerNode.parentElement },
                panelTopContent: () => (
                  <div class={`${classPrefix}-select-option`} onClick={handlePanelTopClick}>
                    ...
                  </div>
                ),
                panelBottomContent: () => (
                  <div class={`${classPrefix}-select-option`} onClick={handlePanelBottomClick}>
                    ...
                  </div>
                ),
              },
            }}
          />
        </div>

        <TJumper {...{ props: { tips: labelMap[this.mode], onChange: this.onJumperClick, size: 'small' } }} />
      </div>
    );
  },
});
