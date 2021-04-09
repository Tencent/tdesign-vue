<template>
  <div>
    <div class="tdesign-demo-block">
      <div class="item"><t-button shape="square" variant="base">主按钮</t-button></div>
      <div class="item"><t-button shape="round" variant="base">主按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="base"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
    <div class="tdesign-demo-block">
      <div class="item"><t-button shape="square" variant="outline">次要按钮</t-button></div>
      <div class="item"><t-button shape="round" variant="outline">次要按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="outline"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
    <div class="tdesign-demo-block">
      <div class="item"><t-button shape="square" variant="dashed">虚框按钮</t-button></div>
      <div class="item"><t-button shape="round" variant="dashed">虚框按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="dashed"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
    <div class="tdesign-demo-block">
      <div class="item"><t-button shape="square" variant="text">文字按钮</t-button></div>
      <div class="item"><t-button shape="round" variant="text">文字按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="text"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
  </div>
</template>
<script>
import TIconCalendar from '@tencent/tdesign-vue/lib/icon/calendar';

export default {
  components: {
    TIconCalendar,
  },
};
</script>
<style lang="less" scoped>
.tdesign-demo-item__body {
  .t-button + .t-button {
    margin-left: 32px;
  }
  .tdesign-demo-block {
    margin-top: 16px;
    display: flex;
    .item {
      width: 150px;
    }
  }
}
.tdesign-wrap {
  display: inline-block;
  background-color: #bbbbbb;
  padding: 10px;
  margin-right: 10px;

}
</style>
