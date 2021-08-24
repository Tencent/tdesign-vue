<template>
  <div>
    <t-dropdown :options="options" >
      <t-button variant="text">更多 <t-icon name="chevron-down" size="14" /></t-button>
    </t-dropdown>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      options: [{
        content: '选项一',
        value: 1,
      }, {
        content: '选项二',
        value: 2,
      }, {
        content: '选项三',
        value: 3,
        disabled: true,
      }, {
        content: '选项四',
        value: 4,
        disabled: true,
      }],
    };
  },
});
</script>
