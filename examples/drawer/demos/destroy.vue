<template>
  <div>
    <!-- 动画效果待开发 -->
    <t-drawer :visible.sync="visible" header='标题名称' destroyOnClose>
      <p>This is the body of drawer</p>
    </t-drawer>

    <t-button @click="visible = true">Open</t-button>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      visible: false,
    };
  },
});
</script>
