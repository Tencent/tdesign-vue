import Vue, { PropType } from 'vue';
import { CalendarPresetsMethods, CalendarPresetsProps, DateValue } from './interface';

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
    onClick: Function,
  },
  methods: {
    clickPreset(value: DateValue) {
      this.$props.onClick(value);
    },
  },
  render() {
    const { presets } = this.$props;
    return (
      <div class="t-date-picker-presets">
        <ul>
        {
          presets && Object.keys(presets).map((key: string) => (
            <li key={key}>
              <a onClick={() => this.clickPreset(presets[key])}>{ key }</a>
            </li>
          ))
        }
        </ul>
      </div>
    );
  },
});
