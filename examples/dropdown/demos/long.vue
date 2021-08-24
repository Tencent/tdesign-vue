<template>
  <div>
    <t-dropdown :options="options" :maxHeight="400" :minColumnWidth="90" >
      <t-button>hover我试试</t-button>
    </t-dropdown>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    const options = Array.from({ length: 20 }).map((v, k) => ({
      content: `选项${k + 1}`,
      value: k + 1,
    }));
    return {
      options,
    };
  },
});
</script>
<style scoped>
.t-button {
  margin-right: 20px;
}
</style>
