import Vue, { PropType } from 'vue';
import { CalendarPresetsMethods, CalendarPresetsProps, DateValue } from './type';

import { Button as TButton } from '../button';

export default Vue.extend<{}, CalendarPresetsMethods, {}, CalendarPresetsProps>({
  components: {
    TButton,
  },
  props: {
    locales: {
      type: Object as PropType<CalendarPresetsProps['locales']>,
      default() {
        return {};
      },
    },
    presets: {
      type: Object as PropType<CalendarPresetsProps['presets']>,
    },
    onClickRange: Function,
  },
  methods: {
    clickPreset(value: DateValue) {
      this.$props.onClickRange(value);
    },
  },
  render() {
    const { presets } = this.$props;
    if (presets) {
      return (
        <div class="t-date-picker-presets">
          <ul>
          {
            presets && Object.keys(presets).map((key: string) => (
              <li key={key}>
                <t-button theme="primary" variant="text" onClick={() => this.clickPreset(presets[key])}>{ key }</t-button>
              </li>
            ))
          }
          </ul>
        </div>
      );
    }
    return null;
  },
});
