<template>
  <div class="tdesign-demo-block-column">
    <div class="tdesign-demo-block-row">
      <div class="item"><t-button theme="primary" shape="rectangle" variant="base">填充按钮</t-button></div>
      <div class="item"><t-button theme="primary" shape="square" variant="base"><t-icon-calendar slot="icon"/></t-button></div>
      <div class="item"><t-button theme="primary" shape="round" variant="base">填充按钮</t-button></div>
      <div class="item">
        <t-button theme="primary" shape="circle" variant="base"><t-icon-calendar slot="icon"/></t-button>
      </div>
    </div>
    <div class="tdesign-demo-block-row">
      <div class="item"><t-button shape="rectangle" variant="outline">描边按钮</t-button></div>
      <div class="item"><t-button shape="square" variant="outline"><t-icon-calendar slot="icon"/></t-button></div>
      <div class="item"><t-button shape="round" variant="outline">描边按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="outline"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
    <div class="tdesign-demo-block-row">
      <div class="item"><t-button shape="rectangle" variant="dashed">虚框按钮</t-button></div>
      <div class="item"><t-button shape="square" variant="dashed"><t-icon-calendar slot="icon"/></t-button></div>
      <div class="item"><t-button shape="round" variant="dashed">虚框按钮</t-button></div>
      <div class="item"><t-button shape="circle" variant="dashed"><t-icon-calendar slot="icon"/></t-button></div>
    </div>
    <div class="tdesign-demo-block-row">
      <div class="item"><t-button shape="rectangle" variant="text">文字按钮</t-button></div>
      <div class="item"><t-button shape="square" variant="text"><t-icon-calendar slot="icon"/></t-button></div>
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
