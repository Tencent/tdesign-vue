<template>
  <div>
    <h3>小尺寸</h3>
    <t-list :split="true" size="small">
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
    </t-list>

    <h3>中尺寸（默认）</h3>

    <t-list :split="true">
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
    </t-list>

    <h3>大尺寸</h3>

    <t-list :split="true" size="large">
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
      <t-list-item>列表内容列表内容</t-list-item>
    </t-list>
  </div>
</template>
<style scoped>
 div > h3:not(:first-child) {
   margin-top: 24px
 }
 div > h3 {
   margin-bottom: 16px;
 }
</style>>
