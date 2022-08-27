<template>
  <div>
    <!-- @click-cancel 和 :onClickCancel 两种写法都支持； :onClickOverlay 和 @click-overlay 两种写法都支持-->
    <t-drawer
      header="抽屉标题"
      :visible="visible"
      @cancel="visible = false"
      :onOverlayClick="() => (visible = false)"
      :onConfirm="() => (visible = false)"
      :placement="placement"
    >
      <p>抽屉的内容</p>
    </t-drawer>
    <div class="tdesign-radio-button">
      <t-radio-group :defaultValue="placement" v-model="placement">
        <t-radio-button value="left">左侧</t-radio-button>
        <t-radio-button value="right">右侧</t-radio-button>
        <t-radio-button value="top">上方</t-radio-button>
        <t-radio-button value="bottom">下方</t-radio-button>
      </t-radio-group>
    </div>
    <t-button variant="outline" @click="visible = true" class="btn-top-margin">打开抽屉</t-button>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      visible: false,
      placement: 'right',
    };
  },
});
</script>
<style scoped>
.btn-top-margin {
  margin-top: 16px;
}
</style>
