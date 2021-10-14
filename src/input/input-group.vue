<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { prefix } from '../config';
import { ClassName } from '../common';

const name = `${prefix}-input-group`;
export default Vue.extend({
  name: 'TInputGroup',
  props: {
    separate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes(): ClassName {
      return [
        name,
        {
          [`${name}--separate`]: this.separate,
        },
      ];
    },
  },
});
</script>
