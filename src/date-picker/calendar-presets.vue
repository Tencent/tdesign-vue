<template>
  <div class="t-date-picker-presets">
    <slot v-bind:clickPresets="clickPreset">
      <ul v-if="presets">
        <li v-for="(value, key) in presets" v-bind:key="key">
          <t-button theme="primary" variant="text" v-on:click="clickPreset(value)">{{ key }}</t-button>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script lang="ts">
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
  },
  methods: {
    clickPreset(value: DateValue) {
      this.$emit('clickRange', value);
    },
  },
});
</script>
